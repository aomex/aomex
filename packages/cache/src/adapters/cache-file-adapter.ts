import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync, type StatementSync } from 'node:sqlite';
import { CacheAdapter } from '../cache-adapter';
import { i18n } from '../i18n';

export interface CacheFileAdapterOptions {
  /**
   * SQLite 数据库路径。传入 `':memory:'` 使用内存库。
   */
  filename: string;
  /**
   * 获取写锁的最长等待时间（毫秒），对应 `node:sqlite` 的 `timeout`。
   * @default 5000
   */
  timeout?: number;
}

type CacheKind = 'string' | 'list';

type CacheRow = {
  key: string;
  value: string;
  kind: CacheKind;
  expires: number | null;
};

type Statements = {
  get: StatementSync;
  upsert: StatementSync;
  /** 只改 value/kind，保留 TTL（对齐 Redis 对已有 key 的就地更新） */
  updateValue: StatementSync;
  delete: StatementSync;
  deleteAll: StatementSync;
  expire: StatementSync;
  /** 对齐 Redis INCR/DECR：只改 value，保留 TTL */
  incr: StatementSync;
};

/**
 * 基于 `node:sqlite` 的文件缓存适配器。
 *
 * key 只作为表主键存储，不拼进文件系统路径。
 * NX / incr / list 等读改写使用 `BEGIN IMMEDIATE`，多进程共库时保持原子语义。
 */
export class CacheFileAdapter extends CacheAdapter {
  public readonly filename: string;
  protected readonly timeout: number;
  protected db?: DatabaseSync;
  protected stmts?: Statements;

  constructor(options: CacheFileAdapterOptions) {
    super();
    this.filename =
      options.filename === ':memory:' ? options.filename : resolve(options.filename);
    this.timeout = options.timeout ?? 5_000;
  }

  override async connect(): Promise<void> {
    this.ensureConnected();
  }

  override async disconnect(): Promise<void> {
    const { db } = this;
    if (!db) return;
    if (db.isOpen) db.close();
    this.db = undefined;
    this.stmts = undefined;
  }

  override async existsKey(key: string): Promise<boolean> {
    return this.getRow(key, 'any') !== null;
  }

  override async getValue(key: string): Promise<string | null> {
    return this.getRow(key, 'string')?.value ?? null;
  }

  override async getAndDeleteValue(key: string): Promise<string | null> {
    return this.withImmediateTransaction(() => {
      const row = this.getRow(key, 'string');
      if (!row) return null;
      this.stmts!.delete.run(key);
      return row.value;
    });
  }

  override async setValue(
    key: string,
    value: string,
    durationMS?: number,
  ): Promise<boolean> {
    this.write(key, value, 'string', durationMS);
    return true;
  }

  override async setNotExistValue(
    key: string,
    value: string,
    durationMS?: number,
  ): Promise<boolean> {
    return this.withImmediateTransaction(() => {
      if (this.getRow(key, 'any')) return false;
      this.write(key, value, 'string', durationMS);
      return true;
    });
  }

  override async deleteValue(key: string): Promise<boolean> {
    this.ensureConnected();
    this.stmts!.delete.run(key);
    return true;
  }

  override async deleteAllValues(): Promise<boolean> {
    this.ensureConnected();
    this.stmts!.deleteAll.run();
    return true;
  }

  override async increaseValue(key: string): Promise<number> {
    return this.changeInteger(key, 1);
  }

  override async decreaseValue(key: string): Promise<number> {
    return this.changeInteger(key, -1);
  }

  override async expireKey(key: string, durationMS: number): Promise<boolean> {
    this.ensureConnected();
    const now = Date.now();
    const { changes } = this.stmts!.expire.run(now + durationMS, key, now);
    return changes === 1;
  }

  override async ttlKey(key: string): Promise<number> {
    const row = this.getRow(key, 'any');
    if (!row) return -2;
    if (row.expires == null) return -1;
    return row.expires - Date.now();
  }

  override async leftPushValue(key: string, ...values: string[]): Promise<boolean> {
    return this.withImmediateTransaction(() => {
      const row = this.getRow(key, 'list');
      const list = row ? this.parseList(row.value) : [];
      list.push(...values);
      this.write(key, JSON.stringify(list), 'list', undefined, !!row);
      return true;
    });
  }

  override async rightPopValue(key: string): Promise<string | null> {
    return this.withImmediateTransaction(() => {
      const row = this.getRow(key, 'list');
      if (!row) return null;
      const list = this.parseList(row.value);
      const value = list.pop() ?? null;
      if (!list.length) {
        this.stmts!.delete.run(key);
      } else {
        this.write(key, JSON.stringify(list), 'list', undefined, true);
      }
      return value;
    });
  }

  /** 写锁事务；已在事务中则直接执行，避免嵌套 BEGIN。 */
  protected withImmediateTransaction<T>(fn: () => T): T {
    this.ensureConnected();
    const db = this.db!;
    if (db.isTransaction) return fn();

    db.exec('BEGIN IMMEDIATE');
    try {
      const result = fn();
      db.exec('COMMIT');
      return result;
    } catch (error) {
      if (db.isTransaction) db.exec('ROLLBACK');
      throw error;
    }
  }

  protected ensureConnected(): void {
    if (this.db?.isOpen && this.stmts) return;

    if (this.filename !== ':memory:') {
      mkdirSync(dirname(this.filename), { recursive: true });
    }

    const db = new DatabaseSync(this.filename, { timeout: this.timeout });
    db.exec(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cache (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL,
        kind TEXT NOT NULL CHECK (kind IN ('string', 'list')),
        expires INTEGER
      ) STRICT;
      CREATE INDEX IF NOT EXISTS cache_expires_idx ON cache (expires);
    `);

    this.db = db;
    this.stmts = {
      get: db.prepare('SELECT key, value, kind, expires FROM cache WHERE key = ?'),
      upsert: db.prepare(`
        INSERT INTO cache (key, value, kind, expires)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(key) DO UPDATE SET
          value = excluded.value,
          kind = excluded.kind,
          expires = excluded.expires
      `),
      updateValue: db.prepare(`
        UPDATE cache SET value = ?, kind = ? WHERE key = ?
      `),
      delete: db.prepare('DELETE FROM cache WHERE key = ?'),
      deleteAll: db.prepare('DELETE FROM cache'),
      expire: db.prepare(`
        UPDATE cache SET expires = ?
        WHERE key = ? AND (expires IS NULL OR expires >= ?)
      `),
      incr: db.prepare(`
        UPDATE cache
        SET value = CAST(CAST(value AS INTEGER) + ? AS INTEGER)
        WHERE key = ?
        RETURNING value
      `),
    };
  }

  protected getRow(key: string, assertType: 'string'): CacheRow | null;
  protected getRow(key: string, assertType: 'list'): CacheRow | null;
  protected getRow(key: string, assertType: 'any'): CacheRow | null;
  protected getRow(key: string, assertType: 'string' | 'list' | 'any'): CacheRow | null {
    this.ensureConnected();
    const row = this.stmts!.get.get(key) as CacheRow | undefined;
    if (!row) return null;
    if (row.expires != null && row.expires < Date.now()) {
      this.stmts!.delete.run(key);
      return null;
    }
    if (assertType !== 'any' && row.kind !== assertType) {
      throw new Error(i18n.t('wrong_type'));
    }
    return row;
  }

  /**
   * @param preserveExpires 为 true 时只改 value/kind（list 就地更新、对齐 Redis 保留 TTL）
   */
  protected write(
    key: string,
    value: string,
    kind: CacheKind,
    durationMS?: number,
    preserveExpires = false,
  ): void {
    this.ensureConnected();
    if (preserveExpires) {
      this.stmts!.updateValue.run(value, kind, key);
      return;
    }
    this.stmts!.upsert.run(
      key,
      value,
      kind,
      durationMS === undefined ? null : Date.now() + durationMS,
    );
  }

  /** 对齐 Redis INCR/DECR */
  protected changeInteger(key: string, delta: number): number {
    return this.withImmediateTransaction(() => {
      const row = this.getRow(key, 'string');
      if (row) {
        if (!/^-?\d+$/.test(row.value)) {
          throw new Error(i18n.t('not_integer'));
        }
        const updated = this.stmts!.incr.get(delta, key) as { value: string };
        return Number(updated.value);
      }
      this.write(key, String(delta), 'string');
      return delta;
    });
  }

  protected parseList(value: string): string[] {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
      throw new Error(i18n.t('wrong_type'));
    }
    return parsed;
  }
}

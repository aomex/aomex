import { Caching } from '@aomex/internal-cache';
import { createHash } from 'node:crypto';
import { open, type Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export interface FileCacheOptions extends Caching.Options {
  /**
   * 缓存文件名。默认值：`aomex.cache`
   */
  filename?: string;
  /**
   * 缓存前缀，避免与其他存储数据混淆，同时有利于加快读写速度。
   */
  keyPrefix?: string;
}

interface TableSchema {
  name: string;
  value: string;
  expires: number | null;
}

export class FileCache extends Caching {
  private connectPromise: Promise<Database>;
  private tableCreated: boolean = false;
  private readonly tableName: string;

  constructor(config: FileCacheOptions = {}) {
    super(config);
    const keyPrefix = config.keyPrefix ?? '';
    this.tableName = keyPrefix
      ? 'file_cache_' + createHash('md5').update(keyPrefix).digest('hex')
      : 'file_cache';
    this.connectPromise = open({
      filename: config.filename || 'aomex.cache',
      driver: sqlite3.Database,
    });
  }

  protected async getValue(key: string): Promise<string | null> {
    const db = await this.connect();
    const result = await db.get<TableSchema>(
      `SELECT * FROM ${this.tableName} WHERE name=?`,
      key,
    );
    if (!result) return null;
    if (result.expires == null) return result.value;
    if (result.expires >= Date.now()) return result.value;
    return null;
  }

  protected async setValue(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<boolean> {
    const db = await this.connect();
    try {
      await db.run(
        `INSERT INTO ${this.tableName} (name, value, expires) VALUES (?,?,?) ON CONFLICT(name) DO UPDATE SET value=excluded.value, expires=excluded.expires`,
        [key, value, duration === undefined ? null : Date.now() + duration],
      );
      return true;
    } catch {
      return false;
    }
  }

  protected async addValue(
    key: string,
    value: string,
    duration?: number | undefined,
  ): Promise<boolean> {
    const db = await this.connect();

    if (await this.existsKey(key)) return false;

    try {
      await db.run(
        `DELETE FROM ${this.tableName} WHERE name=? AND expires IS NOT NULL AND expires<?`,
        [key, Date.now()],
      );
      await db.run(
        `INSERT INTO ${this.tableName} (name, value, expires) VALUES (?,?,?)`,
        [key, value, duration === undefined ? null : Date.now() + duration],
      );
      return true;
    } catch {
      return false;
    }
  }

  protected async existsKey(key: string): Promise<boolean> {
    const db = await this.connect();
    const result = await db.get<{ count: number }>(
      `SELECT COUNT(name) as count FROM ${this.tableName} WHERE name=? AND (expires IS NULL OR expires>=?)`,
      key,
      Date.now(),
    )!;
    return result?.count === 1;
  }

  protected override async increaseValue(key: string): Promise<number> {
    const db = await this.connect();
    try {
      let result: number = 0;
      await db.each(
        `INSERT INTO ${this.tableName} (name, value, expires) VALUES (?,?,?) ON CONFLICT(name) DO UPDATE SET value=value+1 RETURNING value`,
        [key, 1, null],
        (err, { value }): void => {
          if (err) throw err;
          result = value;
        },
      );
      return result;
    } catch (e) {
      return 0;
    }
  }

  protected override async decreaseValue(key: string): Promise<number> {
    const db = await this.connect();
    try {
      let result: number = 0;
      await db.each(
        `INSERT INTO ${this.tableName} (name, value, expires) VALUES (?,?,?) ON CONFLICT(name) DO UPDATE SET value=value-1 RETURNING value`,
        [key, -1, null],
        (err, { value }): void => {
          if (err) throw err;
          result = value;
        },
      );
      return result;
    } catch (e) {
      return 0;
    }
  }

  protected override async expireValue(key: string, duration: number): Promise<boolean> {
    const db = await this.connect();
    const result = await db.run(
      `UPDATE ${this.tableName} SET expires=? WHERE name=? AND (expires IS NULL OR expires>=?)`,
      [Date.now() + duration, key, Date.now()],
    )!;
    return result.changes === 1;
  }

  protected async deleteValue(key: string): Promise<boolean> {
    const db = await this.connect();
    try {
      await db.run(`DELETE FROM ${this.tableName} WHERE name=?`, key);
      return true;
    } catch {
      return false;
    }
  }

  protected async deleteAllValues(): Promise<boolean> {
    const db = await this.connect();
    try {
      await db.run(`DELETE FROM ${this.tableName}`);
      return true;
    } catch {
      return false;
    }
  }

  protected async connect() {
    const db = await this.connectPromise;
    if (!this.tableCreated) {
      await db.exec(`
      CREATE TABLE IF NOT EXISTS ${this.tableName} (
        name      TEXT               NOT NULL    UNIQUE,
        value     BLOB               NOT NULL,
        expires   INTEGER
      )
      `);
      this.tableCreated = true;
    }
    return db;
  }

  protected override async gc() {
    const db = await this.connect();
    try {
      await db.run(
        `DELETE FROM ${this.tableName} WHERE expires IS NOT NULL AND expires<?`,
        Date.now(),
      );
    } catch {}
  }
}

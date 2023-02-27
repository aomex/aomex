import { constants, mkdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import {
  rm,
  mkdir,
  writeFile,
  readFile,
  access,
  stat,
  utimes,
} from 'node:fs/promises';
import { pathToFiles } from '@aomex/file-parser';
import { Cache, CacheOptions } from '@aomex/core';

const notExists = async (filePath: string): Promise<boolean> => {
  try {
    await access(filePath, constants.F_OK);
    return false;
  } catch {
    return true;
  }
};

export interface FileCacheOptions extends CacheOptions {
  dir?: string;
  dirMode?: number;
  fileMode?: number;
  gcProbability?: number;
}

export class FileCache extends Cache {
  protected readonly dir: string;
  protected readonly dirMode: number;
  protected readonly fileMode?: number;
  protected readonly gcProbability: number;

  constructor(config: FileCacheOptions = {}) {
    super(config);
    this.dir = path.resolve(config.dir || './.filecache');
    this.dirMode = config.dirMode || 0o755;
    this.gcProbability = (config.gcProbability ?? 10) / 100;
    mkdirSync(this.dir, { recursive: true, mode: this.dirMode });
  }

  protected async existsKey(key: string): Promise<boolean> {
    const filePath = this.getFilePath(key);
    return this.existsFile(filePath);
  }

  protected async getValue(key: string): Promise<string | null> {
    const filePath = this.getFilePath(key);
    if (!(await this.existsFile(filePath))) return null;
    return readFile(filePath, 'utf8');
  }

  protected async existsFile(filePath: string): Promise<boolean> {
    try {
      const stats = await stat(filePath);
      if (!stats.isFile() || stats.mtimeMs <= Date.now()) return false;
      return true;
    } catch {
      return false;
    }
  }

  protected async setValue(
    key: string,
    value: string,
    duration?: number,
  ): Promise<boolean> {
    await this.gc();
    const filePath = this.getFilePath(key);

    if (duration === undefined || duration <= 0) {
      duration = 3600 * 24 * 3650 * 1000;
    }

    await mkdir(path.dirname(filePath), {
      recursive: true,
      mode: this.dirMode,
    });
    await writeFile(filePath, value, {
      mode: this.fileMode,
    });
    await utimes(filePath, new Date(), (Date.now() + duration) / 1000);
    return true;
  }

  protected async deleteValue(key: string): Promise<boolean> {
    const filePath = this.getFilePath(key);
    try {
      await rm(filePath);
    } catch {}
    return notExists(filePath);
  }

  protected async deleteAllValues(): Promise<boolean> {
    try {
      await rm(this.dir, {
        recursive: true,
      });
    } catch {}
    return notExists(this.dir);
  }

  protected getFilePath(key: string): string {
    const hashKey = createHash('md5').update(key).digest('hex');
    return path.join(
      this.dir,
      hashKey.substring(0, 2),
      hashKey.substring(2, 4),
      hashKey,
    );
  }

  protected async gc() {
    if (Math.random() > this.gcProbability) return;

    const files = await pathToFiles(path.join(this.dir, '**/*'));
    const now = Date.now();

    await Promise.all(
      files.map(async (file) => {
        const { mtimeMs } = await stat(file);
        if (mtimeMs <= now) {
          return rm(file);
        }
      }),
    );
  }
}

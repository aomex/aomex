import { MongoBinary, MongoMemoryServer } from 'mongodb-memory-server';
import { arch, platform } from 'node:os';

type MongoBinaryOpts = NonNullable<
  NonNullable<Parameters<(typeof MongoMemoryServer)['create']>[0]>['binary']
>;

/**
 * https://www.mongodb.com/try/download/community-edition/releases/archive
 */
export const getMongoBinary = (): MongoBinaryOpts => {
  return {
    version: '8.0.5',
    // window只有x64一个版本
    arch: platform() === 'win32' ? 'x64' : arch(),
  };
};

/** 预下载/命中缓存，避免 beforeEach 里首次拉二进制超时 */
export const ensureMongoBinary = async (): Promise<string> => {
  return MongoBinary.getPath(getMongoBinary());
};

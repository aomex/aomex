import { MongoMemoryServer } from 'mongodb-memory-server';
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

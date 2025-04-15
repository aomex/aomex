import { compose, middleware } from '@aomex/common';
import type { ConsoleMiddleware } from '@aomex/console';
import { migrationCreateFile } from './migration-create-file.md';
import { migrationUp } from './migration-up.md';
import { migrationDown } from './migration-down.md';
import type { Connection, ConnectOptions } from 'mongoose';

export interface MigrationOptions {
  /**
   * 模型存放位置，用于执行`mongoose.syncIndexes()`同步索引。默认值：`src/models`
   */
  modelsPath?: string;
  /**
   * 迁移文件存放位置。默认值：`src/migrations`
   */
  migrationsPath?: string;
  /**
   * 连接参数。如果已经连接并且拥有读写权限，则可以传入`mongoose.connection`
   */
  connection:
    | Connection
    | {
        uri: string;
        options?: ConnectOptions;
      };
}

export const mongooseMigration = (opts: MigrationOptions): ConsoleMiddleware => {
  const {
    migrationsPath = 'src/migrations',
    modelsPath = 'src/models',
    connection,
  } = opts;
  const middlewareList = [
    migrationCreateFile(migrationsPath),
    migrationUp({ migrationsPath, connection, modelsPath }),
    migrationDown({ migrationsPath, connection, modelsPath }),
  ];

  return middleware.console({
    fn: compose(middlewareList),
    help: {
      async onDocument(_, { children }) {
        await children(middlewareList);
      },
      async postDocument(_, { children }) {
        await children(middlewareList);
      },
    },
  });
};

import { middleware } from '@aomex/common';
import type { MigrationOptions } from './mongoose-migration.md';
import { i18n } from '../i18n';
import { syncCollectionIndex } from '../libs/sync-collection-index';
import { MigrationModel } from '../models/migration.model';
import { pathToFiles } from '@aomex/internal-file-import';
import path from 'node:path';
import { Migrate } from '../libs/migrate';
import mongoose, { createConnection } from 'mongoose';
import { terminal } from '@aomex/console';

const commandName = 'mongoose:migration:up';

export const migrationUp = (opts: Required<MigrationOptions>) => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;

      const connection =
        opts.connection instanceof mongoose.Connection
          ? opts.connection
          : await createConnection(
              opts.connection.uri,
              opts.connection.options,
            ).asPromise();
      const db = connection.db!;

      await syncCollectionIndex(opts.modelsPath);

      const migratedRows = await MigrationModel.find().sort({ filename: 'asc' }).lean();
      const migratedFiles = migratedRows.map((item) => item.filename);
      const allFiles = await pathToFiles(opts.migrationsPath);
      const waitingMigrateFiles = allFiles
        .filter((item) => !migratedFiles.includes(path.basename(item)))
        .sort();

      for (const filePath of waitingMigrateFiles) {
        const instance = await import(filePath);
        const migrate = instance.default;
        if (migrate instanceof Migrate) {
          const filename = path.basename(filePath);
          try {
            await connection.transaction(async (session) => {
              await MigrationModel.create([{ filename }], { session });
              await migrate.up(db, session);
              await MigrationModel.updateOne(
                { filename },
                { finished_at: new Date() },
                { session },
              );
            });
            terminal.printSuccess(`[up] ${filename}`);
          } catch (e) {
            terminal.printError(`[up] ${filename}`);
            throw e;
          }
        }
      }

      if (!(opts.connection instanceof mongoose.Connection)) {
        await connection.close();
      }
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('migration.up') };
      },
    },
  });
};

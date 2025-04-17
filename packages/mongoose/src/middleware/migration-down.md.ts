import { middleware } from '@aomex/common';
import type { MigrationOptions } from './mongoose-migration.md';
import { i18n } from '../i18n';
import { syncCollectionIndex } from '../libs/sync-collection-index';
import { MigrationModel } from '../models/migration.model';
import { Migrate } from '../libs/migrate';
import mongoose, { createConnection } from 'mongoose';
import { terminal } from '@aomex/console';
import { pathToFiles } from '@aomex/internal-file-import';
import { mkdir } from 'node:fs/promises';

const commandName = 'mongoose:migration:down';

export const migrationDown = (opts: Required<MigrationOptions>) => {
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

      const lastMigratedRow = await MigrationModel.findOne()
        .sort({ filename: 'desc' })
        .lean();
      const filename = lastMigratedRow?.filename;
      if (!filename) return;
      await mkdir(opts.migrationsPath, { recursive: true });
      const allFiles = await pathToFiles(opts.migrationsPath);
      const fullPath = allFiles.find((item) => item.endsWith(filename));

      if (!fullPath) {
        throw new Error(i18n.t('migration.file_not_found', { file: filename }));
      }

      const instance = await import(fullPath);
      const migrate = instance.default;
      if (migrate instanceof Migrate) {
        try {
          await connection.transaction(async (session) => {
            await MigrationModel.deleteOne({ _id: lastMigratedRow._id }, { session });
            await migrate.down(db, session);
          });
          terminal.printSuccess(`[down] ${filename}`);
        } catch (e) {
          terminal.printError(`[down] ${filename}`);
          throw e;
        }
      }

      if (!(opts.connection instanceof mongoose.Connection)) {
        await connection.close();
      }
    },
    help: {
      onDocument(doc) {
        doc[commandName] = { summary: i18n.t('migration.down') };
      },
    },
  });
};

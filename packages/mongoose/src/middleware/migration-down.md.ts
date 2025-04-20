import { middleware, rule, validate } from '@aomex/common';
import type { MigrationOptions } from './mongoose-migration.md';
import { i18n } from '../i18n';
import { syncCollectionIndex } from '../libs/sync-collection-index';
import { MigrationModel } from '../models/migration.model';
import { Migrate } from '../libs/migrate';
import mongoose, { createConnection } from 'mongoose';
import { terminal } from '@aomex/console';
import { pathToFiles } from '@aomex/internal-file-import';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const commandName = 'mongoose:migration:down';

export const migrationDown = (opts: Required<MigrationOptions>) => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;

      const { all } = await validate(ctx.input.parseArgv(), {
        all: rule.boolean().default(false),
      });

      const connection =
        opts.connection instanceof mongoose.Connection
          ? opts.connection
          : await createConnection(
              opts.connection.uri,
              opts.connection.options,
            ).asPromise();
      const db = connection.db!;

      await syncCollectionIndex(opts.modelsPath);

      const rows = await MigrationModel.find().sort({ filename: 'desc' }).lean();
      if (!rows.length) return;

      const migratedFiles = rows.map((item) => item.filename);
      await mkdir(opts.migrationsPath, { recursive: true });
      const allFiles = await pathToFiles(opts.migrationsPath);
      const executeCount = all ? migratedFiles.length : 1;

      for (let i = 0; i < executeCount; ++i) {
        const filename = migratedFiles[i]!;
        const fullPath = allFiles.find((item) =>
          item.endsWith(filename + path.extname(item)),
        );
        if (!fullPath) {
          throw new Error(i18n.t('migration.file_not_found', { file: filename }));
        }
        const instance = await import(fullPath);
        const migrate = instance.default;
        if (migrate instanceof Migrate) {
          try {
            await connection.transaction(async (session) => {
              await MigrationModel.deleteOne({ filename }, { session });
              await migrate.down(db, session);
            });
            terminal.printSuccess(`[down] ${filename}`);
          } catch (e) {
            terminal.printError(`[down] ${filename}`);
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
        doc[commandName] = {
          summary: i18n.t('migration.down'),
          parameters: [{ type: 'boolean', name: 'all', defaultValue: false }],
        };
      },
    },
  });
};

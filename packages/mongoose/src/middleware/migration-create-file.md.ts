import { middleware, rule, validate } from '@aomex/common';
import type { ConsoleMiddleware } from '@aomex/console';
import snakeCase from 'lodash.snakecase';
import { i18n } from '../i18n';
import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';

const commandName = 'mongoose:migration:create';

export const migrationCreateFile = (migrationsPath: string): ConsoleMiddleware => {
  return middleware.console({
    fn: async (ctx, next) => {
      if (ctx.input.command !== commandName) return next();
      ctx.commandMatched = true;

      const { name } = await validate(ctx.input.parseArgv(), {
        name: rule.string().optional().trim().transform(snakeCase),
      });
      const filename = `${new Date().toISOString().replaceAll(/[-TZ.:]/gi, '')}_${name}.ts`;
      const fullPath = path.join(migrationsPath, filename);
      await mkdir(path.dirname(fullPath), { recursive: true });
      await writeFile(
        fullPath,
        `import { migrate } from '@aomex/mongoose';

export default migrate({
  up: async (db, session) => {
    // up transaction
  },
  down: async (db, session) => {
    // down transaction
  },
});
`,
      );
    },
    help: {
      onDocument(doc) {
        doc[commandName] = {
          summary: i18n.t('migration.create'),
          parameters: [{ type: 'string', name: 'name' }],
        };
      },
    },
  });
};

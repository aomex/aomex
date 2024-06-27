import path from 'node:path';
import { stat } from 'node:fs/promises';
import { glob, type GlobOptionsWithFileTypesFalse, hasMagic } from 'glob';
import { normalizeGlobPath, type GlobPathOptions } from './normalize-glob-path';

export const pathToFiles = async (paths: GlobPathOptions): Promise<string[]> => {
  const opts = normalizeGlobPath(paths);

  const files = await Promise.all(
    opts.map((opt) => {
      const { dot, pattern: patterns } = opt;
      const ignore = (opt.ignore || []).slice();
      ignore.push('**/node_modules/**/**', '**/*.d.{ts,mts}');

      const options: GlobOptionsWithFileTypesFalse = {
        nodir: true,
        dot,
        ignore,
        absolute: true,
        withFileTypes: false,
        maxDepth: Infinity,
      };

      return Promise.all(
        patterns.map(async (pattern) => {
          if (!path.isAbsolute(pattern)) {
            pattern = path.resolve(pattern);
          }

          /**
           * 在windows系统默认使用反斜杠`\`拼接路径，但是glob只支持正斜杠`/`.
           * @link https://github.com/isaacs/node-glob#windows
           */
          pattern = pattern.replace(/\\/g, path.posix.sep);

          /**
           * glob.hasMagic 不支持带反斜杠(\)的路径。从glob@9.0.0起，花括号不再是魔术路径
           * @see https://github.com/isaacs/node-glob/issues/496
           */
          if (!hasMagic(pattern, { magicalBraces: true })) {
            const stats = await stat(pattern);
            if (!stats.isFile()) {
              pattern = path.posix.join(pattern, '**', '*.{ts,js,mts,mjs}');
            }
          }

          return glob(pattern, options);
        }),
      );
    }),
  );

  return [...new Set(files.flat(2))].sort();
};

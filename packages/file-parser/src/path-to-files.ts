import path from 'node:path';
import { stat } from 'node:fs/promises';
import { glob, GlobOptionsWithFileTypesFalse, hasMagic } from 'glob';

interface Options {
  pattern: string[];
  ignore?: string[];
  dot?: boolean;
}

export type PathToFileOptions = string | string[] | Options | Options[];

export const pathToFiles = async (
  paths: PathToFileOptions,
): Promise<string[]> => {
  const opts = normalize(paths);

  const files = await Promise.all(
    opts.map((opt) => {
      const { dot, pattern: patterns } = opt;
      const options: GlobOptionsWithFileTypesFalse = {
        nodir: true,
        dot,
        ignore: (opt.ignore || []).concat('**/*.d.{ts,mts,cts}'),
        withFileTypes: false,
      };

      return Promise.all(
        patterns.map(async (pattern) => {
          /**
           * path.resolve() will generate `\` on windows, however glob only support `/`.
           * The best workaround is use posix.
           * @link https://github.com/isaacs/node-glob#windows
           */
          pattern = path.posix.resolve(pattern);

          /**
           * glob.hasMagic doesn't support path with '\'
           *
           * Brace is not magic since glob@9.0.0
           * @see https://github.com/isaacs/node-glob/issues/496
           */
          if (!hasMagic(pattern, { magicalBraces: true })) {
            const stats = await stat(pattern);
            if (!stats.isFile()) {
              pattern = path.posix.resolve(
                pattern,
                `./**/*.{ts,js,mts,mjs,cts,cjs}`,
              );
            }
          }

          return glob(pattern, options);
        }),
      );
    }),
  );

  return [...new Set(files.flat(2))].map(path.normalize).sort();
};

const normalize = (paths: PathToFileOptions): Options[] => {
  if (typeof paths === 'string') {
    return [{ pattern: [paths] }];
  }

  if (Array.isArray(paths)) {
    if (!paths.length) return [];
    return isStringArray(paths) ? [{ pattern: paths }] : paths;
  }

  return [paths];
};

const isStringArray = (data: string[] | Options[]): data is string[] => {
  return typeof data[0] === 'string';
};

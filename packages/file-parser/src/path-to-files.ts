import path from 'node:path';
import { existsSync, statSync } from 'node:fs';
import glob from 'glob';

const ext = 'ts,js,mts,mjs,cts,cjs';

interface Options {
  pattern: string[];
  ignore?: string[];
  dot?: boolean;
}

export type PathToFileOptions = string | string[] | Options | Options[];

export const pathToFiles = (paths: PathToFileOptions): Promise<string[]> => {
  const opts = normalize(paths);

  return Promise.all(
    opts.map((opt) => {
      const { dot, pattern: patterns } = opt;
      const options: glob.IOptions = {
        nodir: true,
        dot,
      };
      const ignore = opt.ignore ? opt.ignore.slice() : [];
      ignore.push('**/*.d.{ts,mts,cts}');
      options.ignore = ignore;

      return Promise.all(
        patterns.map(
          (pattern) =>
            new Promise<string[]>((resolve, reject) => {
              /**
               * path.resolve() will generate `\` on windows, however glob only support `/`.
               * The best workaround is use posix.
               * @link https://github.com/isaacs/node-glob#windows
               */
              pattern = path.posix.resolve(pattern);

              /**
               * glob.hasMagic doesn't support path with '\'
               */
              if (!glob.hasMagic(pattern)) {
                if (!existsSync(pattern)) {
                  return reject('no such file or directory: ' + pattern);
                }

                if (!statSync(pattern).isFile()) {
                  pattern = path.posix.resolve(pattern, `./**/*.{${ext}}`);
                }
              }

              glob(pattern, options, (err, matches) => {
                if (err === null) {
                  resolve(matches);
                } else {
                  reject(err);
                }
              });
            }),
        ),
      ).then(flat);
    }),
  ).then(flat);
};

const flat = (matches: string[][]): string[] => {
  switch (matches.length) {
    case 0:
      return [];
    case 1:
      return matches[0]!.map(path.normalize);
    default:
      return [...new Set(matches.flat())].map(path.normalize);
  }
};

const normalize = (pattern: PathToFileOptions): Options[] => {
  if (typeof pattern === 'string') {
    return [
      {
        pattern: [pattern],
      },
    ];
  }

  if (Array.isArray(pattern)) {
    if (!pattern.length) return [];

    return isStringArray(pattern)
      ? [
          {
            pattern: pattern,
          },
        ]
      : pattern;
  }

  return [pattern];
};

const isStringArray = (data: string[] | Options[]): data is string[] => {
  return typeof data[0] === 'string';
};

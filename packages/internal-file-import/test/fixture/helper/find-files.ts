import { dirname, join, posix, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pathToFiles, type GlobPathOptions } from '../../../src';

const __dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'files');

export const findFiles = async (paths: GlobPathOptions) => {
  const result = await pathToFiles(paths);
  return result.map((item) =>
    relative(__dir, item).replaceAll('\\', posix.sep),
  );
};

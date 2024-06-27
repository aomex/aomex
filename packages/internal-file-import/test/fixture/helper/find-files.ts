import { join, posix, relative } from 'node:path';
import { pathToFiles, type GlobPathOptions } from '../../../src';

const __dir = join(import.meta.dirname, '..', 'files');

export const findFiles = async (paths: GlobPathOptions) => {
  const result = await pathToFiles(paths);
  return result.map((item) => relative(__dir, item).replaceAll('\\', posix.sep));
};

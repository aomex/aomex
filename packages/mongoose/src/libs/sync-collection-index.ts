import { getFileValues, pathToFiles } from '@aomex/internal-file-import';
import mongoose from 'mongoose';
import { mkdir } from 'node:fs/promises';

export const syncCollectionIndex = async (modelsPath: string) => {
  await mkdir(modelsPath, { recursive: true });
  const files = await pathToFiles(modelsPath);
  await getFileValues(files);
  await mongoose.syncIndexes();
};

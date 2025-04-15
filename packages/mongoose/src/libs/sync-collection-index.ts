import { getFileValues, pathToFiles } from '@aomex/internal-file-import';
import mongoose from 'mongoose';

export const syncCollectionIndex = async (modelsPath: string) => {
  const files = await pathToFiles(modelsPath);
  await getFileValues(files);
  await mongoose.syncIndexes();
};

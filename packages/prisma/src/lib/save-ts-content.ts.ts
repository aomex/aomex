import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const saveTsContent = async (output: string, tsContent: string) => {
  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'index.ts'), tsContent);
};

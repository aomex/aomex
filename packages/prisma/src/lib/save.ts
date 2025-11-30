import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const save = async (output: string, tsContent: string) => {
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output + '.ts', tsContent);
};

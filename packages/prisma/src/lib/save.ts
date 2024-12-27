import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const save = async (output: string, jsContent: string, dtsContent: string) => {
  await mkdir(path.dirname(output), { recursive: true });
  await Promise.all([
    writeFile(output + '.js', jsContent),
    writeFile(output + '.d.ts', dtsContent),
  ]);
};

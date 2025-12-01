import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import { formatContent } from './format-content';

export const saveHelperContent = async (output: string) => {
  const content = await formatContent(`
  import type { PrismaSchemaMap } from './index';
  import { overrideColumnsFactory } from '@aomex/prisma';
  
  export const overrideColumns = overrideColumnsFactory<PrismaSchemaMap>();
  `);

  await mkdir(output, { recursive: true });
  await writeFile(path.join(output, 'helper.ts'), content);
};

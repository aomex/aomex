import { getGenerators } from '@prisma/internals';
import { existsSync, rmSync } from 'fs';
import path from 'path';
import { expect, test } from 'vitest';
import pkg from '../package.json';

const fixtures = path.join(import.meta.dirname, 'fixtures');

test('meta', async () => {
  const generators = await getGenerators({
    schemaPath: path.join(fixtures, 'mysql.prisma'),
  });
  const generator = generators.pop()!;
  expect(generator.getPrettyName()).toBe(Object.keys(pkg!.bin!)[0]);
}, 100_000);

test.each(['mysql', 'postgresql', 'mongodb', 'sqlite'])(
  'generate %s',
  async (provider) => {
    const jsFile = path.join(fixtures, `temp.${provider}.js`);
    const dtsFile = path.join(fixtures, `temp.${provider}.d.ts`);
    try {
      rmSync(jsFile);
      rmSync(dtsFile);
    } catch {}
    const generators = await getGenerators({
      schemaPath: path.join(fixtures, `${provider}.prisma`),
    });
    await generators.pop()!.generate();
    expect(existsSync(jsFile)).toBeTruthy();
    expect(existsSync(dtsFile)).toBeTruthy();
    try {
      rmSync(jsFile);
      rmSync(dtsFile);
    } catch {}
  },
  100_000,
);

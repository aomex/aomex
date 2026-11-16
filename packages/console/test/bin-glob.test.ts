import { expect, test } from 'vitest';
import { glob, hasMagic } from 'glob';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** 与 bin.mjs 一致：花括号入口查找 */
test('bin 入口 glob：magicalBraces 可匹配 cli.{ts,js,...}', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'aomex-bin-glob-'));
  try {
    await writeFile(join(dir, 'cli.ts'), 'export {}');
    await mkdir(join(dir, 'src'));
    await writeFile(join(dir, 'src', 'cli.mjs'), 'export {}');

    const fileName = 'cli.{ts,js,mts,mjs}';
    expect(hasMagic(fileName, { magicalBraces: true })).toBe(true);
    expect(hasMagic(fileName)).toBe(false);

    const files = await glob([fileName, `src/${fileName}`], {
      magicalBraces: true,
      cwd: dir,
    });
    expect(files.sort()).toEqual(['cli.ts', join('src', 'cli.mjs')]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

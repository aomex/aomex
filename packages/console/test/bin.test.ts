import { execSync } from 'node:child_process';
import { mkdirSync, rmdirSync, writeFileSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterEach, beforeEach, expect, test } from 'vitest';

const bin = path.join(path.dirname(import.meta.dirname), 'src', 'bin.ts');

let dir = '';
const tmpdir = path.join(import.meta.dirname, 'tmpdir');

beforeEach(() => {
  dir = path.join(tmpdir, Date.now().toString() + Math.random().toString());
  mkdirSync(path.join(dir, 'src'), { recursive: true });
  writeFileSync(path.join(dir, 'package.json'), '{"type":"module"}');
});

afterEach(() => {
  rmdirSync(dir, { recursive: true });
});

test('找不到入口文件报错', async () => {
  expect(() =>
    execSync(`node --import tsx/esm ${bin}`, { cwd: dir, encoding: 'utf8' }),
  ).toThrowError('CLI entry file is not found');
});

test('执行.ts文件', async () => {
  await writeFile(
    path.join(dir, 'src/cli.ts'),
    `
    const a: string = "abc";
    const b = 1;
    console.log(a, b);
    `,
  );
  expect(execSync(`node --import tsx/esm ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe(
    'abc 1\n',
  );
});

test('引入缺省后缀的.ts文件', async () => {
  await writeFile(
    path.join(dir, 'src', 'cli.ts'),
    `import { str } from './b';console.log(str)`,
  );
  await writeFile(path.join(dir, 'src', 'b.ts'), `export * from './c';`);
  await writeFile(path.join(dir, 'src', 'c.js'), `export const str='abcd';`);

  expect(execSync(`node --import tsx/esm ${bin}`, { cwd: dir, encoding: 'utf8' })).toBe(
    'abcd\n',
  );
});

test('执行.ts文件使用新的进程', async () => {
  await writeFile(
    path.join(dir, 'bin.ts'),
    `
    import '${pathToFileURL(bin)}'; 
    console.log('bin:' + process.pid);
    `,
  );
  await writeFile(path.join(dir, 'src/cli.ts'), `console.log('cli:' + process.pid);`);
  const result = execSync(`node --import tsx/esm bin.ts`, {
    cwd: dir,
    encoding: 'utf8',
  });
  const binPid = Number(result.match(/bin:(\d+)/)![1]);
  const cliPid = Number(result.match(/cli:(\d+)/)![1]);
  expect(cliPid).not.toBe(binPid);
});

test('执行.js文件使用当前进程', async () => {
  await writeFile(
    path.join(dir, 'bin.ts'),
    `
    import '${pathToFileURL(bin)}'; 
    console.log('bin:' + process.pid);
    `,
  );
  await writeFile(path.join(dir, 'cli.js'), `console.log('cli:' + process.pid);`);
  const result = execSync(`node --import tsx/esm bin.ts`, {
    cwd: dir,
    encoding: 'utf8',
  });
  const binPid = result.match(/bin:(\d+)/)![1];
  const cliPid = result.match(/cli:(\d+)/)![1];
  expect(binPid).toBe(cliPid);
});

import { expect, test } from 'vitest';
import { readFileSync } from 'node:fs';
import { initializeDocument } from '../../src';

/** 与实现一致：读 cwd 下 package.json；测试进程 cwd 常为 monorepo 根 */
const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
  name?: string;
  version?: string;
};
const defaultTitle = pkg.name || 'OpenAPI';
const defaultVersion = pkg.version || '0.0.0';

test('默认返回值', async () => {
  await expect(initializeDocument()).resolves.toEqual({
    info: { title: defaultTitle, version: defaultVersion },
    openapi: '3.2.0',
    paths: {},
    tags: [],
  });
});

test('指定标题', async () => {
  await expect(initializeDocument({ info: { title: 'foo-bar' } })).resolves.toEqual({
    info: { title: 'foo-bar', version: defaultVersion },
    openapi: '3.2.0',
    paths: {},
    tags: [],
  });
});

test('指定版本号', async () => {
  await expect(initializeDocument({ info: { version: '1.2.3' } })).resolves.toEqual({
    info: { title: defaultTitle, version: '1.2.3' },
    openapi: '3.2.0',
    paths: {},
    tags: [],
  });
});

test('增加标签', async () => {
  await expect(
    initializeDocument({ tags: [{ name: 'foo' }, { name: 'bar' }] }),
  ).resolves.toEqual({
    info: { title: defaultTitle, version: defaultVersion },
    openapi: '3.2.0',
    paths: {},
    tags: [{ name: 'foo' }, { name: 'bar' }],
  });
});

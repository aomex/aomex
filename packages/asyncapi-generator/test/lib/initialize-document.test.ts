import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, expect, test } from 'vitest';
import { initializeDocument } from '../../src';

const cwd = process.cwd();

afterEach(() => {
  process.chdir(cwd);
});

test('未传 info 时用 package.json 的 name，version 回退 0.0.0', async () => {
  const doc = await initializeDocument({ asyncapi: '3.1.0' });
  expect(doc).toEqual({
    asyncapi: '3.1.0',
    info: { title: 'aomex', version: '0.0.0' },
    channels: {},
    operations: {},
    components: { messages: {} },
  });
});

test('保留 servers、id、defaultContentType 与 info 其余字段', async () => {
  const docs = {
    asyncapi: '3.1.0' as const,
    id: 'urn:aomex:chat',
    defaultContentType: 'application/json',
    servers: {
      prod: { host: 'example.com', protocol: 'wss' as const, pathname: '/ws' },
    },
    info: {
      title: 'chat',
      version: '2.0.0',
      description: '说明',
      termsOfService: 'https://example.com/terms',
      contact: { name: 'aomex', url: 'https://example.com', email: 'dev@example.com' },
      license: { name: 'MIT', url: 'https://example.com/mit' },
      externalDocs: { url: 'https://example.com/docs', description: '文档' },
      tags: [{ name: 'chat' }],
    },
  };
  const doc = await initializeDocument(docs);

  expect(doc.id).toBe(docs.id);
  expect(doc.defaultContentType).toBe(docs.defaultContentType);
  expect(doc.servers).toEqual(docs.servers);
  expect(doc.servers).not.toBe(docs.servers);
  expect(doc.info).toEqual(docs.info);
  expect(doc.channels).toEqual({});
  expect(doc.operations).toEqual({});
  expect(doc.components).toEqual({ messages: {} });
});

test('title / version 空字符串回退 package.json', async () => {
  const doc = await initializeDocument({
    asyncapi: '3.0.0',
    info: { title: '', version: '', description: '' },
  });
  expect(doc.info.title).toBe('aomex');
  expect(doc.info.version).toBe('0.0.0');
  expect(doc.info.description).toBe('');
});

test('只传 contact 时 title / version 仍回退', async () => {
  const doc = await initializeDocument({
    asyncapi: '3.1.0',
    info: { contact: { name: 'aomex' } },
  });
  expect(doc.info).toEqual({
    title: 'aomex',
    version: '0.0.0',
    contact: { name: 'aomex' },
  });
});

test('没有 package.json 时标题回退 AsyncAPI', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'asyncapi-doc-'));
  try {
    process.chdir(dir);
    const doc = await initializeDocument({ asyncapi: '3.0.0' });
    expect(doc.info).toEqual({ title: 'AsyncAPI', version: '0.0.0' });
  } finally {
    process.chdir(cwd);
    await rm(dir, { recursive: true, force: true });
  }
});

test('package.json 提供 name 与 version', async () => {
  const doc = await withPackageJson(JSON.stringify({ name: 'demo', version: '9.9.9' }), {
    asyncapi: '3.1.0',
  });
  expect(doc.info).toEqual({ title: 'demo', version: '9.9.9' });
});

test('显式 title / version 优先于 package.json', async () => {
  const doc = await withPackageJson(JSON.stringify({ name: 'demo', version: '9.9.9' }), {
    asyncapi: '3.1.0',
    info: { title: 'chat', version: '1.0.0' },
  });
  expect(doc.info).toEqual({ title: 'chat', version: '1.0.0' });
});

test('package.json 非法 JSON 时回退默认标题', async () => {
  const doc = await withPackageJson('not-json', { asyncapi: '3.1.0' });
  expect(doc.info).toEqual({ title: 'AsyncAPI', version: '0.0.0' });
});

test('package.json 为 null 时回退默认标题', async () => {
  const doc = await withPackageJson('null', { asyncapi: '3.1.0' });
  expect(doc.info).toEqual({ title: 'AsyncAPI', version: '0.0.0' });
});

test('package.json 为数组时回退默认标题', async () => {
  const doc = await withPackageJson('[]', { asyncapi: '3.1.0' });
  expect(doc.info).toEqual({ title: 'AsyncAPI', version: '0.0.0' });
});

test('package.json 为字符串时回退默认标题', async () => {
  const doc = await withPackageJson('"demo"', { asyncapi: '3.1.0' });
  expect(doc.info).toEqual({ title: 'AsyncAPI', version: '0.0.0' });
});

const withPackageJson = async (
  content: string,
  docs: Parameters<typeof initializeDocument>[0],
) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'asyncapi-doc-'));
  try {
    await writeFile(path.join(dir, 'package.json'), content);
    process.chdir(dir);
    return await initializeDocument(docs);
  } finally {
    process.chdir(cwd);
    await rm(dir, { recursive: true, force: true });
  }
};

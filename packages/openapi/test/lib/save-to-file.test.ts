import { afterEach, expect, test } from 'vitest';
import type { OpenAPI } from '@aomex/core';
import { basename, join } from 'path';
import { tmpdir } from 'os';
import { readFileSync, rmSync, statSync } from 'fs';
import { Mode } from 'stat-mode';
import { saveToFile } from '../../src';

const document: OpenAPI.Document = {
  info: { title: 'foo', version: '' },
  paths: {},
  tags: [],
  openapi: '3.0.3',
};

afterEach(async () => {
  try {
    rmSync('openapi.json');
  } catch {}
});

test('默认保存为JSON', async () => {
  const result = await saveToFile(document);

  expect(result.size).toBe('76B');
  expect(readFileSync(result.dest, 'utf8')).toMatchInlineSnapshot(
    `"{"info":{"title":"foo","version":""},"paths":{},"tags":[],"openapi":"3.0.3"}"`,
  );
});

test('指定文件名', async () => {
  const name = Math.random() + 'openapi.json';
  const result = await saveToFile(document, join(tmpdir(), name));
  expect(basename(result.dest)).toBe(name);
});

test('保存为YAML (.yml)', async () => {
  const result = await saveToFile(
    document,
    join(tmpdir(), Math.random() + 'openapi.yml'),
  );

  expect(result.size).toBe('67B');
  expect(readFileSync(result.dest, 'utf8')).toMatchInlineSnapshot(`
    "info:
      title: foo
      version: ""
    paths: {}
    tags: []
    openapi: 3.0.3
    "
  `);
});

test('保存为YAML (.yaml)', async () => {
  const result = await saveToFile(
    document,
    join(tmpdir(), Math.random() + 'openapi.yaml'),
  );

  expect(result.size).toBe('67B');
  expect(readFileSync(result.dest, 'utf8')).toMatchInlineSnapshot(`
    "info:
      title: foo
      version: ""
    paths: {}
    tags: []
    openapi: 3.0.3
    "
  `);
});

test('可以指定权限', async () => {
  const result = await saveToFile(
    document,
    join(tmpdir(), 'openapi-mode', Math.random() + 'openapi.json'),
    0o444,
  );
  expect(new Mode(statSync(result.dest)).toString()).toBe('-r--r--r--');
});

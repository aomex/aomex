import { afterEach, expect, test } from 'vitest';
import { join } from 'path';
import { tmpdir } from 'os';
import { rmSync } from 'fs';
import { rule } from '@aomex/common';
import { envelope, formatError } from '@aomex/web';
import { TestWebApp } from '../../../web/src/testing';
import { generateOpenapiWithSpinner } from '../../src';

const tempFiles: string[] = [];

afterEach(() => {
  try {
    rmSync('openapi.json');
  } catch {}
  for (const file of tempFiles.splice(0)) {
    try {
      rmSync(file);
    } catch {}
  }
});

test('指定基础文档', async () => {
  const result = await generateOpenapiWithSpinner({
    routers: [],
    docs: {
      openapi: '3.0.2',
      info: { version: '1.2.3', title: 'abc' },
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "abc",
        "version": "1.2.3",
      },
      "openapi": "3.0.2",
      "paths": {},
      "tags": [],
    }
  `);
}, 15_000);

test('手动修复文档', async () => {
  const result = await generateOpenapiWithSpinner({
    routers: [],
    docs: { info: { title: 'aomex', version: '1.2.3' } },
    fix(data) {
      data.info.description = ' desc foo bar';
      data.tags ||= [];
      data.tags.push({ name: 'foo' });
    },
  });
  expect(result).toMatchInlineSnapshot(`
    {
      "info": {
        "description": " desc foo bar",
        "title": "aomex",
        "version": "1.2.3",
      },
      "openapi": "3.0.3",
      "paths": {},
      "tags": [
        {
          "name": "foo",
        },
      ],
    }
  `);
});

test('app.envelope 经 spinner 路径收成 200 套壳', async () => {
  const saveToFile = join(tmpdir(), `spinner-envelope-${Date.now()}.json`);
  tempFiles.push(saveToFile);

  const webApp = new TestWebApp({
    envelope: {
      description: '统一响应体套壳',
      content: {
        success: envelope.success,
        statusCode: envelope.statusCode,
        data: envelope.payload,
      },
    },
    mount: [
      formatError({
        content: { code: rule.string(), message: rule.string() },
        handler(err) {
          return { code: err.code ?? 'ERR', message: err.message };
        },
      }),
    ],
  });

  const result = await generateOpenapiWithSpinner({
    routers: join(import.meta.dirname, '..', 'fixtures', 'routers', 'a.router.ts'),
    app: webApp,
    saveToFile,
  });

  expect(result).not.toBeNull();
  const method = result!.paths['/foo']!.get!;
  expect(Object.keys(method.responses!).sort()).toEqual(['200']);
  expect(method.responses!['200']).toMatchObject({
    description: '统一响应体套壳',
    content: {
      'application/json': {
        schema: {
          oneOf: [
            {
              properties: {
                success: { type: 'boolean', enum: [true] },
                data: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    result: { type: 'array' },
                    total: { type: 'integer' },
                  },
                },
              },
            },
            {
              properties: {
                success: { type: 'boolean', enum: [false] },
                data: {
                  type: 'object',
                  properties: {
                    code: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          ],
        },
      },
    },
  });
});

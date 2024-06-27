import { afterEach, expect, test } from 'vitest';
import { generateDocument } from '../../src';
import { rmSync } from 'fs';

afterEach(async () => {
  try {
    rmSync('openapi.json');
  } catch {}
});

test('指定基础文档', async () => {
  const result = await generateDocument({
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
});

test('手动修复文档', async () => {
  const result = await generateDocument({
    routers: [],
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
        "version": "0.0.0",
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

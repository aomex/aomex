import { expect, test } from 'vitest';
import { initializeDocument } from '../../src';

test('默认返回值', async () => {
  await expect(initializeDocument()).resolves.toMatchInlineSnapshot(`
    {
      "info": {
        "title": "aomex",
        "version": "0.0.0",
      },
      "openapi": "3.0.3",
      "paths": {},
      "tags": [],
    }
  `);
});

test('指定标题', async () => {
  await expect(initializeDocument({ info: { title: 'foo-bar' } })).resolves
    .toMatchInlineSnapshot(`
    {
      "info": {
        "title": "foo-bar",
        "version": "0.0.0",
      },
      "openapi": "3.0.3",
      "paths": {},
      "tags": [],
    }
  `);
});

test('指定版本号', async () => {
  await expect(initializeDocument({ info: { version: '1.2.3' } })).resolves
    .toMatchInlineSnapshot(`
    {
      "info": {
        "title": "aomex",
        "version": "1.2.3",
      },
      "openapi": "3.0.3",
      "paths": {},
      "tags": [],
    }
  `);
});

test('增加标签', async () => {
  await expect(initializeDocument({ tags: [{ name: 'foo' }, { name: 'bar' }] })).resolves
    .toMatchInlineSnapshot(`
    {
      "info": {
        "title": "aomex",
        "version": "0.0.0",
      },
      "openapi": "3.0.3",
      "paths": {},
      "tags": [
        {
          "name": "foo",
        },
        {
          "name": "bar",
        },
      ],
    }
  `);
});

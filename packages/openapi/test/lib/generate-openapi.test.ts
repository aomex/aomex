import { join } from 'path';
import { expect, test } from 'vitest';
import { middleware } from '@aomex/common';
import { generateOpenapi } from '../../src';

test('指定基础文档', async () => {
  const result = await generateOpenapi({
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
  const result = await generateOpenapi({
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

test('挂载全局中间件收集文档', async () => {
  const result = await generateOpenapi({
    routers: join(import.meta.dirname, '..', 'fixtures', 'routers', 'a.router.ts'),
    mount: [
      middleware.web({
        fn: () => {},
        openapi: {
          onDocument(doc) {
            doc.info.description = 'from-global-mount';
          },
          onMethod(methodItem) {
            methodItem.deprecated = true;
          },
        },
      }),
    ],
  });

  expect(result.info.description).toBe('from-global-mount');
  expect(result.paths['/foo']!.get!.deprecated).toBe(true);
  expect(result.paths['/bar/{id}']!.post!.deprecated).toBe(true);
  // showInOpenapi: false 的 /baz 仍不出现
  expect(result.paths['/baz']).toBeUndefined();
});

test('mount 缺省与空数组等价于不挂载', async () => {
  const routers = join(
    import.meta.dirname,
    '..',
    'fixtures',
    'routers',
    'empty.router.ts',
  );
  const without = await generateOpenapi({ routers });
  const empty = await generateOpenapi({ routers, mount: [] });
  expect(without).toEqual(empty);
});

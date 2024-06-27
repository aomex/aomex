import { expect, test, vitest } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { body } from '../../src';
import { OpenAPI, compose, rule } from '@aomex/core';

test('包含next', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: '1235' }),
  );

  const spy = vitest.fn();
  await compose([body({})])(ctx, spy);
  expect(spy).toHaveBeenCalledOnce();
  res.flush();
});

test('接收报文实体', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: '1235' }),
  );

  await compose([body({ test2: rule.number() })])(ctx);
  // @ts-expect-error
  expect(ctx['body']).toStrictEqual({ test2: 1235 });
  res.flush();
});

test('数据不合法时抛出错误', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: 'foo' }),
  );

  const spy = vitest.spyOn(ctx, 'throw');
  const fn = compose([body({ test2: rule.number() })]);
  await expect(fn(ctx)).rejects.toThrowError();
  expect(spy).toHaveBeenCalledOnce();

  res.flush();
});

test('文档', () => {
  const doc: OpenAPI.Document = {
    openapi: '',
    info: { title: '', version: '' },
    paths: {
      '/': { get: { responses: {} } },
    },
  };

  const md = body({
    foo: rule.string(),
    bar: rule.number().optional(),
    baz: rule.boolean(),
  });
  md['openapi']().onMethod?.(doc.paths['/']!.get!, {
    document: doc,
    pathName: '/',
    pathItem: doc.paths['/']!,
    methodName: 'get',
  });
  expect(doc).toMatchInlineSnapshot(`
    {
      "info": {
        "title": "",
        "version": "",
      },
      "openapi": "",
      "paths": {
        "/": {
          "get": {
            "requestBody": {
              "content": {
                "*/*": {
                  "schema": {
                    "properties": {
                      "bar": {
                        "type": "number",
                      },
                      "baz": {
                        "type": "boolean",
                      },
                      "foo": {
                        "type": "string",
                      },
                    },
                    "required": [
                      "foo",
                      "baz",
                    ],
                    "type": "object",
                  },
                },
              },
              "required": true,
            },
            "responses": {},
          },
        },
      },
    }
  `);
});

import { expect, test, vitest } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { query } from '../../src';
import { OpenAPI, compose, rule } from '@aomex/common';

test('包含next', async () => {
  const { ctx, res } = await mockServer((agent) =>
    agent.post('/').send({ tes1: 'a', test2: '1235' }),
  );

  const spy = vitest.fn();
  await compose([query({})])(ctx, spy);
  expect(spy).toHaveBeenCalledOnce();
  res.flush();
});

test('接收查询字符串', async () => {
  const { ctx, res } = await mockServer((agent) => agent.get('/?test1=foo&test2=1235'));

  await compose([query({ test2: rule.number() })])(ctx);
  // @ts-expect-error
  expect(ctx['query']).toStrictEqual({ test2: 1235 });
  res.flush();
});

test('数据不合法时抛出错误', async () => {
  const { ctx, res } = await mockServer((agent) => agent.get('/?test1=foo&test2=foo'));

  const spy = vitest.spyOn(ctx, 'throw');
  const fn = compose([query({ test2: rule.number() })]);
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

  const md = query({
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
            "parameters": [
              {
                "in": "query",
                "name": "foo",
                "required": true,
                "schema": {
                  "type": "string",
                },
              },
              {
                "in": "query",
                "name": "bar",
                "schema": {
                  "type": "number",
                },
              },
              {
                "in": "query",
                "name": "baz",
                "required": true,
                "schema": {
                  "type": "boolean",
                },
              },
            ],
            "responses": {},
          },
        },
      },
    }
  `);
});

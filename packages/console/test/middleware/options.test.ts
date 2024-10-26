import { expect, test } from 'vitest';
import {
  ConsoleApp,
  ConsoleInput,
  ConsoleMiddleware,
  options,
  type ConsoleDocument,
  ConsoleContext,
} from '../../src';
import { compose, middleware, rule } from '@aomex/common';
import { collectConsoleDocument } from '../../src/utils';

const app = new ConsoleApp();

test('中间件', () => {
  expect(options({})).toBeInstanceOf(ConsoleMiddleware);
});

test('解析参数', async () => {
  const fn = compose([
    options({
      foo: rule.string(),
      bar: rule.number().default(10),
      baz: rule.boolean(),
    }),
  ]);
  const ctx = new ConsoleContext(
    app,
    new ConsoleInput(app, ['--foo', 'test1', '--no-baz', '--other', 'data']),
  );
  await fn(ctx);
  expect(ctx).toHaveProperty('options');
  // @ts-expect-error
  expect(ctx.options).toStrictEqual({
    foo: 'test1',
    bar: 10,
    baz: false,
  });
});

test('别名', async () => {
  const fn = compose([
    options(
      {
        foo: rule.string(),
        bar: rule.number(),
      },
      {
        foo: ['f'],
        bar: ['b'],
      },
    ),
  ]);
  const ctx = new ConsoleContext(
    app,
    new ConsoleInput(app, [
      '-b',
      '15',
      '-f',
      'test1',
      '--no-baz',
      '-d',
      'test2',
      '--other',
      'data',
    ]),
  );
  await fn(ctx);
  expect(ctx).toHaveProperty('options');
  // @ts-expect-error
  expect(ctx.options).toStrictEqual({
    foo: 'test1',
    bar: 15,
  });
});

test('文档', async () => {
  const opts = options(
    {
      foo: rule.string(),
      bar: rule.number().default(10),
      baz: rule.boolean().docs({ deprecated: true }),
      test: rule.int(),
      test2: rule.array(rule.string()),
      obj: rule.object(),
    },
    {
      test: ['t', 'm'],
    },
  );
  const doc: ConsoleDocument.Document = {
    foo: {},
    bar: {},
  };
  await collectConsoleDocument({
    document: doc,
    middlewareList: [
      middleware.console({
        fn: () => {},
        help: {
          onDocument(_, { collectCommand: setCommandHook }) {
            setCommandHook('foo', [opts]);
          },
        },
      }),
    ],
    app: new ConsoleApp(),
  });
  expect(doc).toMatchInlineSnapshot(`
    {
      "bar": {},
      "foo": {
        "parameters": [
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "foo",
            "type": "string",
          },
          {
            "alias": undefined,
            "defaultValue": 10,
            "deprecated": undefined,
            "description": undefined,
            "name": "bar",
            "type": "number",
          },
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": true,
            "description": undefined,
            "name": "baz",
            "type": "boolean",
          },
          {
            "alias": [
              "t",
              "m",
            ],
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "test",
            "type": "number",
          },
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "test2",
            "type": "array",
          },
          {
            "alias": undefined,
            "defaultValue": undefined,
            "deprecated": undefined,
            "description": undefined,
            "name": "obj",
            "type": "string",
          },
        ],
      },
    }
  `);
});

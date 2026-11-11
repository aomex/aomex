import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';
import { ObjectValidator, toDocument, toValidator, rule, schema } from '../../../src';
import { MockValidator } from '../../mock/mock-validator';

describe('补充文档', () => {
  const validator = new MockValidator()['docs']({
    title: 'test1',
    description: 'desc1',
  });

  test('merge模式', () => {
    expect(toDocument(validator['docs']({ title: 'test2' }))).toMatchInlineSnapshot(`
      {
        "description": "desc1",
        "required": true,
        "schema": {
          "description": "desc1",
          "title": "test2",
        },
      }
    `);
  });

  test('replace模式', () => {
    expect(toDocument(validator['docs']({ title: 'test3' }, 'replace')))
      .toMatchInlineSnapshot(`
      {
        "required": true,
        "schema": {
          "title": "test3",
        },
      }
    `);
  });

  test('完整文档', () => {
    expect(
      toDocument(
        validator['docs']({
          title: 'test',
          description: 'desc',
          deprecated: true,
          example: 'abcde',
          externalDocs: { url: 'http://example.com' },
        }),
      ),
    ).toMatchInlineSnapshot(`
      {
        "deprecated": true,
        "description": "desc",
        "example": "abcde",
        "required": true,
        "schema": {
          "deprecated": true,
          "description": "desc",
          "example": "abcde",
          "externalDocs": {
            "url": "http://example.com",
          },
          "title": "test",
        },
      }
    `);
  });
});

test('获取文档', () => {
  const validator = new MockValidator();
  expect(toDocument(validator)).toMatchInlineSnapshot(`
    {
      "required": true,
      "schema": {},
    }
  `);
  expect(toDocument(validator['optional']())).toMatchInlineSnapshot(`
    {
      "schema": {},
    }
  `);
  expect(toDocument(validator['default']('abc')['nullable']())).toMatchInlineSnapshot(`
    {
      "schema": {
        "default": "abc",
        "nullable": true,
      },
    }
  `);
});

test('asName 的 schema 直接 toDocument 写入 x-ref', () => {
  const docs = toDocument(
    schema({
      id: rule.int(),
      name: rule.string(),
    }).asName('User'),
  );
  expect(docs.schema).toMatchObject({
    'type': 'object',
    'x-ref': 'User',
    'properties': {
      id: { type: 'integer' },
      name: { type: 'string' },
    },
  });
});

test('未设置 refName 时 object 不打 x-ref', () => {
  const docs = toDocument({
    foo: rule.string(),
  });
  expect(docs.schema).toMatchObject({
    type: 'object',
    properties: { foo: { type: 'string' } },
  });
  expect(docs.schema).not.toHaveProperty('x-ref');
  expect(
    toDocument(
      new ObjectValidator({
        foo: rule.string(),
      }),
    ).schema,
  ).not.toHaveProperty('x-ref');
});

test('refName=true 时 x-ref 为内容 MD5', () => {
  const validator = new ObjectValidator({ foo: rule.string() });
  validator['config'].refName = true;
  const docs = toDocument(validator);
  expect((docs.schema as Record<string, unknown>)['x-ref']).toMatch(/^[a-f0-9]{32}$/);
  const { 'x-ref': ref, ...rest } = docs.schema as Record<string, unknown>;
  expect(ref).toBe(createHash('md5').update(JSON.stringify(rest)).digest('hex'));
});

test('asName 含特殊字符时 encodeURIComponent', () => {
  const docs = toDocument(schema({ a: rule.string() }).asName('User Schema'));
  expect(docs.schema).toMatchObject({
    'x-ref': 'User%20Schema',
  });
});

test('嵌套 rule.object(schema) 后仍保留 asName 的 x-ref', () => {
  const profile = schema({ bio: rule.string() }).asName('Profile');
  const docs = toDocument(
    schema({
      profile: rule.object(profile),
    }).asName('User'),
  );
  expect(docs.schema).toMatchObject({
    'x-ref': 'User',
    'properties': {
      profile: {
        'type': 'object',
        'x-ref': 'Profile',
      },
    },
  });
});

test('rule.array(namedSchema) 的 items 带具名 x-ref', () => {
  const user = schema({ id: rule.int(), name: rule.string() }).asName('User');
  const docs = toDocument(rule.array(user));
  expect(docs.schema).toMatchObject({
    type: 'array',
    items: {
      'type': 'object',
      'x-ref': 'User',
      'properties': {
        id: { type: 'integer' },
        name: { type: 'string' },
      },
      'required': ['id', 'name'],
    },
  });
});

test('refName=true 时相同内容得到同一 MD5', () => {
  const make = () => {
    const validator = new ObjectValidator({
      foo: rule.string(),
      bar: rule.int().optional(),
    });
    validator['config'].refName = true;
    return validator;
  };
  const a = toDocument(make()).schema as Record<string, unknown>;
  const b = toDocument(make()).schema as Record<string, unknown>;
  expect(a['x-ref']).toMatch(/^[a-f0-9]{32}$/);
  expect(a['x-ref']).toBe(b['x-ref']);
});

test('rule.object(schema) / toValidator(schema) 继承 asName 到 refName', () => {
  const user = schema({ id: rule.int() }).asName('User');
  expect(rule.object(user)['config'].refName).toBe('User');
  expect(toValidator(user)['config'].refName).toBe('User');
  expect(toDocument(rule.object(user)).schema).toMatchObject({
    'type': 'object',
    'x-ref': 'User',
  });
  expect(toDocument(user).schema).toMatchObject({
    'type': 'object',
    'x-ref': 'User',
  });
});

test('链式改动后 refName 被清除，toDocument 不带 x-ref', () => {
  const validator = toValidator(schema({ id: rule.int() }).asName('User'))
    ['optional']()
    ['docs']({ description: 'user' });
  expect(validator['config'].refName).toBeUndefined();
  expect(toDocument(validator).schema).toMatchObject({
    type: 'object',
    description: 'user',
  });
  expect(toDocument(validator).schema).not.toHaveProperty('x-ref');
});

test('未 asName 的 rule.object(schema) 无 refName，也不打 x-ref', () => {
  const validator = rule.object(schema({ id: rule.int() }));
  expect(validator['config'].refName).toBeUndefined();
  expect(toDocument(validator).schema).not.toHaveProperty('x-ref');
});

test('非 object 不打 x-ref', () => {
  const docs = toDocument(rule.string());
  expect(docs.schema).toEqual({ type: 'string' });
  expect(docs.schema).not.toHaveProperty('x-ref');
});

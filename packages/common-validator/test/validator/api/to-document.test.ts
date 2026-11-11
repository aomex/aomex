import { createHash } from 'node:crypto';
import { describe, expect, test } from 'vitest';
import { ObjectValidator, toDocument, rule, schema } from '../../../src';
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

test('字段表 toDocument 时 x-ref 为内容 MD5', () => {
  const docs = toDocument({
    foo: rule.string(),
  });
  expect(docs.schema).toMatchObject({
    type: 'object',
    properties: { foo: { type: 'string' } },
  });
  expect((docs.schema as Record<string, unknown>)['x-ref']).toMatch(/^[a-f0-9]{32}$/);
  const { 'x-ref': ref, ...rest } = docs.schema as Record<string, unknown>;
  expect(ref).toBe(createHash('md5').update(JSON.stringify(rest)).digest('hex'));
});

test('ObjectValidator toDocument 时 x-ref 为 MD5', () => {
  const docs = toDocument(
    new ObjectValidator({
      foo: rule.string(),
    }),
  );
  expect((docs.schema as Record<string, unknown>)['x-ref']).toMatch(/^[a-f0-9]{32}$/);
});

test('asName 含特殊字符时 encodeURIComponent', () => {
  const docs = toDocument(schema({ a: rule.string() }).asName('User Schema'));
  expect(docs.schema).toMatchObject({
    'x-ref': 'User%20Schema',
  });
});

test('嵌套 object 各自带 x-ref（经 .object() 后为 MD5）', () => {
  const profile = schema({ bio: rule.string() }).asName('Profile');
  const docs = toDocument(
    schema({
      profile: profile.object(),
    }).asName('User'),
  );
  expect(docs.schema).toMatchObject({
    'x-ref': 'User',
    'properties': {
      profile: {
        type: 'object',
      },
    },
  });
  expect(
    (docs.schema as { properties: { profile: Record<string, unknown> } }).properties
      .profile['x-ref'],
  ).toMatch(/^[a-f0-9]{32}$/);
});

test('非 object 不打 x-ref', () => {
  const docs = toDocument(rule.string());
  expect(docs.schema).toEqual({ type: 'string' });
  expect(docs.schema).not.toHaveProperty('x-ref');
});

import { expect, test } from 'vitest';
import {
  AllOfValidator,
  AnyOfValidator,
  AnyValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateValidator,
  DecimalValidator,
  EmailValidator,
  EnumValidator,
  HashValidator,
  IntValidator,
  IpValidator,
  LiteralValidator,
  NumberValidator,
  ObjectValidator,
  OneOfValidator,
  StringValidator,
  UlidValidator,
  UrlValidator,
  UuidValidator,
  rule,
  schema,
  validate,
} from '../../../src';

test('allOf', () => {
  expect(rule.allOf([rule.stream(), rule.number()])).toBeInstanceOf(AllOfValidator);
});

test('allOf 支持 schema 与字段表', async () => {
  const user = schema({ id: rule.int(), name: rule.string() });
  const validator = rule.allOf([user, { id: rule.int(), name: rule.string() }]);
  expect(validator).toBeInstanceOf(AllOfValidator);
  await expect(validate({ id: 1, name: 'a' }, validator)).resolves.toEqual({
    id: 1,
    name: 'a',
  });
  await expect(validate({ id: 1 }, validator)).rejects.toThrow();
});

test('any', () => {
  expect(rule.any()).toBeInstanceOf(AnyValidator);
});

test('anyOf', () => {
  expect(rule.anyOf([rule.stream(), rule.number()])).toBeInstanceOf(AnyOfValidator);
});

test('anyOf 支持 schema 与字段表', async () => {
  const user = schema({ id: rule.int() });
  const validator = rule.anyOf([user, rule.string(), { code: rule.int() }]);
  expect(validator).toBeInstanceOf(AnyOfValidator);
  await expect(validate({ id: 1 }, validator)).resolves.toEqual({ id: 1 });
  await expect(validate('x', validator)).resolves.toBe('x');
  await expect(validate({ code: 2 }, validator)).resolves.toEqual({ code: 2 });
  await expect(validate(true, validator)).rejects.toThrow();
});

test('array', () => {
  expect(rule.array()).toBeInstanceOf(ArrayValidator);
});

test('array 支持 schema', async () => {
  const user = schema({ id: rule.int(), name: rule.string() });
  const validator = rule.array(user);
  expect(validator).toBeInstanceOf(ArrayValidator);
  await expect(validate([{ id: 1, name: 'a' }], validator)).resolves.toEqual([
    { id: 1, name: 'a' },
  ]);
  await expect(validate([{ id: 1 }], validator)).rejects.toThrow();
});

test('bigint', () => {
  expect(rule.bigint()).toBeInstanceOf(BigIntValidator);
});

test('boolean', () => {
  expect(rule.boolean()).toBeInstanceOf(BooleanValidator);
});

test('buffer', () => {
  expect(rule.buffer()).toBeInstanceOf(BufferValidator);
});

test('date', () => {
  expect(rule.date()).toBeInstanceOf(DateValidator);
});

test('decimal', () => {
  expect(rule.decimal()).toBeInstanceOf(DecimalValidator);
});

test('email', () => {
  expect(rule.email()).toBeInstanceOf(EmailValidator);
});

test('enum', () => {
  expect(rule.enum(['a', 'b', 1])).toBeInstanceOf(EnumValidator);
});

test('hash', () => {
  expect(rule.hash('md5')).toBeInstanceOf(HashValidator);
});

test('int', () => {
  expect(rule.int()).toBeInstanceOf(IntValidator);
});

test('ip', () => {
  expect(rule.ip('v4')).toBeInstanceOf(IpValidator);
});

test('literal', () => {
  expect(rule.literal('ok')).toBeInstanceOf(LiteralValidator);
  expect(rule.literal(null)).toBeInstanceOf(LiteralValidator);
});

test('number', () => {
  expect(rule.number()).toBeInstanceOf(NumberValidator);
});

test('object', () => {
  expect(rule.object()).toBeInstanceOf(ObjectValidator);
});

test('record 等价 object().additional({ value })', async () => {
  const viaRecord = rule.record(rule.number());
  const viaAdditional = rule.object().additional({ value: rule.number() });
  expect(viaRecord).toBeInstanceOf(ObjectValidator);
  expect(viaRecord['config'].keepAdditional).toEqual(
    viaAdditional['config'].keepAdditional,
  );
  await expect(validate({ a: '1', b: 2 }, viaRecord)).resolves.toEqual({ a: 1, b: 2 });
  await expect(validate({ a: 'x' }, viaRecord)).resolves.toEqual({});

  const nested = rule.record({ id: rule.int() });
  await expect(validate({ u1: { id: '1' } }, nested)).resolves.toEqual({
    u1: { id: 1 },
  });
});

test('object 支持 schema', async () => {
  const user = schema({ id: rule.int(), name: rule.string().optional() });
  const validator = rule.object(user);
  expect(validator).toBeInstanceOf(ObjectValidator);
  await expect(validate({ id: 1 }, validator)).resolves.toEqual({ id: 1 });
  await expect(validate({ id: 1, name: 'a' }, validator)).resolves.toEqual({
    id: 1,
    name: 'a',
  });
  await expect(validate({}, validator)).rejects.toThrow();
});

test('object 嵌套裸对象等价 rule.object', async () => {
  const viaLiteral = rule.object({
    profile: {
      bio: rule.string(),
      age: rule.int().optional(),
    },
  });
  const viaObject = rule.object({
    profile: rule.object({
      bio: rule.string(),
      age: rule.int().optional(),
    }),
  });
  expect(viaLiteral['config'].properties!['profile']).toBeInstanceOf(ObjectValidator);
  const data = { profile: { bio: 'x', age: '1' } };
  await expect(validate(data, viaLiteral)).resolves.toEqual({
    profile: { bio: 'x', age: 1 },
  });
  await expect(validate(data, viaObject)).resolves.toEqual({
    profile: { bio: 'x', age: 1 },
  });
});

test('对象→数组→对象→数组→对象 深层嵌套', async () => {
  const validator = rule.object({
    groups: rule.array({
      members: rule.array({
        tag: { name: rule.string() },
      }),
    }),
  });
  await expect(
    validate(
      {
        groups: [
          {
            members: [{ tag: { name: 'a' } }, { tag: { name: 'b' } }],
          },
        ],
      },
      validator,
    ),
  ).resolves.toEqual({
    groups: [
      {
        members: [{ tag: { name: 'a' } }, { tag: { name: 'b' } }],
      },
    ],
  });
  await expect(
    validate({ groups: [{ members: [{ tag: { name: 1 } }] }] }, validator),
  ).rejects.toThrow();
});

test('oneOf', () => {
  expect(rule.oneOf([rule.string(), rule.number()])).toBeInstanceOf(OneOfValidator);
});

test('oneOf 支持 schema 与字段表', async () => {
  const user = schema({ id: rule.int() });
  const validator = rule.oneOf([user, rule.string()]);
  expect(validator).toBeInstanceOf(OneOfValidator);
  await expect(validate({ id: 1 }, validator)).resolves.toEqual({ id: 1 });
  await expect(validate('x', validator)).resolves.toBe('x');
  await expect(validate(true, validator)).rejects.toThrow();
  await expect(
    validate({ id: 1 }, rule.oneOf([user, { id: rule.int() }])),
  ).rejects.toThrow();
});

test('string', () => {
  expect(rule.string()).toBeInstanceOf(StringValidator);
});

test('ulid', () => {
  expect(rule.ulid()).toBeInstanceOf(UlidValidator);
});

test('url', () => {
  expect(rule.url()).toBeInstanceOf(UrlValidator);
});

test('uuid', () => {
  expect(rule.uuid('v4')).toBeInstanceOf(UuidValidator);
  expect(rule.uuid()['config'].uuidVersion).toMatchInlineSnapshot(`
    [
      "v1",
      "v2",
      "v3",
      "v4",
      "v5",
      "v6",
      "v7",
      "v8",
    ]
  `);
});

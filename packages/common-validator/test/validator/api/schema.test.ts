import { expect, test } from 'vitest';
import {
  ObjectValidator,
  ValidateDeniedError,
  ValidatorSchema,
  rule,
  schema,
  validate,
} from '../../../src';

const userSchema = schema({
  id: rule.int(),
  name: rule.string(),
  age: rule.int().optional(),
  email: rule.email(),
});

test('创建 ValidatorSchema', () => {
  expect(userSchema).toBeInstanceOf(ValidatorSchema);
  expect(userSchema.name).toBeUndefined();
});

test('asName 设置名称，不改变字段', async () => {
  const named = userSchema.asName('User');
  expect(named).toBeInstanceOf(ValidatorSchema);
  expect(named).not.toBe(userSchema);
  expect(named.name).toBe('User');
  expect(userSchema.name).toBeUndefined();

  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com' }, named),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: undefined,
  });
});

test('派生操作不继承 name', () => {
  const named = userSchema.asName('User');
  expect(named.pick('id').name).toBeUndefined();
  expect(named.omit('id').name).toBeUndefined();
  expect(named.extend({ tag: rule.string() }).name).toBeUndefined();
  expect(named.merge(schema({ tag: rule.string() })).name).toBeUndefined();
  expect(named.partial().name).toBeUndefined();
  expect(named.partial('name').name).toBeUndefined();
});

test('object 转为 ObjectValidator 并可校验', async () => {
  const validator = userSchema.object();
  expect(validator).toBeInstanceOf(ObjectValidator);
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com', age: '18' }, validator),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: 18,
  });
});

test('可直接交给 validate', async () => {
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com' }, userSchema),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: undefined,
  });

  await expect(
    validate({ id: 'x', name: 'a', email: 'a@b.com' }, userSchema),
  ).rejects.toThrow(ValidateDeniedError);
});

test('pick：剩余参数与数组形式等价', async () => {
  const byRest = userSchema.pick('id', 'name');
  const byArr = userSchema.pick(['id', 'name']);

  const data = { id: '1', name: 'a', email: 'a@b.com', age: '9' };
  await expect(validate(data, byRest)).resolves.toStrictEqual({ id: 1, name: 'a' });
  await expect(validate(data, byArr)).resolves.toStrictEqual({ id: 1, name: 'a' });
});

test('omit：剩余参数与数组形式等价', async () => {
  const byRest = userSchema.omit('id', 'age');
  const byArr = userSchema.omit(['id', 'age']);

  const data = { id: '1', name: 'a', email: 'a@b.com', age: '9' };
  await expect(validate(data, byRest)).resolves.toStrictEqual({
    name: 'a',
    email: 'a@b.com',
  });
  await expect(validate(data, byArr)).resolves.toStrictEqual({
    name: 'a',
    email: 'a@b.com',
  });
});

test('extend：追加与同名覆盖', async () => {
  const extended = userSchema.extend({
    phone: rule.string(),
    name: rule.string().optional(),
  });

  await expect(
    validate({ id: '1', email: 'a@b.com', phone: '123' }, extended),
  ).resolves.toStrictEqual({
    id: 1,
    email: 'a@b.com',
    phone: '123',
    name: undefined,
    age: undefined,
  });

  await expect(
    validate({ id: '1', email: 'a@b.com', phone: '123', name: 'tom' }, extended),
  ).resolves.toStrictEqual({
    id: 1,
    email: 'a@b.com',
    phone: '123',
    name: 'tom',
    age: undefined,
  });
});

test('merge：同名键以传入 schema 为准', async () => {
  const merged = userSchema.merge(
    schema({
      name: rule.string().optional(),
      role: rule.enum(['admin', 'user']),
    }),
  );

  await expect(
    validate({ id: '1', email: 'a@b.com', role: 'admin' }, merged),
  ).resolves.toStrictEqual({
    id: 1,
    email: 'a@b.com',
    role: 'admin',
    name: undefined,
    age: undefined,
  });
});

test('partial：全部字段可选', async () => {
  const patched = userSchema.partial();
  await expect(validate({}, patched)).resolves.toStrictEqual({
    id: undefined,
    name: undefined,
    age: undefined,
    email: undefined,
  });
  await expect(validate({ name: 'a' }, patched)).resolves.toStrictEqual({
    id: undefined,
    name: 'a',
    age: undefined,
    email: undefined,
  });
});

test('partial：指定字段，剩余参数与数组形式等价', async () => {
  const byRest = userSchema.partial('name', 'email');
  const byArr = userSchema.partial(['name', 'email']);

  await expect(validate({ id: '1' }, byRest)).resolves.toStrictEqual({
    id: 1,
    name: undefined,
    age: undefined,
    email: undefined,
  });
  await expect(validate({ id: '1' }, byArr)).resolves.toStrictEqual({
    id: 1,
    name: undefined,
    age: undefined,
    email: undefined,
  });

  await expect(validate({}, byRest)).rejects.toThrow(ValidateDeniedError);
});

test('嵌套 object 与 array', async () => {
  const nested = schema({
    user: userSchema.pick('id', 'name').object(),
    list: rule.array(userSchema.pick('id').object()),
  });

  await expect(
    validate(
      {
        user: { id: '1', name: 'a', email: 'ignored' },
        list: [{ id: '2' }, { id: '3' }],
      },
      nested,
    ),
  ).resolves.toStrictEqual({
    user: { id: 1, name: 'a' },
    list: [{ id: 2 }, { id: 3 }],
  });
});

test('链式派生后仍可校验', async () => {
  const createUser = userSchema
    .omit('id')
    .extend({ password: rule.string() })
    .partial('age');

  await expect(
    validate({ name: 'a', email: 'a@b.com', password: 'secret' }, createUser),
  ).resolves.toStrictEqual({
    name: 'a',
    email: 'a@b.com',
    password: 'secret',
    age: undefined,
  });
});

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
  expect(userSchema['name']).toBeUndefined();
});

test('asName 设置名称，不改变字段', async () => {
  const named = userSchema.asName('User');
  expect(named).toBeInstanceOf(ValidatorSchema);
  expect(named).not.toBe(userSchema);
  expect(named['name']).toBe('User');
  expect(userSchema['name']).toBeUndefined();

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
  expect(named.pick('id')['name']).toBeUndefined();
  expect(named.omit('id')['name']).toBeUndefined();
  expect(named.extend({ tag: rule.string() })['name']).toBeUndefined();
  expect(named.extend(schema({ tag: rule.string() }))['name']).toBeUndefined();
  expect(named.partial()['name']).toBeUndefined();
  expect(named.partial('name')['name']).toBeUndefined();
  expect(named.required()['name']).toBeUndefined();
  expect(named.required('age')['name']).toBeUndefined();
});

test('rule.object(schema) 转为 ObjectValidator 并可校验', async () => {
  const validator = rule.object(userSchema);
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

test('extend(schema)：同名键以传入 schema 为准', async () => {
  const extended = userSchema.extend(
    schema({
      name: rule.string().optional(),
      role: rule.enum(['admin', 'user']),
    }),
  );

  await expect(
    validate({ id: '1', email: 'a@b.com', role: 'admin' }, extended),
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

test('required：全部字段必填', async () => {
  const allRequired = userSchema.required();
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com' }, allRequired),
  ).rejects.toThrow(ValidateDeniedError);
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com', age: '18' }, allRequired),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: 18,
  });
});

test('required：指定字段，剩余参数与数组形式等价', async () => {
  const byRest = userSchema.required('age');
  const byArr = userSchema.required(['age']);

  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com' }, byRest),
  ).rejects.toThrow(ValidateDeniedError);
  await expect(validate({ id: '1', name: 'a', email: 'a@b.com' }, byArr)).rejects.toThrow(
    ValidateDeniedError,
  );

  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com', age: '9' }, byRest),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: 9,
  });
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com', age: '9' }, byArr),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: 9,
  });
});

test('required：有 default 时可调用，字段保持 default（no-op）', async () => {
  const withDefault = schema({
    name: rule.string().optional(),
    page: rule.int().default(1),
  });
  const tightened = withDefault.required();
  expect(tightened['rules'].page['config'].required).toBe(false);
  expect(tightened['rules'].page['config'].defaultValue).toBe(1);
  expect(tightened['rules'].name['config'].required).toBe(true);

  await expect(validate({}, tightened)).rejects.toThrow(ValidateDeniedError);
  await expect(validate({ name: 'a' }, tightened)).resolves.toStrictEqual({
    name: 'a',
    page: 1,
  });
});

test('required：与 partial 互逆', async () => {
  const roundtrip = userSchema.partial().required();
  await expect(validate({ name: 'a' }, roundtrip)).rejects.toThrow(ValidateDeniedError);
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com', age: '2' }, roundtrip),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: 2,
  });
});

test('partial/required：空数组不等于无参全量', async () => {
  // 绕过类型：[] 解包后应 no-op，不能退化成全量 optional/required
  const partialEmpty = userSchema.partial([] as any) as unknown as typeof userSchema;
  expect(partialEmpty['rules'].id['config'].required).toBe(true);
  expect(partialEmpty['rules'].age['config'].required).toBe(false);

  const requiredEmpty = userSchema.required([] as any) as unknown as typeof userSchema;
  expect(requiredEmpty['rules'].age['config'].required).toBe(false);

  const partialAll = userSchema.partial();
  expect(partialAll['rules'].id['config'].required).toBe(false);
});

test('required：指定已必填键为 no-op；required 后再 partial', async () => {
  const same = userSchema.required('name');
  expect(same['rules'].name['config'].required).toBe(true);
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com' }, same),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: undefined,
  });

  const againPartial = userSchema.required().partial('age');
  await expect(
    validate({ id: '1', name: 'a', email: 'a@b.com' }, againPartial),
  ).resolves.toStrictEqual({
    id: 1,
    name: 'a',
    email: 'a@b.com',
    age: undefined,
  });
  await expect(validate({ id: '1', name: 'a' }, againPartial)).rejects.toThrow(
    ValidateDeniedError,
  );
});

test('嵌套 object 与 array', async () => {
  const nested = schema({
    user: rule.object(userSchema.pick('id', 'name')),
    list: rule.array(userSchema.pick('id')),
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

test('嵌套裸对象入库前转为 ObjectValidator', async () => {
  const nested = schema({
    profile: {
      bio: rule.string(),
      meta: {
        level: rule.int(),
      },
    },
  });
  expect(nested['rules'].profile).toBeInstanceOf(ObjectValidator);
  expect(
    (nested['rules'].profile as unknown as ObjectValidator)['config'].properties!['meta'],
  ).toBeInstanceOf(ObjectValidator);

  await expect(
    validate({ profile: { bio: 'hi', meta: { level: '2' } } }, nested),
  ).resolves.toStrictEqual({
    profile: { bio: 'hi', meta: { level: 2 } },
  });
});

test('schema 对象→数组→对象', async () => {
  const nested = schema({
    list: rule.array({
      profile: {
        bio: rule.string(),
      },
    }),
  });
  await expect(
    validate({ list: [{ profile: { bio: 'x' } }] }, nested),
  ).resolves.toStrictEqual({
    list: [{ profile: { bio: 'x' } }],
  });
});

test('extend 嵌套裸对象同样规范化', async () => {
  const extended = userSchema.extend({
    address: {
      city: rule.string(),
    },
  });
  expect(extended['rules'].address).toBeInstanceOf(ObjectValidator);
  await expect(
    validate(
      {
        id: 1,
        name: 'a',
        email: 'a@b.com',
        address: { city: 'SH' },
      },
      extended,
    ),
  ).resolves.toMatchObject({
    address: { city: 'SH' },
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

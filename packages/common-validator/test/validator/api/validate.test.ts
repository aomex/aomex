import { expect, test } from 'vitest';
import { ValidateDeniedError, rule, schema, validate } from '../../../src';
import sleep from 'sleep-promise';

test('保留验证过的数据', async () => {
  const result = await validate(
    { test: '1', test1: '2' },
    {
      test: rule.number(),
    },
  );
  expect(result).toStrictEqual({ test: 1 });
});

test('支持传入异步数据', async () => {
  const getData = async () => {
    await sleep(100);
    return { test: '1', test1: '2' };
  };

  const result = await validate(getData(), {
    test: rule.string(),
  });
  expect(result).toStrictEqual({ test: '1' });
});

test('验证失败时抛出异常', async () => {
  const promise = validate(
    { test: '1', test1: '2' },
    {
      test: rule.object(),
      test1: rule.ulid(),
    },
  );
  await expect(() => promise).rejects.toThrow(ValidateDeniedError);
  await promise.catch((err: ValidateDeniedError) => {
    expect(err.message).toMatchInlineSnapshot(`"test必须为对象"`);
  });
});

test('显式 throwOnError: true 时失败抛错', async () => {
  const promise = validate(
    { test: '1' },
    { test: rule.object() },
    { throwOnError: true },
  );
  await expect(promise).rejects.toThrow(ValidateDeniedError);
});

test('支持自定义报错文字格式', async () => {
  const promise = validate(
    { test: '1', test1: '2' },
    {
      test: rule.object(),
      test1: rule.ulid(),
    },
    {
      errorFormatter(errors) {
        return JSON.stringify(errors);
      },
    },
  );
  await expect(() => promise).rejects.toThrow(ValidateDeniedError);
  await promise.catch((err: ValidateDeniedError) => {
    expect(err.message).toMatchInlineSnapshot(
      `"["test必须为对象","test1必须是ULID格式"]"`,
    );
  });
});

test('支持传入单个验证器', async () => {
  const result = await validate(
    { test: '1', test1: '2' },
    rule.object({
      test: rule.number(),
    }),
  );
  expect(result).toStrictEqual({ test: 1 });
});

test('支持传入 schema', async () => {
  const result = await validate(
    { test: '1', test1: '2' },
    schema({
      test: rule.number(),
    }),
  );
  expect(result).toStrictEqual({ test: 1 });
});

test('根路径报错', async () => {
  const promise = validate({ test: '1', test1: '2' }, rule.array(rule.string()));
  await expect(() => promise).rejects.toThrow(ValidateDeniedError);
  await promise.catch((err: ValidateDeniedError) => {
    expect(err.message).toMatchInlineSnapshot(`"必须为数组"`);
  });
});

test('throwOnError: false 成功时返回 data 且 errors 为 null', async () => {
  const result = await validate(
    { test: '1', extra: 'x' },
    { test: rule.number() },
    { throwOnError: false },
  );
  expect(result).toStrictEqual({ data: { test: 1 }, errors: null });
});

test('throwOnError: false 失败时返回 data: null 与全部 errors', async () => {
  const result = await validate(
    { test: '1', test1: '2' },
    {
      test: rule.object(),
      test1: rule.ulid(),
    },
    { throwOnError: false },
  );
  expect(result.data).toBeNull();
  expect(result.errors).toEqual(
    expect.arrayContaining(['test必须为对象', 'test1必须是ULID格式']),
  );
  expect(result.errors).toHaveLength(2);
});

test('throwOnError: false 根路径失败', async () => {
  const result = await validate({ a: 1 }, rule.array(rule.string()), {
    throwOnError: false,
  });
  expect(result).toStrictEqual({
    data: null,
    errors: ['必须为数组'],
  });
});

test('throwOnError: false 合法 null 与失败 null 可区分', async () => {
  const ok = await validate(null, rule.string().nullable(), { throwOnError: false });
  expect(ok).toStrictEqual({ data: null, errors: null });

  const bad = await validate(1, rule.string().nullable(), { throwOnError: false });
  expect(bad.data).toBeNull();
  expect(bad.errors).not.toBeNull();
  expect(bad.errors!.length).toBeGreaterThan(0);
});

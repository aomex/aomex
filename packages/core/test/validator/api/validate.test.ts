import { expect, test } from 'vitest';
import { ValidateDeniedError, rule, validate } from '../../../src';
import { sleep } from '@aomex/internal-tools';

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
  await expect(() => promise).rejects.toThrowError(ValidateDeniedError);
  await promise.catch((err: ValidateDeniedError) => {
    expect(err.message).toMatchInlineSnapshot(`
      "验证失败：

      - test：必须是对象类型
      - test1：必须是ULID格式
      "
    `);
  });
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
  await expect(() => promise).rejects.toThrowError(ValidateDeniedError);
  await promise.catch((err: ValidateDeniedError) => {
    expect(err.message).toMatchInlineSnapshot(
      `"["test：必须是对象类型","test1：必须是ULID格式"]"`,
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

test('根路径报错', async () => {
  const promise = validate({ test: '1', test1: '2' }, rule.array(rule.string()));
  await expect(() => promise).rejects.toThrowError(ValidateDeniedError);
  await promise.catch((err: ValidateDeniedError) => {
    expect(err.message).toMatchInlineSnapshot(`
      "验证失败：

      - ：必须是数组类型
      "
    `);
  });
});

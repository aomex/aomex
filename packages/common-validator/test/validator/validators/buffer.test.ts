import { describe, expect, test } from 'vitest';
import { BufferValidator, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new BufferValidator();

  test('parseFrom', () => {
    const v1 = validator.parseFrom('hex');
    expect(v1).toBeInstanceOf(BufferValidator);
    expect(v1).not.toBe(validator);
  });
});

test('检测缓冲类型', async () => {
  const validator = new BufferValidator();
  const buffer = Buffer.from([]);
  await expect(validator['validate'](buffer)).resolves.toStrictEqual(
    ValidateResult.accept(buffer),
  );
});

test('非缓冲类型', async () => {
  const validator = new BufferValidator();
  await expect(validator['validate']([])).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是buffer类型",
      ],
    }
  `);
});

test('从十六进制恢复', async () => {
  const validator = new BufferValidator().parseFrom('hex');
  for (const data of ['0001', '0x0001', '0X0001']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(Buffer.from([0, 1])),
    );
  }
  await expect(validator['validate']('zzz')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是buffer类型",
      ],
    }
  `);
});

test('从base64字符串恢复', async () => {
  const validator = new BufferValidator().parseFrom('base64');
  await expect(validator['validate']('AAE=')).resolves.toStrictEqual(
    ValidateResult.accept(Buffer.from([0, 1])),
  );
  await expect(validator['validate']('AAE')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是buffer类型",
      ],
    }
  `);
});

test('获取文档', () => {
  expect(new BufferValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "format": "byte",
      "type": "string",
    }
  `);
  expect(new BufferValidator().default(Buffer.from([0, 1]))['toDocument']())
    .toMatchInlineSnapshot(`
    {
      "default": "AAE=",
      "format": "byte",
      "type": "string",
    }
  `);
});

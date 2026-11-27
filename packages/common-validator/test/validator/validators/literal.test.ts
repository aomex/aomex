import { expect, test } from 'vitest';
import {
  LiteralValidator,
  ValidateResult,
  rule,
  toDocument,
  validate,
} from '../../../src';

test('匹配 string / number / boolean', async () => {
  await expect(validate('ok', rule.literal('ok'))).resolves.toBe('ok');
  await expect(validate(0, rule.literal(0))).resolves.toBe(0);
  await expect(validate(1, rule.literal(1))).resolves.toBe(1);
  await expect(validate(true, rule.literal(true))).resolves.toBe(true);
  await expect(validate(false, rule.literal(false))).resolves.toBe(false);
});

test('匹配 null', async () => {
  const validator = rule.literal(null);
  expect(validator['config'].nullable).toBe(true);
  await expect(validate(null, validator)).resolves.toBeNull();
  await expect(validate(undefined, validator)).rejects.toThrow();
  await expect(validate('', validator)).rejects.toThrow();
  await expect(validate(0, validator)).rejects.toThrow();
  await expect(validate(false, validator)).rejects.toThrow();
});

test('匹配空字符串', async () => {
  const validator = rule.literal('');
  await expect(validate('', validator)).resolves.toBe('');
  await expect(validate(undefined, validator)).rejects.toThrow();
  await expect(validate(null, validator)).rejects.toThrow();
  await expect(validate(' ', validator)).rejects.toThrow();
  await expect(validate(null, validator.nullable())).resolves.toBeNull();
  await expect(validate(undefined, validator.optional())).resolves.toBeUndefined();
});

test('非空字面量把空字符串当空值', async () => {
  await expect(validate('', rule.literal('a'))).rejects.toThrow();
  await expect(validate('', rule.literal('a').optional())).resolves.toBeUndefined();
  await expect(validate('', rule.literal(0))).rejects.toThrow();
});

test('Object.is：+0 与 -0 不相等', async () => {
  await expect(validate(0, rule.literal(0))).resolves.toBe(0);
  await expect(validate(-0, rule.literal(0))).rejects.toThrow();
  await expect(validate(0, rule.literal(-0))).rejects.toThrow();
  await expect(validate(-0, rule.literal(-0))).resolves.toBe(-0);
});

test('不做类型转换', async () => {
  await expect(validate('1', rule.literal(1))).rejects.toThrow();
  await expect(validate('true', rule.literal(true))).rejects.toThrow();
  await expect(validate('false', rule.literal(false))).rejects.toThrow();
  await expect(validate(1, rule.literal(true))).rejects.toThrow();
  await expect(validate(0, rule.literal(false))).rejects.toThrow();
  await expect(validate(null, rule.literal('a').nullable())).resolves.toBeNull();
});

test('不匹配则报错', async () => {
  const validator = new LiteralValidator('a');
  await expect(validator['validate']('b', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL不是指定的值",
      ],
    }
  `);
});

test('构造期拒绝非法值', () => {
  expect(() => new LiteralValidator(Number.NaN as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
  expect(() => new LiteralValidator(Number.POSITIVE_INFINITY as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
  expect(() => new LiteralValidator(Number.NEGATIVE_INFINITY as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
  expect(() => new LiteralValidator({} as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
  expect(() => new LiteralValidator([] as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
  expect(() => new LiteralValidator(1n as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
  expect(() => new LiteralValidator(Symbol('x') as any)).toThrow(
    /只支持字符串、数字、布尔值和 null/,
  );
});

test('optional / default / nullable', async () => {
  await expect(
    validate(undefined, rule.literal('a').optional()),
  ).resolves.toBeUndefined();
  await expect(validate(undefined, rule.literal('a').default('a'))).resolves.toBe('a');
  await expect(
    validate(
      undefined,
      rule.literal('a').default(() => 'a' as const),
    ),
  ).resolves.toBe('a');
  await expect(validate(null, rule.literal('a').nullable())).resolves.toBeNull();
  await expect(
    validate(undefined, rule.literal(null).optional()),
  ).resolves.toBeUndefined();
  await expect(validate(null, rule.literal(null).optional())).resolves.toBeNull();
});

test('transform', async () => {
  const validator = rule.literal(1).transform((v) => String(v));
  await expect(validate(1, validator)).resolves.toBe('1');
  await expect(validate(2, validator)).rejects.toThrow();
});

test('链式调用返回新实例且不修改原对象', () => {
  const base = rule.literal('a');
  const optional = base.optional();
  expect(optional).toBeInstanceOf(LiteralValidator);
  expect(optional).not.toBe(base);
  expect(optional['config']).not.toBe(base['config']);
  expect(base['config'].required).toBe(true);
  expect(optional['config'].required).toBe(false);
  expect(base['config'].value).toBe('a');
});

test('获取文档', () => {
  expect(rule.literal('a')['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        "a",
      ],
      "type": "string",
    }
  `);
  expect(rule.literal('')['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        "",
      ],
      "type": "string",
    }
  `);
  expect(rule.literal(0)['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        0,
      ],
      "type": "number",
    }
  `);
  expect(rule.literal(1)['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        1,
      ],
      "type": "number",
    }
  `);
  expect(rule.literal(true)['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        true,
      ],
      "type": "boolean",
    }
  `);
  expect(rule.literal(false)['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        false,
      ],
      "type": "boolean",
    }
  `);
  expect(rule.literal(null)['toDocument']()).toMatchInlineSnapshot(`
    {
      "enum": [
        null,
      ],
      "type": "null",
    }
  `);
});

test('ValidateResult.accept 直出', async () => {
  await expect(new LiteralValidator(2)['validate'](2)).resolves.toStrictEqual(
    ValidateResult.accept(2),
  );
});

test('nullable 文档快照', () => {
  expect(toDocument(rule.literal('a').nullable()).schema).toMatchInlineSnapshot(`
    {
      "anyOf": [
        {
          "enum": [
            "a",
          ],
          "type": "string",
        },
        {
          "type": "null",
        },
      ],
    }
  `);
  expect(toDocument(rule.literal(null).nullable()).schema).toMatchInlineSnapshot(`
    {
      "enum": [
        null,
      ],
      "type": "null",
    }
  `);
});

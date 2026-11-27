import {
  IntValidator,
  TupleValidator,
  ValidateResult,
  Validator,
  rule,
  schema,
} from '../../../src';
import { describe, expect, test } from 'vitest';

describe('tuple 校验', () => {
  test('按位置校验并返回转换后的值', async () => {
    const validator = rule.tuple([rule.string(), rule.number()]);
    await expect(validator['validate'](['hello', '42'])).resolves.toStrictEqual(
      ValidateResult.accept(['hello', 42]),
    );
  });

  test('rest 校验固定前缀后的零个或多个元素', async () => {
    const validator = rule.tuple([rule.string(), rule.number()]).rest(rule.boolean());
    await expect(validator['validate'](['hello', '42'])).resolves.toStrictEqual(
      ValidateResult.accept(['hello', 42]),
    );
    await expect(
      validator['validate'](['hello', '42', 'true', false]),
    ).resolves.toStrictEqual(ValidateResult.accept(['hello', 42, true, false]));
    await expect(
      validator['validate'](['hello', '42', 'true', 'not boolean'], 'items', 'LABEL'),
    ).resolves.toStrictEqual({
      errors: ['LABEL.3必须为布尔值'],
    });
    await expect(validator['validate'](['hello'], '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL数组长度不在指定范围内'],
    });
  });

  test('再次调用 rest 会替换原尾项规则', async () => {
    const validator = rule
      .tuple([rule.string()])
      .rest(rule.number())
      .rest(rule.boolean());
    await expect(validator['validate'](['head', true])).resolves.toStrictEqual(
      ValidateResult.accept(['head', true]),
    );
    await expect(
      validator['validate'](['head', 2], 'items', 'LABEL'),
    ).resolves.toStrictEqual({
      errors: ['LABEL.1必须为布尔值'],
    });
  });

  test('rest 支持字段表并按元素路径报告错误', async () => {
    const validator = rule.tuple([rule.string()]).rest({ id: rule.int() });
    await expect(
      validator['validate'](['head', { id: '1' }, { id: 'invalid' }], 'value', 'LABEL'),
    ).resolves.toStrictEqual({
      errors: ['LABEL.2.id必须为数字'],
    });
  });

  test('拒绝非数组和长度不匹配的值', async () => {
    const validator = rule.tuple([rule.string(), rule.number()]);
    await expect(validator['validate']('hello', '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL必须为数组'],
    });
    await expect(validator['validate'](['hello'], '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL数组长度不在指定范围内'],
    });
    await expect(
      validator['validate'](['hello', 1, true], '', 'LABEL'),
    ).resolves.toStrictEqual({
      errors: ['LABEL数组长度不在指定范围内'],
    });
  });

  test('收集各位置的错误并使用位置标签', async () => {
    const validator = rule.tuple([rule.string(), rule.number()]);
    await expect(
      validator['validate']([1, 'invalid'], 'field', 'LABEL'),
    ).resolves.toStrictEqual({
      errors: ['LABEL.0必须为字符串', 'LABEL.1必须为数字'],
    });
  });

  test('支持字段表和 schema token', async () => {
    const user = schema({ id: rule.int() });
    const validator = rule.tuple([user, { active: rule.boolean() }]);
    await expect(
      validator['validate']([{ id: '1' }, { active: 'true' }]),
    ).resolves.toStrictEqual(ValidateResult.accept([{ id: 1 }, { active: true }]));
  });

  test('支持空 tuple', async () => {
    const validator = rule.tuple([]);
    await expect(validator['validate']([])).resolves.toStrictEqual(
      ValidateResult.accept([]),
    );
    await expect(validator['validate']([1])).resolves.toStrictEqual({
      errors: ['数组长度不在指定范围内'],
    });
  });

  test('复制时保留位置规则并可探测嵌套验证器', async () => {
    const validator = rule.tuple([rule.int()]);
    const optional = validator.optional();
    expect(Validator.has(optional, IntValidator)).toBe(true);
    await expect(optional['validate'](undefined)).resolves.toStrictEqual(
      ValidateResult.accept(undefined),
    );
    await expect(validator['validate'](['1'])).resolves.toStrictEqual(
      ValidateResult.accept([1]),
    );
  });

  test('rest 可处理空固定前缀并参与嵌套验证器探测', async () => {
    const validator = rule.tuple([]).rest(rule.int());
    expect(Validator.has(validator, IntValidator)).toBe(true);
    await expect(validator['validate']([])).resolves.toStrictEqual(
      ValidateResult.accept([]),
    );
    await expect(validator['validate'](['1', '2'])).resolves.toStrictEqual(
      ValidateResult.accept([1, 2]),
    );
  });

  test('复制 rest tuple 时保留尾项规则', async () => {
    const validator = rule.tuple([rule.string()]).rest(rule.int());
    const optional = validator.optional();
    await expect(optional['validate'](undefined)).resolves.toStrictEqual(
      ValidateResult.accept(undefined),
    );
    await expect(optional['validate'](['value', '1', '2'])).resolves.toStrictEqual(
      ValidateResult.accept(['value', 1, 2]),
    );
  });

  test('校验稀疏数组中的缺失位置', async () => {
    const validator = rule.tuple([rule.string().optional(), rule.int()]);
    const sparse = new Array(2);
    sparse[1] = '1';
    await expect(validator['validate'](sparse)).resolves.toStrictEqual(
      ValidateResult.accept([undefined, 1]),
    );
  });

  test('获取固定长度的数组文档', () => {
    expect(rule.tuple([rule.string(), rule.number()])['toDocument']()).toStrictEqual({
      type: 'array',
      items: {},
      minItems: 2,
      maxItems: 2,
    });
    expect(new TupleValidator([])['toDocument']()).toStrictEqual({
      type: 'array',
      items: {},
      minItems: 0,
      maxItems: 0,
    });
    expect(
      rule.tuple([rule.string(), rule.number()]).rest(rule.boolean())['toDocument'](),
    ).toStrictEqual({
      type: 'array',
      items: {},
      minItems: 2,
      maxItems: undefined,
    });
  });
});

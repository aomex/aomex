import { describe, expect, test } from 'vitest';
import { DateValidator, ValidateResult } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new DateValidator();

  test('parseFromTimestamp', () => {
    const v1 = validator.parseFromTimestamp();
    expect(v1).toBeInstanceOf(DateValidator);
    expect(v1).not.toBe(validator);
  });

  test('min', () => {
    const v1 = validator.min(() => new Date());
    expect(v1).toBeInstanceOf(DateValidator);
    expect(v1).not.toBe(validator);
  });

  test('max', () => {
    const v1 = validator.max(() => new Date());
    expect(v1).toBeInstanceOf(DateValidator);
    expect(v1).not.toBe(validator);
  });
});

test('解析普通Date对象', async () => {
  const validator = new DateValidator();
  const now = new Date();
  const result = await validator['validate'](now);
  expect(result).toStrictEqual(ValidateResult.accept(now));
});

test('解析TZ字符串', async () => {
  const validator = new DateValidator();
  const now = new Date();
  const result = await validator['validate'](now.toISOString());
  expect(result).toStrictEqual(ValidateResult.accept(now));
});

test('字符串带时区', async () => {
  const validator = new DateValidator();
  const now = new Date('2022-02-02T00:00:00+05:00');
  const result = await validator['validate']('2022-02-02T00:00:00+05:00');
  expect(result).toStrictEqual(ValidateResult.accept(now));
});

test('字符串带时区和毫秒', async () => {
  const validator = new DateValidator();
  const now = new Date('2022-02-02T00:00:00.020+05:00');
  const result = await validator['validate']('2022-02-02T00:00:00.020+05:00');
  expect(result).toStrictEqual(ValidateResult.accept(now));

  expect((result as ValidateResult.Accepted<Date>).data.toISOString()).toBe(
    '2022-02-01T19:00:00.020Z',
  );
});

test('解析格式', async () => {
  const validator = new DateValidator(['yyyy---MM----dd', 'yyyy---MM-ddZZ']);
  await expect(validator['validate']('2024---10-01', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须是时间类型",
      ],
    }
  `);
  await expect(validator['validate']('2024---10----01')).resolves.toMatchInlineSnapshot(`
    {
      "data": 2024-09-30T16:00:00.000Z,
    }
  `);
  await expect(validator['validate']('2024---10-01+02:00')).resolves
    .toMatchInlineSnapshot(`
    {
      "data": 2024-09-30T22:00:00.000Z,
    }
  `);
});

describe('时间戳', () => {
  test('默认解析时间戳', async () => {
    const validator = new DateValidator();
    const now = new Date(1711257956199);
    const result = await validator['validate'](1711257956199);
    expect(result).toStrictEqual(ValidateResult.accept(now));
  });

  test('从unix时间戳恢复', async () => {
    const validator = new DateValidator();
    const now = new Date(1711257956000);
    const result = await validator['validate'](1711257956);
    expect(result).toStrictEqual(ValidateResult.accept(now));
  });

  test('从带毫秒的unix时间戳恢复', async () => {
    const validator = new DateValidator();
    const now = new Date(1711257956123);
    const result = await validator['validate'](1711257956.123);
    expect(result).toStrictEqual(ValidateResult.accept(now));
  });

  test('关闭解析时间戳', async () => {
    const validator = new DateValidator().parseFromTimestamp(false);
    const result = await validator['validate'](1711257956199, '', 'LABEL');
    expect(result).toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL必须是时间类型",
        ],
      }
    `);
  });
});

describe('范围', () => {
  test('最小时间（包含）', async () => {
    const validator = new DateValidator().min(() => new Date(1711257_956_000));
    await expect(validator['validate'](new Date(1711257_956_001))).resolves.toStrictEqual(
      ValidateResult.accept(new Date(1711257_956_001)),
    );
    await expect(validator['validate'](new Date(1711257_956_000))).resolves.toStrictEqual(
      ValidateResult.accept(new Date(1711257_956_000)),
    );
    await expect(validator['validate'](new Date(1711257_955_999), '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL不在指定时间内",
        ],
      }
    `);
  });

  test('最小时间（不包含）', async () => {
    const validator = new DateValidator().min(() => new Date(1711257_956_000), false);
    await expect(validator['validate'](new Date(1711257_956_000), '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL不在指定时间内",
        ],
      }
    `);
  });

  test('最大时间（包含）', async () => {
    const validator = new DateValidator().max(() => new Date(1711257_956_000));
    await expect(validator['validate'](new Date(1711257_955_999))).resolves.toStrictEqual(
      ValidateResult.accept(new Date(1711257_955_999)),
    );
    await expect(validator['validate'](new Date(1711257_956_000))).resolves.toStrictEqual(
      ValidateResult.accept(new Date(1711257_956_000)),
    );
    await expect(validator['validate'](new Date(1711257_956_001), '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL不在指定时间内",
        ],
      }
    `);
  });

  test('最大时间（不包含）', async () => {
    const validator = new DateValidator().max(() => new Date(1711257_956_000), false);
    await expect(validator['validate'](new Date(1711257_956_000), '', 'LABEL')).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "LABEL不在指定时间内",
        ],
      }
    `);
  });
});

test('获取文档', () => {
  expect(new DateValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "format": "date-time",
      "type": "string",
    }
  `);

  expect(new DateValidator().default(new Date(1711257_956_000))['toDocument']())
    .toMatchInlineSnapshot(`
    {
      "default": "2024-03-24T05:25:56.000Z",
      "format": "date-time",
      "type": "string",
    }
  `);
});

import { describe, expect, test } from 'vitest';
import { DateTimeValidator, magistrate } from '../../../src';

describe('链式调用返回新的实例', () => {
  const validator = new DateTimeValidator();

  test('parseFromTimestamp', () => {
    const v1 = validator.parseFromTimestamp();
    expect(v1).toBeInstanceOf(DateTimeValidator);
    expect(v1).not.toBe(validator);
  });

  test('min', () => {
    const v1 = validator.min(() => new Date());
    expect(v1).toBeInstanceOf(DateTimeValidator);
    expect(v1).not.toBe(validator);
  });

  test('max', () => {
    const v1 = validator.max(() => new Date());
    expect(v1).toBeInstanceOf(DateTimeValidator);
    expect(v1).not.toBe(validator);
  });
});

test('解析普通Date对象', async () => {
  const validator = new DateTimeValidator();
  const now = new Date();
  const result = await validator['validate'](now);
  expect(result).toStrictEqual(magistrate.ok(now));
});

test('解析TZ字符串', async () => {
  const validator = new DateTimeValidator();
  const now = new Date();
  const result = await validator['validate'](now.toISOString());
  expect(result).toStrictEqual(magistrate.ok(now));
});

describe('时间戳', () => {
  test('默认不解析时间戳', async () => {
    const validator = new DateTimeValidator();
    const result = await validator['validate'](1711257956199);
    expect(result).toMatchInlineSnapshot(`
      {
        "errors": [
          "：必须是时间类型",
        ],
      }
    `);
  });

  test('开启从时间戳恢复', async () => {
    const validator = new DateTimeValidator().parseFromTimestamp(true);
    const now = new Date(1711257956199);
    const result = await validator['validate'](1711257956199);
    expect(result).toStrictEqual(magistrate.ok(now));
  });

  test('从unix时间戳恢复', async () => {
    const validator = new DateTimeValidator().parseFromTimestamp(true);
    const now = new Date(1711257956000);
    const result = await validator['validate'](1711257956);
    expect(result).toStrictEqual(magistrate.ok(now));
  });

  test('从带毫秒的unix时间戳恢复', async () => {
    const validator = new DateTimeValidator().parseFromTimestamp(true);
    const now = new Date(1711257956123);
    const result = await validator['validate'](1711257956.123);
    expect(result).toStrictEqual(magistrate.ok(now));
  });
});

describe('范围', () => {
  test('最小时间（包含）', async () => {
    const validator = new DateTimeValidator().min(() => new Date(1711257_956_000));
    await expect(validator['validate'](new Date(1711257_956_001))).resolves.toStrictEqual(
      magistrate.ok(new Date(1711257_956_001)),
    );
    await expect(validator['validate'](new Date(1711257_956_000))).resolves.toStrictEqual(
      magistrate.ok(new Date(1711257_956_000)),
    );
    await expect(validator['validate'](new Date(1711257_955_999))).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "：不在指定时间内",
        ],
      }
    `);
  });

  test('最小时间（不包含）', async () => {
    const validator = new DateTimeValidator().min(() => new Date(1711257_956_000), false);
    await expect(validator['validate'](new Date(1711257_956_000))).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "：不在指定时间内",
        ],
      }
    `);
  });

  test('最大时间（包含）', async () => {
    const validator = new DateTimeValidator().max(() => new Date(1711257_956_000));
    await expect(validator['validate'](new Date(1711257_955_999))).resolves.toStrictEqual(
      magistrate.ok(new Date(1711257_955_999)),
    );
    await expect(validator['validate'](new Date(1711257_956_000))).resolves.toStrictEqual(
      magistrate.ok(new Date(1711257_956_000)),
    );
    await expect(validator['validate'](new Date(1711257_956_001))).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "：不在指定时间内",
        ],
      }
    `);
  });

  test('最大时间（不包含）', async () => {
    const validator = new DateTimeValidator().max(() => new Date(1711257_956_000), false);
    await expect(validator['validate'](new Date(1711257_956_000))).resolves
      .toMatchInlineSnapshot(`
      {
        "errors": [
          "：不在指定时间内",
        ],
      }
    `);
  });
});

test('获取文档', () => {
  expect(new DateTimeValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "default": undefined,
      "format": "date-time",
      "type": "string",
    }
  `);

  expect(new DateTimeValidator().default(new Date(1711257_956_000))['toDocument']())
    .toMatchInlineSnapshot(`
    {
      "default": "2024-03-24T05:25:56.000Z",
      "format": "date-time",
      "type": "string",
    }
  `);
});

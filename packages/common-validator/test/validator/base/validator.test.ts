import { describe, expect, test } from 'vitest';
import { MockValidator } from '../../mock/mock-validator';
import { ValidateResult, Validator } from '../../../src';
import sleep from 'sleep-promise';

describe('链式调用返回新的实例', () => {
  const validator = new MockValidator();

  test('strict', () => {
    const v1 = validator['strict']();
    expect(v1).toBeInstanceOf(MockValidator);
    expect(v1).not.toBe(validator);
  });

  test('default', () => {
    const v1 = validator['default']('');
    expect(v1).toBeInstanceOf(MockValidator);
    expect(v1).not.toBe(validator);
  });

  test('docs', () => {
    const v1 = validator['docs']({});
    expect(v1).toBeInstanceOf(MockValidator);
    expect(v1).not.toBe(validator);
  });

  test('optional', () => {
    const v1 = validator['optional']();
    expect(v1).toBeInstanceOf(MockValidator);
    expect(v1).not.toBe(validator);
  });

  test('nullable', () => {
    const v1 = validator['nullable']();
    expect(v1).toBeInstanceOf(MockValidator);
    expect(v1).not.toBe(validator);
  });

  test('transform', () => {
    const v1 = validator['transform'](() => {});
    expect(v1).toBeInstanceOf(MockValidator);
    expect(v1).not.toBe(validator);
  });
});

describe('transform()', () => {
  test('正常执行指定的transform函数', async () => {
    const validator = new MockValidator()['transform']((data) => data + '-hello');
    const result = await validator['validate']('test');
    expect(result).toStrictEqual(ValidateResult.accept('test-hello'));
  });

  test('可选的情况下也要执行transform', async () => {
    const validator = new MockValidator()
      ['optional']()
      ['transform']((data) => data + '-hello');
    const result1 = await validator['validate'](undefined);
    expect(result1).toStrictEqual(ValidateResult.accept('undefined-hello'));
    const result2 = await validator['validate']('');
    expect(result2).toStrictEqual(ValidateResult.accept('undefined-hello'));
    const result3 = await validator['validate'](null);
    expect(result3).toStrictEqual(ValidateResult.accept('undefined-hello'));
  });

  test('开启nullable时也要执行transform', async () => {
    const validator = new MockValidator()
      ['nullable']()
      ['transform']((data) => data + '-hello');
    const result3 = await validator['validate'](null);
    expect(result3).toStrictEqual(ValidateResult.accept('null-hello'));
  });

  test('支持异步transform函数', async () => {
    const validator = new MockValidator()['transform'](async (data) => {
      await sleep(100);
      return data + '-hello';
    });
    const result = await validator['validate']('test');
    expect(result).toStrictEqual(ValidateResult.accept('test-hello'));
  });
});

describe('optional()', async () => {
  const validator = new MockValidator();
  const empty = ['', null, undefined];

  test('空数据合集', async () => {
    for (const value of empty) {
      await expect(validator['validate'](value, '')).resolves.toStrictEqual({
        errors: ['：必填'],
      });
    }
  });

  test('允许为空', async () => {
    for (const value of empty) {
      await expect(validator['optional']()['validate'](value, '')).resolves.toStrictEqual(
        ValidateResult.accept(undefined),
      );
    }
  });
});

describe('default', () => {
  test('设置默认值后可以不传参数', async () => {
    const validator = new MockValidator()['default']('test1');
    await expect(validator['validate'](undefined)).resolves.toStrictEqual(
      ValidateResult.accept('test1'),
    );
  });

  test('默认值可以是函数', async () => {
    const validator = new MockValidator()['default'](() => 'test1');
    await expect(validator['validate'](undefined)).resolves.toStrictEqual(
      ValidateResult.accept('test1'),
    );
  });
});

test('开启nullable()时允许传递null', async () => {
  const validator = new MockValidator()['nullable']();
  await expect(validator['validate'](null, '')).resolves.toStrictEqual(
    ValidateResult.accept(null),
  );
});

describe('补充文档', () => {
  const validator = new MockValidator()['docs']({
    title: 'test1',
    description: 'desc1',
  });

  test('merge模式', () => {
    expect(Validator.toDocument(validator['docs']({ title: 'test2' })))
      .toMatchInlineSnapshot(`
      {
        "description": "desc1",
        "required": true,
        "schema": {
          "description": "desc1",
          "title": "test2",
        },
      }
    `);
  });

  test('replace模式', () => {
    expect(Validator.toDocument(validator['docs']({ title: 'test3' }, 'replace')))
      .toMatchInlineSnapshot(`
      {
        "required": true,
        "schema": {
          "title": "test3",
        },
      }
    `);
  });

  test('完整文档', () => {
    expect(
      Validator.toDocument(
        validator['docs']({
          title: 'test',
          description: 'desc',
          deprecated: true,
          example: 'abcde',
          externalDocs: { url: 'http://example.com' },
        }),
      ),
    ).toMatchInlineSnapshot(`
      {
        "deprecated": true,
        "description": "desc",
        "example": "abcde",
        "required": true,
        "schema": {
          "deprecated": true,
          "description": "desc",
          "example": "abcde",
          "externalDocs": {
            "url": "http://example.com",
          },
          "title": "test",
        },
      }
    `);
  });
});

test('获取文档', () => {
  const validator = new MockValidator();
  expect(Validator.toDocument(validator)).toMatchInlineSnapshot(`
    {
      "required": true,
      "schema": {},
    }
  `);
  expect(Validator.toDocument(validator['optional']())).toMatchInlineSnapshot(`
    {
      "schema": {},
    }
  `);
  expect(Validator.toDocument(validator['default']('abc')['nullable']()))
    .toMatchInlineSnapshot(`
    {
      "schema": {
        "default": "abc",
        "nullable": true,
      },
    }
  `);
});

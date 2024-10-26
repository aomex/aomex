import { expect, test } from 'vitest';
import { UlidValidator, ValidateResult } from '../../../src';

test('合法的ulid', async () => {
  const validator = new UlidValidator();
  for (const data of [
    '71234567898764535345434321',
    '7ZZZZZZZZZZZZZZZZZZZZZZZZZ',
    '71EKDKWP8809829882208294M3',
  ]) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(data),
    );
  }
});

test('不合法的ulid', async () => {
  const validator = new UlidValidator();
  for (const data of [
    'abc',
    '0000000000000000000000000#',
    '81234567898764535345434321',
    '7123456723sw5353re4c54x34321',
  ]) {
    await expect(validator['validate'](data)).resolves.toStrictEqual({
      errors: ['：必须是ULID格式'],
    });
  }
});

test('获取文档', () => {
  expect(new UlidValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "example": "01BJQE4QTHMFP0S5J153XCFSP9",
      "format": "ulid",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
});

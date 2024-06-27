import { expect, test } from 'vitest';
import { EmailValidator, magistrate } from '../../../src';

test('必须是邮箱格式', async () => {
  const validator = new EmailValidator();
  await expect(validator['validate']('test@example.com')).resolves.toStrictEqual(
    magistrate.ok('test@example.com'),
  );
});

test('一些不合法的邮箱格式', async () => {
  const validator = new EmailValidator();
  for (const data of ['@gmail.com', 'notemail', 'a@gmail', 'b@', 'cc@g_mail.com']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual({
      errors: ['：必须是电子邮件格式'],
    });
  }
});

test('获取文档', () => {
  expect(new EmailValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "email",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
  expect(new EmailValidator().match(/\.com$/)['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "email",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": "\\.com$",
      "type": "string",
    }
  `);
});

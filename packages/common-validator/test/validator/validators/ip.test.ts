import { expect, test } from 'vitest';
import { IpValidator, ValidateResult } from '../../../src';

test('ipv4格式', async () => {
  const validator = new IpValidator(['v4']);
  await expect(validator['validate']('10.0.0.0')).resolves.toStrictEqual(
    ValidateResult.accept('10.0.0.0'),
  );
  await expect(validator['validate']('::1', '', 'LABEL')).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须是IPv4地址",
      ],
    }
  `);
});

test('ipv6格式', async () => {
  const validator = new IpValidator(['v6']);
  for (const data of ['2001:0db8:3c4d:0015:0000:0000:1a2f:1a2b', '::1', '::']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(data),
    );
  }
  await expect(validator['validate']('0.0.0.0', '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须是IPv6地址",
      ],
    }
  `);
});

test('v4,v6混合', async () => {
  const validator = new IpValidator(['v6']);
  for (const data of ['2001:0db8:3c4d:0015:0000:0000:1a2f:1a2b', '::1', '::']) {
    await expect(validator['validate'](data)).resolves.toStrictEqual(
      ValidateResult.accept(data),
    );
  }
});

test('一些不合法的ip', async () => {
  const validator = new IpValidator(['v4', 'v6']);
  for (const data of ['@gmail.com', 'notemail', 'a@gmail', 'b@', 'cc@g_mail.com']) {
    await expect(validator['validate'](data, '', 'LABEL')).resolves.toStrictEqual({
      errors: ['LABEL必须是IPv4,v6地址'],
    });
  }
});

test('获取文档', () => {
  expect(new IpValidator(['v4'])['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "ipv4",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
  expect(new IpValidator(['v4', 'v6'])['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "ip",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": undefined,
      "type": "string",
    }
  `);
  expect(new IpValidator(['v6']).match(/\.com$/)['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "ipv6",
      "maxLength": undefined,
      "minLength": undefined,
      "pattern": "\\.com$",
      "type": "string",
    }
  `);
});

import { expect, test } from 'vitest';
import { IpValidator, rule } from '../../../core/src';
import { testOK, testFail, testOpenapi } from '../helper';
import {
  invalidIP,
  invalidIPTypes,
  invalidIPv4,
  invalidIPv6,
  validIPv4,
  validIPv6,
} from '../mocks/ip';

test('In rule props', () => {
  expect(rule.ip('v4')).toBeInstanceOf(IpValidator);
});

test('IPv4', async () => {
  await testOK(rule.ip('v4'), validIPv4);
  await testFail(rule.ip('v4'), invalidIPv4, 'must be IPv4 address');
});

test('IPv6', async () => {
  await testOK(rule.ip('v6'), validIPv6);
  await testFail(rule.ip('v6'), invalidIPv6, 'must be IPv6 address');
});

test('IP v4+v6', async () => {
  const validator = rule.ip(['v4', 'v6']);
  await testOK(validator, validIPv4);
  await testOK(validator, validIPv6);
  await testFail(validator, invalidIP, 'must be IP[v4,v6] address');
});

test('Invalid ip types', async () => {
  await testFail(rule.ip('v4'), invalidIPTypes, 'must be string');
  await testFail(rule.ip('v6'), invalidIPTypes, 'must be string');
});

test('match pattern', async () => {
  const ip = '1.1.1.1';
  await testFail(rule.ip('v4').match(/\.1.2$/), [ip], 'not match regexp');
  await testOK(rule.ip('v4').match(/\.1.1$/), [ip]);
});

testOpenapi({
  required: rule.ip('v4'),
  optional: rule.ip('v6').optional(),
  withDefault: rule.ip(['v4']).optional().default('1.2.3.4'),
  withDocs: rule.ip(['v4', 'v6']),
});

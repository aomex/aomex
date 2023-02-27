import { expect, test } from 'vitest';
import { EmailValidator, LengthRange, rule } from '../../../core/src';
import { testOK, testFail, testOpenapi } from '../helper';
import { invalidEmails, invalidEmailTypes, validEmails } from '../mocks/email';

test('In rule props', () => {
  expect(rule.email()).toBeInstanceOf(EmailValidator);
});

test('valid emails', async () => {
  await testOK(rule.email(), validEmails);
});

test('invalid emails', async () => {
  await testFail(rule.email(), invalidEmails, 'must be email');
});

test('Invalid email types', async () => {
  await testFail(rule.email(), invalidEmailTypes, 'must be string');
});

test('In length limition', async () => {
  const email = 'hello@gmail.com';
  const lengthRanges: LengthRange[] = [
    {
      min: 5,
      max: 40,
    },
    {
      min: 10,
      max: 200,
    },
  ];

  for (const range of lengthRanges) {
    await testOK(rule.email().length(range), [email]);
  }
});

test('Out of length limition', async () => {
  const email = 'hello@gmail.com';
  const lengthRanges: LengthRange[] = [
    {
      min: 40,
    },
    {
      max: 5,
    },
  ];

  for (const range of lengthRanges) {
    await testFail(
      rule.email().length(range),
      [email],
      'too short or too long',
    );
  }
});

test('match pattern', async () => {
  const email = 'hello@gmail.com';
  await testFail(rule.email().match(/\.org$/), [email], 'not match regexp');
  await testOK(rule.email().match(/\.com$/), [email]);
});

testOpenapi({
  required: rule.email(),
  optional: rule.email().optional(),
  withDefault: rule.email().optional().default('hello@gmail.com'),
  withDocs: rule.email(),
});

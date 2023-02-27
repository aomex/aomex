import { test, expect } from 'vitest';
import { BufferValidator, rule } from '../../../core/src';
import { testFail, testOK, testOpenapi } from '../helper';
import { invalidBuffers } from '../mocks/buffer';

test('In rule props', async () => {
  expect(rule.buffer()).toBeInstanceOf(BufferValidator);
});

test('Valid buffers', async () => {
  await testOK(rule.buffer(), [Buffer.from([])]);
});

test('Invalid buffers', async () => {
  await testFail(rule.buffer(), invalidBuffers, 'must be buffer');
});

testOpenapi({
  required: rule.buffer(),
  optional: rule.buffer().optional(),
  withDefault: rule.buffer().optional().default(Buffer.from([])),
  withDocs: rule.buffer(),
});

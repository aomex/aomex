import { expect, test } from 'vitest';
import { asyncapi } from '../src';

test('默认指令名为 asyncapi', () => {
  const md = asyncapi({ channels: [], docs: { asyncapi: '3.1.0' } });
  expect(md).toBeTruthy();
});

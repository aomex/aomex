import { expect, test } from 'vitest';
import { traceBlock, type AsyncTraceRecord } from '../src';
import sleep from 'sleep-promise';

test('追踪代码段', async () => {
  let snapshot!: AsyncTraceRecord;
  const result = await traceBlock(
    'label-foo',
    async () => {
      return 'foo';
    },
    (record) => {
      snapshot = record;
    },
  );
  expect(result).toBe('foo');
  expect(snapshot).toMatchObject({
    label: 'label-foo',
  });
});

test('追踪记录回调执行后才返回数据', async () => {
  let str = '';
  await traceBlock(
    'label',
    async () => {
      str += 'a';
    },
    async () => {
      await sleep(500);
      str += 'b';
    },
  );
  str += 'c';
  expect(str).toBe('abc');
});

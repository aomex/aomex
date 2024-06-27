import { expect, test } from 'vitest';
import { asyncTrace } from '../src';

test('追踪回调', async () => {
  let traceId!: string;
  const result = await asyncTrace.run('label-foo', async (id) => {
    traceId = id;
    return 'foo';
  });
  expect(result).toBe('foo');
  expect(asyncTrace.getRecord(traceId)).toMatchObject({
    id: traceId,
    label: 'label-foo',
  });
});

test('父子链路', async () => {
  let traceId1!: string;
  let traceId2!: string;
  await asyncTrace.run('label-foo', async (id) => {
    traceId1 = id;
    await asyncTrace.run('label-bar', async (id) => {
      traceId2 = id;
    });
    expect(asyncTrace.getRecord(traceId2)).toMatchObject({ label: 'label-bar' });
  });
  expect(asyncTrace.getRecord(traceId2)).toBeUndefined();
  expect(asyncTrace.getRecord(traceId1)).toMatchObject({
    label: 'label-foo',
    children: [{ label: 'label-bar' }],
  });
});

test('没有父链路时，获取记录时立刻删除', async () => {
  let traceId!: string;
  await asyncTrace.run('label-foo', async (id) => {
    traceId = id;
  });
  expect(asyncTrace.getRecord(traceId)).not.toBeUndefined();
  expect(asyncTrace.getRecord(traceId)).toBeUndefined();
});

test('有父链路时，可多次获取', async () => {
  let traceId!: string;
  await asyncTrace.run('label-foo', async () => {
    await asyncTrace.run('label-bar', async (id) => {
      traceId = id;
    });
    expect(asyncTrace.getRecord(traceId)).toMatchObject({ label: 'label-bar' });
    expect(asyncTrace.getRecord(traceId)).toMatchObject({ label: 'label-bar' });
    expect(asyncTrace.getRecord(traceId)).toMatchObject({ label: 'label-bar' });
  });
});

test('逻辑异常时也能记录', async () => {
  let traceId!: string;
  await expect(
    asyncTrace.run('label-foo', async (id) => {
      traceId = id;
      throw new Error('x');
    }),
  ).rejects.toThrowError('x');
  expect(asyncTrace.getRecord(traceId)).toMatchObject({
    id: traceId,
    label: 'label-foo',
  });
});

import { expect, test } from 'vitest';
import { asyncTrace } from '../src';
import sleep from 'sleep-promise';

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
    error: null,
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
    error: null,
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

test('逻辑异常时也记录报错信息', async () => {
  let traceId!: string;
  await expect(
    asyncTrace.run('label-foo', async (id) => {
      traceId = id;
      throw new Error('xx-yy-zz');
    }),
  ).rejects.toThrowError('xx-yy-zz');
  const record = asyncTrace.getRecord(traceId);
  expect(record).toMatchObject({
    id: traceId,
    label: 'label-foo',
  });
  expect(record.error).toMatchInlineSnapshot(`[Error: xx-yy-zz]`);
});

test('转换成调用栈', async () => {
  let traceId!: string;
  await asyncTrace.run('foo', async (id) => {
    traceId = id;
    await sleep(100);
    await asyncTrace.run('bar', async () => {
      await sleep(300);
      await asyncTrace.run('bar-child', async () => {
        await sleep(200);
      });
    });
    await asyncTrace.run('baz', async () => {
      await sleep(200);
    });
  });
  const topRecords = [asyncTrace.getRecord(traceId)];
  expect(asyncTrace.toStack(topRecords).replaceAll(/\d+/g, '_')).toMatchInlineSnapshot(`
    "foo: _ms
        bar: _ms
            bar-child: _ms
        baz: _ms
    "
  `);

  expect(asyncTrace.toStack(topRecords, 2).replaceAll(/\d+/g, '_'))
    .toMatchInlineSnapshot(`
    "foo: _ms
      bar: _ms
        bar-child: _ms
      baz: _ms
    "
  `);
});

import { expect, test, vitest } from 'vitest';
import { CustomTransport } from '../../src/transports/custom-transport';

test('自定义输出函数', async () => {
  const spy = vitest.fn();
  const t = new CustomTransport({ consume: spy });

  await t.consume({
    content: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
  expect(spy).toBeCalledTimes(1);
  expect(spy).toBeCalledWith({
    content: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'foo',
  });
});

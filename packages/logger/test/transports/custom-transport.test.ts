import { expect, test, vitest } from 'vitest';
import { CustomTransport } from '../../src/transports/custom-transport';

test('自定义输出函数', async () => {
  const spy = vitest.fn();
  const t = new CustomTransport({ consume: spy });

  await t.consume({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
  expect(spy).toHaveBeenCalledTimes(1);
  expect(spy).toHaveBeenCalledWith({
    message: 'hello world',
    timestamp: new Date(1730296983321),
    level: 'info',
  });
});

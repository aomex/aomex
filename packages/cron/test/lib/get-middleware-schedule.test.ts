import { getMiddlewareSchedule } from '../../src/lib/get-middleware-schedule';

test('get schedules', async () => {
  await expect(
    getMiddlewareSchedule('./test/mocks'),
  ).resolves.toMatchSnapshot();
});

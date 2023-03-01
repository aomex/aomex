import { schedule, ScheduleMiddleware } from '../../src';
import { Schedule } from '../../src/lib/schedule';

test('can generate Schedule', () => {
  expect(schedule('*').getSchedule('x')).toBeInstanceOf(Schedule);
});

test('input string literal', () => {
  const middleware = schedule('* *   * * *');
  expect(middleware).toBeInstanceOf(ScheduleMiddleware);
  expect(middleware.getSchedule('x').time).toBe('* * * * *');
});

test('input object with time', () => {
  const middleware = schedule({
    time: '* *   * *   *',
  });
  expect(middleware).toBeInstanceOf(ScheduleMiddleware);
  expect(middleware.getSchedule('x').time).toBe('* * * * *');
});

test('input object with detail', () => {
  const middleware = schedule({
    dayOfWeek: 5,
    dayOfMonth: 12,
  });
  expect(middleware).toBeInstanceOf(ScheduleMiddleware);
  expect(middleware.getSchedule('x').time).toBe('* * 12 * 5');
});

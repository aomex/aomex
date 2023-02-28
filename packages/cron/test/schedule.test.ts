import { test } from 'vitest';
import { schedule, ScheduleOptions } from '../src';

describe('time', () => {
  const expectSnap = (options: ScheduleOptions | string) => {
    expect(schedule(options).toCrontab('my:schedule')).toMatchSnapshot();
  };

  test('*', () => {
    expectSnap({});
  });

  test('minute', () => {
    expectSnap({ minute: '2,4-19,*/6' });
    expectSnap({ minute: '1-10/2' });
    expectSnap({ minute: '1-60' });
  });

  test('hour', () => {
    expectSnap({ hour: '*/2' });
    expectSnap({ hour: '1-10/2' });
    expectSnap({ hour: '1-20' });
  });

  test('day of month', () => {
    expectSnap({ dayOfMonth: '*/2' });
    expectSnap({ dayOfMonth: '1-10/2' });
    expectSnap({ dayOfMonth: '0-22' });
  });

  test('month', () => {
    expectSnap({ month: '*/2' });
    expectSnap({ month: '1-10/2' });
    expectSnap({ month: '0-11' });
  });

  test('day of week', () => {
    expectSnap({ dayOfWeek: '*/2' });
    expectSnap({ dayOfWeek: '0-6/2' });
    expectSnap({ dayOfWeek: '1' });
  });

  test('second', () => {
    expectSnap({ second: '*/2' });
    expectSnap({ second: '1-12/2' });
    expectSnap({ second: '1-7' });
  });

  test('cron-like time', () => {
    expectSnap('*/2 * * 1,4 * *');
    expectSnap({
      time: '* * * * *',
    });
    expectSnap({
      time: '*   */2 *    1,4,9 *',
      args: ['--a', 'b'],
    });
  });

  test('cron-like time with invalid length', () => {
    expect(() => schedule('* * * * * * *').toCrontab('x')).toThrowError();
    expect(() => schedule('* * * *').toCrontab('x')).toThrowError();
    expect(() => schedule('* * *').toCrontab('x')).toThrowError();

    expect(() => schedule('* * * * *').toCrontab('x')).not.toThrowError();
  });
});

describe('command', () => {
  const expectSnap = (command: string, args?: string[]) => {
    expect(schedule({ args }).toCrontab(command)).toMatchSnapshot();
  };

  test('name', () => {
    expectSnap('hello:test');
    expectSnap('custom:schedule');
  });

  test('arguments', () => {
    expectSnap('hello:test', ['--data', 'testme', '--mark', '--verbose']);
  });

  test('double quote for argument with spaces', () => {
    expectSnap('hello:test', ['--data', 'test me', '--mark', '--verbose']);
  });
});

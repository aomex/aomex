import { expect, test, vitest } from 'vitest';
import { Logger } from '../src';
import { describe } from 'node:test';
import { MockTransport } from './mocks/mock-transport';

test('自定义接口', () => {
  const logger = Logger.create({ levels: ['foo', 'bar'] });
  expect(typeof logger.foo).toBe('function');
  expect(typeof logger.bar).toBe('function');
  // @ts-expect-error
  expect(logger.fooo).toBeUndefined();
});

test('按顺序记录日志', () => {
  const logger = Logger.create({ levels: ['foo', 'bar'] });
  logger.foo('aa');
  logger.bar('bb');
  logger.foo('hello %s', 'world');
  expect(logger['logs'].map((m) => m.text)).toStrictEqual(['aa', 'bb', 'hello world']);
});

test('统计消费实例数量', () => {
  {
    const logger = Logger.create({ levels: ['foo', 'bar'] });
    expect(logger.countTransports('foo')).toBe(0);
  }

  {
    const logger = Logger.create({
      levels: ['foo', 'bar'],
      transports: [
        {
          transport: new Logger.transports.Console(),
          level: ['foo'],
        },
      ],
    });
    expect(logger.countTransports('foo')).toBe(1);
    expect(logger.countTransports('bar')).toBe(0);
  }

  {
    const logger = Logger.create({
      levels: ['foo', 'bar'],
      transports: [
        {
          transport: new Logger.transports.Console(),
          level: 'all',
        },
      ],
    });
    expect(logger.countTransports('foo')).toBe(1);
    expect(logger.countTransports('bar')).toBe(1);
  }
});

describe('输出日志等级', () => {
  const logger = Logger.create({ levels: ['foo', 'bar', 'baz'] });

  test('所有等级', async () => {
    expect(logger['transformLevel']('all')).toStrictEqual(['foo', 'bar', 'baz']);
  });

  test('禁止输出', async () => {
    expect(logger['transformLevel']('none')).toStrictEqual([]);
  });

  test('指定输出', async () => {
    expect(logger['transformLevel'](['foo', 'baz'])).toStrictEqual(['foo', 'baz']);
    expect(logger['transformLevel'](['baz', 'baz', 'foo'])).toStrictEqual(['baz', 'foo']);
    expect(logger['transformLevel']([])).toStrictEqual([]);
  });

  test('区间输出', async () => {
    expect(logger['transformLevel']({ from: 'bar', to: 'baz' })).toStrictEqual([
      'bar',
      'baz',
    ]);
    expect(logger['transformLevel']({ from: 'baz', to: 'bar' })).toStrictEqual([]);
    expect(logger['transformLevel']({ from: 'foo' })).toStrictEqual([
      'foo',
      'bar',
      'baz',
    ]);
    expect(logger['transformLevel']({ from: 'baz' })).toStrictEqual(['baz']);
    expect(logger['transformLevel']({ to: 'foo' })).toStrictEqual(['foo']);
  });
});

test('添加消费者', () => {
  const logger = Logger.create({
    levels: ['foo', 'bar', 'baz'],
    transports: [
      { transport: new MockTransport(), level: 'all' },
      { transport: new MockTransport(), level: 'none' },
    ],
  });
  expect(logger['transportAndLevels']).toHaveLength(2);
  logger.transports.add({ transport: new MockTransport(), level: 'all' });
  expect(logger['transportAndLevels']).toHaveLength(3);
  logger.transports.add({ transport: new MockTransport(), level: 'all' });
  expect(logger['transportAndLevels']).toHaveLength(4);
});

test('删除消费者', () => {
  {
    const logger = Logger.create({
      levels: ['foo', 'bar', 'baz'],
      transports: [
        { transport: new MockTransport(), level: 'all' },
        { transport: new MockTransport(), level: 'none' },
      ],
    });
    logger.transports.remove(() => false);
    expect(logger['transportAndLevels']).toHaveLength(2);
    logger.transports.remove(() => true);
    expect(logger['transportAndLevels']).toHaveLength(0);
  }

  {
    const logger = Logger.create({
      levels: ['foo', 'bar', 'baz'],
      transports: [
        { transport: new MockTransport(), level: 'all' },
        { transport: new MockTransport(), level: 'none' },
      ],
    });
    logger.transports.remove((_t, level) => level.length === 0);
    expect(logger['transportAndLevels']).toHaveLength(1);
  }
});

test('异步消费', async () => {
  const t = new MockTransport();
  const logger = Logger.create({
    levels: ['foo', 'bar', 'baz'],
    transports: [{ transport: t, level: 'all' }],
  });
  // @ts-expect-error
  const spy = vitest.spyOn(logger, 'consume');
  logger.foo('hello foo!');

  expect(spy).toBeCalledTimes(0);
  expect(logger['logs']).toHaveLength(1);
  expect(t.messages).toHaveLength(0);

  await logger.complete();
  expect(spy).toBeCalledTimes(1);
  expect(logger['logs']).toHaveLength(0);
  expect(t.messages).toHaveLength(1);
});

test('消费者同时消费', async () => {
  const t1 = new MockTransport();
  const t2 = new MockTransport();
  const t3 = new MockTransport();
  const logger = Logger.create({
    levels: ['foo', 'bar', 'baz'],
    transports: [
      { transport: t1, level: ['foo', 'bar'] },
      { transport: t2, level: ['bar', 'baz'] },
      { transport: t3, level: 'none' },
    ],
  });

  logger['logs'].push(
    { text: 'hello foo!', level: 'foo', timestamp: new Date(1730355001000) },
    { text: 'hello bar!', level: 'bar', timestamp: new Date(1730355002000) },
    { text: 'hello baz!', level: 'baz', timestamp: new Date(1730355003000) },
  );

  await logger['consume']();
  expect(logger['logs']).toHaveLength(0);

  expect(t1.messages).toMatchInlineSnapshot(`
    [
      {
        "level": "foo",
        "text": "hello foo!",
        "timestamp": 2024-10-31T06:10:01.000Z,
      },
      {
        "level": "bar",
        "text": "hello bar!",
        "timestamp": 2024-10-31T06:10:02.000Z,
      },
    ]
  `);
  expect(t2.messages).toMatchInlineSnapshot(`
    [
      {
        "level": "bar",
        "text": "hello bar!",
        "timestamp": 2024-10-31T06:10:02.000Z,
      },
      {
        "level": "baz",
        "text": "hello baz!",
        "timestamp": 2024-10-31T06:10:03.000Z,
      },
    ]
  `);
  expect(t3.messages).toMatchInlineSnapshot(`[]`);
});

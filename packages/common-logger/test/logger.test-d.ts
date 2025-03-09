import { Logger } from '../src';

// levels生成方法
{
  const logger = Logger.create({
    levels: ['foo', 'bar', 'baz'],
  });

  logger.foo('abc');
  logger.bar('abcd %s', 'efg');
  logger.baz('abc');
  // @ts-expect-error
  logger.fooo('abc');
}

// 接收日志
{
  const logger = Logger.create({
    levels: ['foo', 'bar', 'baz'],
    transports: [
      {
        transport: new Logger.transports.Console(),
        level: 'all',
      },
      {
        transport: new Logger.transports.Console(),
        level: 'none',
      },
      {
        transport: new Logger.transports.Console(),
        // @ts-expect-error
        level: 'foo',
      },
      {
        transport: new Logger.transports.Console(),
        level: ['foo', 'bar'],
      },
      {
        transport: new Logger.transports.Console(),
        level: [
          // @ts-expect-error
          'fooo',
          'bar',
        ],
      },
      {
        transport: new Logger.transports.Console(),
        level: { from: 'foo', to: 'bar' },
      },
      {
        transport: new Logger.transports.Console(),
        // @ts-expect-error
        level: { from: 'fooo', to: 'barb' },
      },
      {
        transport: new Logger.transports.Console(),
        level: {
          // @ts-expect-error
          from: 'fooo',
          to: 'bar',
        },
      },
      {
        transport: new Logger.transports.Console(),
        level: {
          from: 'foo',
          // @ts-expect-error
          to: 'barz',
        },
      },
    ],
  });

  logger.transports.add({
    transport: new Logger.transports.Console(),
    level: {
      from: 'foo',
      // @ts-expect-error
      to: 'barz',
    },
  });

  logger.transports.add({
    // @ts-expect-error
    transport: {},
    level: 'all',
  });
}

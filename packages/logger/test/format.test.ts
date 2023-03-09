import { chalk } from '@aomex/utility';
import { FormatToken } from '../src';
import { format } from '../src/format';

describe('builtin tokens', () => {
  test('request', () => {
    expect(
      format({
        message: ` xx ${FormatToken.request} []`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([` xx ${chalk.gray('%s')} []`, '<--']);
  });

  test('response + 200', () => {
    expect(
      format({
        message: `${FormatToken.response}  abc`,
        statusCode: 200,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([`${chalk.gray('%s')}  abc`, '-->']);
  });

  test('response + 403', () => {
    expect(
      format({
        message: `${FormatToken.response}  abc`,
        statusCode: 403,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([`${chalk.red('%s')}  abc`, 'xxx']);
  });

  test('response + 响应未完成', () => {
    expect(
      format({
        message: `${FormatToken.response}  abc`,
        statusCode: 200,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        finished: false,
      }),
    ).toStrictEqual([`${chalk.yellow('%s')}  abc`, '-x-']);
  });

  test('method', () => {
    expect(
      format({
        message: ` xx ${FormatToken.method} []`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([` xx ${chalk.bold('%s')} []`, 'GET']);
    expect(
      format({
        message: ` xx ${FormatToken.method} []`,
        method: 'PUT',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([` xx ${chalk.bold('%s')} []`, 'PUT']);
  });

  test('url', () => {
    expect(
      format({
        message: `test ${FormatToken.url}  abc`,
        method: 'GET',
        url: '/my/custom/u',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([`test ${chalk.gray('%s')}  abc`, '/my/custom/u']);
  });

  test('statusCode + green', () => {
    [101, 200, 204].forEach((statusCode) => {
      expect(
        format({
          message: `${FormatToken.statusCode}  abc`,
          statusCode,
          method: 'GET',
          url: '/',
          startTime: process.hrtime(),
        }),
      ).toStrictEqual([`${chalk.green('%s')}  abc`, statusCode.toString()]);
    });
  });

  test('statusCode + cyan', () => {
    [300, 301, 302].forEach((statusCode) => {
      expect(
        format({
          message: `${FormatToken.statusCode}  abc`,
          statusCode,
          method: 'GET',
          url: '/',
          startTime: process.hrtime(),
        }),
      ).toStrictEqual([`${chalk.cyan('%s')}  abc`, statusCode.toString()]);
    });
  });

  test('statusCode + yellow', () => {
    [400, 401, 403, 404].forEach((statusCode) => {
      expect(
        format({
          message: `${FormatToken.statusCode}  abc`,
          statusCode,
          method: 'GET',
          url: '/',
          startTime: process.hrtime(),
        }),
      ).toStrictEqual([`${chalk.yellow('%s')}  abc`, statusCode.toString()]);
    });
  });

  test('statusCode + red', () => {
    [500, 503].forEach((statusCode) => {
      expect(
        format({
          message: `${FormatToken.statusCode}  abc`,
          statusCode,
          method: 'GET',
          url: '/',
          startTime: process.hrtime(),
        }),
      ).toStrictEqual([`${chalk.red('%s')}  abc`, statusCode.toString()]);
    });
  });

  test('contentLength + 0', () => {
    expect(
      format({
        message: `${FormatToken.contentLength}  abc`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        contentLength: 0,
      }),
    ).toStrictEqual([`${chalk.gray('%s')}  abc`, '0']);
  });

  test('contentLength + undefined', () => {
    expect(
      format({
        message: `${FormatToken.contentLength}  abc`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([`${chalk.gray('%s')}  abc`, '-']);
  });

  test('contentLength + empty status', () => {
    expect(
      format({
        message: `${FormatToken.contentLength}  abc`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        statusCode: 204,
        contentLength: 1520,
      }),
    ).toStrictEqual([`${chalk.gray('%s')}  abc`, '0']);
  });

  test('contentLength', () => {
    expect(
      format({
        message: `${FormatToken.contentLength}  abc`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        contentLength: 1520,
      }),
    ).toStrictEqual([`${chalk.gray('%s')}  abc`, '1.48kb']);
  });

  test('contentType', () => {
    expect(
      format({
        message: `${FormatToken.contentType}  abc`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        contentType: 'json',
      }),
    ).toStrictEqual([`${chalk.gray('%s')}  abc`, 'json']);
  });

  test('time', () => {
    const result = format({
      message: '[time]  abc',
      method: 'GET',
      url: '/',
      startTime: process.hrtime(),
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(`${chalk.gray('%s')}  abc`);
    expect(result[1]).toMatch(/^\d+[^\d]+$/);
  });

  test('token compose', () => {
    expect(
      format({
        message: ` ${FormatToken.response} ${FormatToken.statusCode} ${FormatToken.contentLength}  abc`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        statusCode: 404,
      }),
    ).toStrictEqual([
      ` ${chalk.red('%s')} ${chalk.yellow('%s')} ${chalk.gray('%s')}  abc`,
      'xxx',
      '404',
      '-',
    ]);
  });
});

describe('custom tokens', () => {
  test('unknown token', () => {
    expect(
      format({
        message: ` xx ${FormatToken.url} [custom]`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
      }),
    ).toStrictEqual([` xx ${chalk.gray('%s')} [custom]`, '/']);
  });

  test('token handle', () => {
    expect(
      format({
        message: ` xx ${FormatToken.url} [custom]`,
        method: 'GET',
        url: '/',
        startTime: process.hrtime(),
        tokens: {
          custom: () => chalk.green('hello-world'),
        },
      }),
    ).toStrictEqual([
      ` xx ${chalk.gray('%s')} %s`,
      '/',
      chalk.green('hello-world'),
    ]);
  });
});

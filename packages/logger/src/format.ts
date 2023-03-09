import prettyTime from 'pretty-time';
import { bytes, chalk } from '@aomex/utility';
import { statuses } from '@aomex/web';
import { FormatToken } from './format-token';

export const colorCodes = <const>{
  7: 'magenta',
  5: 'red',
  4: 'yellow',
  3: 'cyan',
  2: 'green',
  1: 'green',
  0: 'yellow',
};

export const format = (opts: {
  message: string;
  startTime: [number, number];
  method: string;
  url: string;
  tokens?: { [key: string]: () => string };
  contentType?: string;
  contentLength?: number;
  statusCode?: number;
  finished?: boolean;
}): [message: string, ...args: any[]] => {
  const {
    message,
    startTime,
    method,
    url,
    contentLength,
    statusCode = 404,
    contentType = '-',
    tokens = {},
    finished,
  } = opts;

  const args: string[] = [];
  const formatted = message.replaceAll(/\[[^\]]+\]/g, (token) => {
    token = token.slice(1, -1);

    if (tokens[token]) {
      args.push(tokens[token]!());
      return '%s';
    }

    switch (`[${token}]`) {
      case FormatToken.request:
        args.push('<--');
        return chalk.gray('%s');
      case FormatToken.response:
        if (statusCode >= 400) {
          args.push('xxx');
          return chalk.red('%s');
        }
        if (finished === false) {
          args.push('-x-');
          return chalk.yellow('%s');
        }

        args.push('-->');
        return chalk.gray('%s');
      case FormatToken.method:
        args.push(method);
        return chalk.bold('%s');
      case FormatToken.url:
        args.push(url);
        return chalk.gray('%s');
      case FormatToken.statusCode:
        const c =
          colorCodes[((statusCode / 100) | 0) as keyof typeof colorCodes] ||
          colorCodes[0]!;
        args.push(statusCode.toString());
        return chalk[c]('%s');
      case FormatToken.contentLength:
        args.push(
          statuses.empty[statusCode] || contentLength === 0
            ? '0'
            : contentLength == null
            ? '-'
            : bytes(contentLength).toLowerCase(),
        );
        return chalk.gray('%s');
      case FormatToken.contentType:
        args.push(contentType);
        return chalk.gray('%s');
      case FormatToken.time:
        args.push(prettyTime(process.hrtime(startTime)));
        return chalk.gray('%s');
      default:
        return `[${token}]`;
    }
  });

  return [formatted, ...args];
};

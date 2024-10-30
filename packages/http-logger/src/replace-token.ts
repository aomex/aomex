import prettyTime from 'pretty-time';
import { bytes } from '@aomex/internal-tools';
import { statuses } from '@aomex/web';
import { HttpLoggerToken } from './http-logger-token';
import { styleText } from 'node:util';

export const colorCodes = <const>{
  7: 'magenta',
  5: 'red',
  4: 'yellow',
  3: 'cyan',
  2: 'green',
  1: 'green',
  0: 'yellow',
};

const pattern = /\[[^\[\]]+\]/g;

export const replaceToken = async (opts: {
  message: string;
  startTime: [number, number];
  tokens?: { [key: string]: () => string | Promise<string> };
  request: {
    method: string;
    url: string;
    ip: string;
  };
  response?: {
    statusCode?: number;
    contentType?: string;
    contentLength?: number;
  };
}): Promise<string> => {
  const { message, startTime, request, response = {}, tokens = {} } = opts;
  const { method, url } = request;
  const { contentLength, contentType = '-', statusCode = 404 } = response;
  let formatted = message;

  for (let match of message.matchAll(pattern)) {
    const tokenWithBrackets = match[0];
    const token = tokenWithBrackets.slice(1, -1);

    const replace = (data: string) => {
      formatted = formatted.replaceAll(tokenWithBrackets, data);
    };

    if (tokens[token]) {
      replace(await tokens[token]!());
    }

    switch (`[${token}]`) {
      case HttpLoggerToken.method:
        replace(styleText('bold', method));
        break;
      case HttpLoggerToken.url:
        replace(styleText('gray', url));
        break;
      case HttpLoggerToken.statusCode:
        const c =
          colorCodes[((statusCode / 100) | 0) as keyof typeof colorCodes] ||
          colorCodes[0]!;
        replace(styleText(c, statusCode.toString()));
        break;
      case HttpLoggerToken.contentLength:
        replace(
          styleText(
            'gray',
            statuses.empty[statusCode] || contentLength === 0
              ? '0'
              : contentLength == null
                ? '-'
                : bytes(contentLength).toLowerCase(),
          ),
        );
        break;
      case HttpLoggerToken.contentType:
        replace(styleText('gray', contentType));
        break;
      case HttpLoggerToken.duration:
        replace(styleText('gray', prettyTime(process.hrtime(startTime))));
        break;
      case HttpLoggerToken.ip:
        replace(styleText('gray', request.ip));
        break;
    }
  }

  return formatted;
};

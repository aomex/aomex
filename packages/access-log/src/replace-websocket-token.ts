import prettyTime from 'pretty-time';
import { styleText } from 'node:util';
import { WebsocketAccessLogToken } from './websocket-token';

const pattern = /\[[^\[\]]+\]/g;

export const replaceWebsocketToken = async (opts: {
  message: string;
  startTime: [number, number];
  tokens?: { [key: string]: () => string | Promise<string> };
  ip: string;
  clientId: string;
  event: string;
}): Promise<string> => {
  const { message, startTime, tokens = {}, ip, clientId, event } = opts;
  let formatted = message;

  for (const match of message.matchAll(pattern)) {
    const tokenWithBrackets = match[0]!;
    const token = tokenWithBrackets.slice(1, -1);

    const replace = (data: string) => {
      formatted = formatted.replaceAll(tokenWithBrackets, data);
    };

    if (tokens[token]) {
      replace(await tokens[token]!());
    }

    switch (`[${token}]`) {
      case WebsocketAccessLogToken.ip:
        replace(styleText('gray', ip || '-'));
        break;
      case WebsocketAccessLogToken.clientId:
        replace(styleText('gray', clientId));
        break;
      case WebsocketAccessLogToken.event:
        replace(styleText('bold', event));
        break;
      case WebsocketAccessLogToken.duration:
        replace(styleText('gray', prettyTime(process.hrtime(startTime))));
        break;
    }
  }

  return formatted;
};

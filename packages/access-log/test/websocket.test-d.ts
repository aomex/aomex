import { expectType } from 'ts-expect';
import type { SocketMiddleware } from '@aomex/websocket';
import {
  websocketAccessLog,
  WebsocketAccessLogToken,
  type WebsocketAccessLogOptions,
} from '../src/websocket';

expectType<SocketMiddleware>(websocketAccessLog());
expectType<string>(WebsocketAccessLogToken.event);

const options = {
  format: `${WebsocketAccessLogToken.event} [room]`,
  customTokens: {
    room: (ctx) => {
      expectType<string>(ctx.event);
      expectType<string>(ctx.client.id);
      return 'lobby';
    },
  },
} satisfies WebsocketAccessLogOptions;
void websocketAccessLog(options);

websocketAccessLog({
  // @ts-expect-error customTokens 值须为函数
  customTokens: { room: 1 },
});

websocketAccessLog({
  // @ts-expect-error disabled 须为 boolean
  disabled: 1,
});

import { expectType } from 'ts-expect';
import type { SocketMiddleware } from '@aomex/websocket';
import { websocketRateLimit, type WebsocketRateLimitOptions } from '../src/websocket';

expectType<SocketMiddleware>(websocketRateLimit());

const options = {
  maxRequest: 30,
  duration: '10s',
  errorMessage: '稍后再试',
  id: (ctx) => {
    expectType<string>(ctx.client.id);
    expectType<string>(ctx.event);
    expectType<string | undefined>(ctx.client.request?.ip);
    return ctx.client.request?.ip || false;
  },
  allowList: async (ctx) => ctx.event === 'ping',
  denyList: (ctx) => ctx.client.id === 'ops',
} satisfies WebsocketRateLimitOptions;
void websocketRateLimit(options);

websocketRateLimit({
  // @ts-expect-error 身份只能是 string 或 false
  id: () => 1,
});

websocketRateLimit({ duration: '1 hour' });
websocketRateLimit({ duration: 10_000 });

websocketRateLimit({
  // @ts-expect-error 无单位的数字字符串不是 DurationInput
  duration: '1',
});

websocketRateLimit({
  // @ts-expect-error maxRequest 须为 number
  maxRequest: '1',
});

import { expectType } from 'ts-expect';
import type { CacheAdapter } from '@aomex/cache';
import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { HttpError, type WebMiddleware } from '@aomex/web';
import type { SocketMiddleware } from '@aomex/websocket';
import { createAbuse } from '../src';
import type { AbuseApi, AbuseService, AbuseBlockStrategy } from '../src';

const adapter: CacheAdapter = new CacheMemoryAdapter();
createAbuse({ store: adapter, strategies: [] });
// @ts-expect-error store 必须是 CacheAdapter
createAbuse({ store: {}, strategies: [] });
// @ts-expect-error store 必填
createAbuse({ strategies: [] });
createAbuse({
  store: adapter,
  strategies: [],
  // @ts-expect-error createAbuse 不再接受 blockedError
  blockedError: new HttpError(429, 'blocked'),
});
createAbuse({
  store: adapter,
  strategies: [],
  // @ts-expect-error createAbuse 不再接受 bypass
  bypass: () => true,
});

const md = createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      window: '30m',
      blockFor: '1 month',
    },
    {
      strategy: 'http-error',
      statusCodes: [404, 403],
      limit: 40,
      window: '30 minutes',
      blockFor: '1 day',
    },
    {
      strategy: 'user-abuse',
      reason: 'order-probe',
      limit: 5,
      window: '1 hour',
      banFor: '1 day',
    },
    {
      strategy: 'user-abuse',
      reason: 'idor',
      limit: 3,
      window: 3_600_000,
    },
    {
      strategy: 'ip-abuse',
      reason: 'logout-miss',
      limit: 20,
      window: '1h',
      blockFor: '1 hour',
    },
  ],
  onBlockIP: (ip, reason, detail) => {
    expectType<string>(ip);
    expectType<AbuseBlockStrategy>(reason);
    expectType<number>(detail.count);
    expectType<number>(detail.limit);
    expectType<number>(detail.blockFor);
  },
  onBanUser: (id, reason, detail) => {
    expectType<string | number>(id);
    expectType<'order-probe' | 'idor'>(reason);
    expectType<number>(detail.count);
    expectType<number>(detail.limit);
    expectType<number | undefined>(detail.banFor);
  },
});

expectType<AbuseService<'order-probe' | 'idor', 'logout-miss'>>(md);
expectType<WebMiddleware>(md.web());
expectType<WebMiddleware>(
  md.web({
    bypass: (ctx) => {
      expectType<string>(ctx.request.pathname);
      return false;
    },
    blockedError: new HttpError(429, 'blocked'),
  }),
);
// @ts-expect-error blockedError 须为 HttpError
md.web({ blockedError: 'blocked' });
// @ts-expect-error blockedError 须为 HttpError
md.web({ blockedError: 403 });
expectType<SocketMiddleware>(md.socket());
expectType<SocketMiddleware>(
  md.socket({
    bypass: (ctx) => {
      expectType<string>(ctx.event);
      expectType<string>(ctx.client.id);
      return false;
    },
    errorMessage: 'nope',
  }),
);

// 只通过返回值调用，不挂 ctx
md.userAbuse(1, 'order-probe');
md.userAbuse('u1', 'idor');
md.ipAbuse('127.0.0.1', 'logout-miss');
md.blockIP('127.0.0.1', '1 day');
md.blockIP('127.0.0.1', 3600_000);
md.unblockIP('127.0.0.1');
md.isIPBlocked('127.0.0.1');
// @ts-expect-error duration 必填
md.blockIP('127.0.0.1');
// @ts-expect-error 未配置的 reason
md.userAbuse(1, 'nope');
// @ts-expect-error 未配置的 ip-abuse reason
md.ipAbuse('127.0.0.1', 'nope');
// @ts-expect-error 不允许 boolean id
md.userAbuse(true, 'order-probe');
// @ts-expect-error 非法时长
md.blockIP('127.0.0.1', 'soon');
// @ts-expect-error 返回值不再是 WebMiddleware
const _notMiddleware: WebMiddleware = md;

declare const api: AbuseApi<'order-probe' | 'idor', 'logout-miss'>;
api.userAbuse(1, 'order-probe');
api.userAbuse('u1', 'idor');
api.ipAbuse('127.0.0.1', 'logout-miss');
api.blockIP('127.0.0.1', '1 hour');
// @ts-expect-error 未配置的 reason
api.userAbuse(1, 'nope');
// @ts-expect-error 未配置的 ip-abuse reason
api.ipAbuse('127.0.0.1', 'nope');
// @ts-expect-error 不允许 boolean id
api.userAbuse(true, 'order-probe');

const noAbuse = createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      window: 60_000,
      blockFor: 1000,
    },
  ],
  onBlockIP: (_ip, reason, detail) => {
    expectType<AbuseBlockStrategy>(reason);
    expectType<number>(detail.blockFor);
  },
});
expectType<AbuseService<never, never>>(noAbuse);

createAbuse({
  store: adapter,
  strategies: [],
  onBlockIP: (_ip, reason, detail) => {
    expectType<AbuseBlockStrategy>(reason);
    expectType<number>(detail.blockFor);
  },
});

expectType<'honeypot' | 'http-error' | 'socket-events' | 'ip-abuse' | 'manual'>(
  null as unknown as AbuseBlockStrategy,
);

createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'socket-events',
      events: ['admin.destroy', /^debug\./],
      limit: 1,
      window: '1h',
      blockFor: '1d',
    },
  ],
  onBlockIP: (_ip, reason) => {
    expectType<AbuseBlockStrategy>(reason);
  },
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error socket-events 须配置 events
    {
      strategy: 'socket-events',
      limit: 1,
      window: 1,
      blockFor: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error honeypot 缺少 limit
    { strategy: 'honeypot', paths: ['/.env'], window: 1, blockFor: 1 },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error honeypot 须配置 paths
    {
      strategy: 'honeypot',
      methods: ['TRACE'],
      limit: 1,
      window: 1,
      blockFor: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error honeypot 缺少 window
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      blockFor: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error http-error 缺少 window
    {
      strategy: 'http-error',
      statusCodes: [404],
      limit: 1,
      blockFor: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      // @ts-expect-error window 须为 DurationInput
      window: 'soon',
      blockFor: '1 day',
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error user-abuse 缺少 reason
    { strategy: 'user-abuse', limit: 1, window: 1 },
  ],
  onBanUser: () => {},
});

// @ts-expect-error 配置了 user-abuse 必须提供 onBanUser
createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'user-abuse',
      reason: 'order-probe',
      limit: 5,
      window: '1 hour',
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      window: 60_000,
      blockFor: 1000,
    },
  ],
  // 无 user-abuse 时 onBanUser 可选，显式传入也应合法
  onBanUser: () => {},
});

const numericReason = createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'user-abuse',
      reason: 1001,
      limit: 2,
      window: 60_000,
    },
    {
      strategy: 'user-abuse',
      reason: 'mix',
      limit: 2,
      window: 60_000,
    },
  ],
  onBanUser: (id, reason) => {
    expectType<string | number>(id);
    expectType<1001 | 'mix'>(reason);
  },
});
numericReason.userAbuse(1, 1001);
numericReason.userAbuse(1, 'mix');
// @ts-expect-error 未配置的 number reason
numericReason.userAbuse(1, 1002);
// @ts-expect-error 未配置的 string reason
numericReason.userAbuse(1, 'other');

enum AbuseCode {
  OrderProbe = 1,
  Idor = 2,
  Other = 3,
}
enum AbuseName {
  OrderProbe = 'order-probe',
  Idor = 'idor',
}

const enumReason = createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'user-abuse',
      reason: AbuseCode.OrderProbe,
      limit: 2,
      window: 60_000,
    },
    {
      strategy: 'user-abuse',
      reason: AbuseCode.Idor,
      limit: 2,
      window: 60_000,
    },
    {
      strategy: 'user-abuse',
      reason: AbuseName.OrderProbe,
      limit: 2,
      window: 60_000,
    },
  ],
  onBanUser: (_id, reason) => {
    expectType<AbuseCode.OrderProbe | AbuseCode.Idor | AbuseName.OrderProbe>(reason);
  },
});
enumReason.userAbuse(1, AbuseCode.OrderProbe);
enumReason.userAbuse(1, AbuseCode.Idor);
enumReason.userAbuse(1, AbuseName.OrderProbe);
// @ts-expect-error 未配置的数字枚举成员
enumReason.userAbuse(1, AbuseCode.Other);
// @ts-expect-error 未配置的字符串枚举成员
enumReason.userAbuse(1, AbuseName.Idor);
// @ts-expect-error 裸 string 不能代替字符串枚举成员
enumReason.userAbuse(1, 'order-probe');

createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      window: 60_000,
      // @ts-expect-error 非法时长单位
      blockFor: '1 fortnight',
    },
  ],
});

const onlyIpAbuse = createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'ip-abuse',
      reason: 'logout-miss',
      limit: 2,
      window: '1h',
      blockFor: '1h',
    },
  ],
  // 无 user-abuse 时 onBanUser 可省略
});
expectType<AbuseService<never, 'logout-miss'>>(onlyIpAbuse);
onlyIpAbuse.ipAbuse('127.0.0.1', 'logout-miss');
// @ts-expect-error 未配置的 ip-abuse reason
onlyIpAbuse.ipAbuse('127.0.0.1', 'nope');
// @ts-expect-error 无 user-abuse 时无 userAbuse reason
onlyIpAbuse.userAbuse(1, 'order-probe');

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error ip-abuse 缺少 blockFor
    {
      strategy: 'ip-abuse',
      reason: 'logout-miss',
      limit: 1,
      window: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error ip-abuse 缺少 limit
    {
      strategy: 'ip-abuse',
      reason: 'logout-miss',
      window: 1,
      blockFor: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    // @ts-expect-error ip-abuse 缺少 window
    {
      strategy: 'ip-abuse',
      reason: 'logout-miss',
      limit: 1,
      blockFor: 1,
    },
  ],
});

createAbuse({
  store: adapter,
  strategies: [
    {
      strategy: 'honeypot',
      paths: ['/.env'],
      limit: 1,
      window: 60_000,
      blockFor: 60_000,
    },
  ],
}).web({ bypass: async () => true });

import { CacheMemoryAdapter } from '@aomex/cache/memory';
import { internalDestroyServices, middleware } from '@aomex/common';
import { HttpError } from '@aomex/web';
import { afterEach, expect, test, vitest } from 'vitest';
import supertest from 'supertest';
import { TestWebApp } from '../../web/src/testing';
import { createAbuse } from '../src';

afterEach(async () => {
  await internalDestroyServices([]);
});

test('honeypot 命中蜜罐路径后封禁 IP', async () => {
  const onBlockIP = vitest.fn();
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'honeypot',
            paths: ['/.env'],
            limit: 1,
            window: '1 hour',
            blockFor: '1 day',
          },
        ],
        onBlockIP,
      }).web(),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await supertest(app.listen()).get('/.env').expect(403);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'honeypot', {
    count: 1,
    limit: 1,
    blockFor: expect.any(Number),
  });
  await supertest(app.listen()).get('/').expect(403);
});

test('blockedError 可定制', async () => {
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'honeypot',
            paths: ['/.env'],
            limit: 1,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
      }).web({
        blockedError: new HttpError(429, 'too many probes', {
          code: 'BLOCKED',
        }),
      }),
    ],
  });

  const res = await supertest(app.listen()).get('/.env').expect(429);
  expect(res.text).toContain('too many probes');
});

test('bypass 跳过探测与封禁检查', async () => {
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'honeypot',
            paths: ['/.env'],
            limit: 1,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
      }).web({ bypass: () => true }),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await supertest(app.listen()).get('/.env').expect(200);
  await supertest(app.listen()).get('/.env').expect(200);
});

test('http-error 对 ctx.throw 累计满额后封禁', async () => {
  const onBlockIP = vitest.fn();
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'http-error',
            statusCodes: [404],
            limit: 3,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
        onBlockIP,
      }).web(),
      middleware.web((ctx) => {
        ctx.throw(404);
      }),
    ],
  });

  const agent = supertest(app.listen());
  await agent.get('/missing-1').expect(404);
  await agent.get('/missing-2').expect(404);
  await agent.get('/missing-3').expect(404);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'http-error', {
    count: 3,
    limit: 3,
    blockFor: expect.any(Number),
  });
  // 撞线当次仍是原错误；下一请求才因封禁变为 403
  await agent.get('/missing-4').expect(403);
});

test('http-error 对 ctx.send(4xx) 累计满额后封禁', async () => {
  const onBlockIP = vitest.fn();
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'http-error',
            statusCodes: [404],
            limit: 2,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
        onBlockIP,
      }).web(),
      middleware.web((ctx) => {
        ctx.send(404, 'missing');
      }),
    ],
  });

  const agent = supertest(app.listen());
  await agent.get('/a').expect(404);
  expect(onBlockIP).not.toHaveBeenCalled();
  await agent.get('/b').expect(404);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'http-error', {
    count: 2,
    limit: 2,
    blockFor: expect.any(Number),
  });
  await agent.get('/c').expect(403);
});

test('user-abuse 满额触发 onBanUser 且不自动封 IP', async () => {
  const onBanUser = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 'order-probe',
        limit: 2,
        window: 60_000,
        banFor: '1 day',
      },
    ],
    onBanUser,
  });
  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await abuse.userAbuse(42, 'order-probe');
  expect(onBanUser).not.toHaveBeenCalled();
  await abuse.userAbuse(42, 'order-probe');
  expect(onBanUser).toHaveBeenCalledWith(42, 'order-probe', {
    count: 2,
    limit: 2,
    banFor: 86_400_000,
  });
  // user-abuse 满额不自动封 IP，后续请求仍可访问
  await supertest(app.listen()).get('/still-ok').expect(200);
});

test('onBanUser 失败后释放 hook，同窗口可重试', async () => {
  const onBanUser = vitest
    .fn()
    .mockRejectedValueOnce(new Error('db down'))
    .mockResolvedValueOnce(undefined);
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 'order-probe',
        limit: 1,
        window: 60_000,
      },
    ],
    onBanUser,
  });

  await expect(abuse.userAbuse(1, 'order-probe')).rejects.toThrow('db down');
  expect(onBanUser).toHaveBeenCalledTimes(1);

  await abuse.userAbuse(1, 'order-probe');
  expect(onBanUser).toHaveBeenCalledTimes(2);
});

test('计数 key 无 TTL 时后续 bump 会补设窗口', async () => {
  const onBanUser = vitest.fn();
  const store = new CacheMemoryAdapter();
  const abuse = createAbuse({
    store,
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 'order-probe',
        limit: 3,
        window: 60_000,
      },
    ],
    onBanUser,
  });

  // 模拟：increment 到 1 后进程崩溃，未调用 expire
  const orphanKey = 'abuse:count:user-abuse:order-probe:9';
  await store.connect();
  await store.increaseValue(orphanKey);
  expect(await store.ttlKey(orphanKey)).toBe(-1);

  await abuse.userAbuse(9, 'order-probe');
  expect(await store.ttlKey(orphanKey)).toBeGreaterThan(0);
  expect(onBanUser).not.toHaveBeenCalled();

  await abuse.userAbuse(9, 'order-probe');
  expect(onBanUser).toHaveBeenCalledWith(9, 'order-probe', {
    count: 3,
    limit: 3,
    banFor: undefined,
  });
});

test('user-abuse 支持 number reason', async () => {
  const onBanUser = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 1001,
        limit: 2,
        window: 60_000,
      },
    ],
    onBanUser,
  });

  await abuse.userAbuse(7, 1001);
  expect(onBanUser).not.toHaveBeenCalled();
  await abuse.userAbuse(7, 1001);
  expect(onBanUser).toHaveBeenCalledWith(7, 1001, {
    count: 2,
    limit: 2,
    banFor: undefined,
  });
});

test('返回值可在 service 中直接 userAbuse，无需 ctx', async () => {
  const onBanUser = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 'idor',
        limit: 2,
        window: 60_000,
      },
    ],
    onBanUser,
  });

  await abuse.userAbuse(7, 'idor');
  expect(onBanUser).not.toHaveBeenCalled();
  await abuse.userAbuse(7, 'idor');
  expect(onBanUser).toHaveBeenCalledWith(7, 'idor', {
    count: 2,
    limit: 2,
    banFor: undefined,
  });
});

test('honeypot / http-error 未满额不封，满额才 onBlockIP', async () => {
  const onBlockIP = vitest.fn();
  const onBanUser = vitest.fn();

  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'honeypot',
        paths: ['/.env'],
        limit: 2,
        window: 60_000,
        blockFor: 60_000,
      },
      {
        strategy: 'http-error',
        statusCodes: [404],
        limit: 2,
        window: 60_000,
        blockFor: 60_000,
      },
      {
        strategy: 'user-abuse',
        reason: 'order-probe',
        limit: 2,
        window: 60_000,
      },
    ],
    onBlockIP,
    onBanUser,
  });

  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        if (ctx.request.pathname === '/.env') {
          ctx.send(200);
          return;
        }
        ctx.throw(404);
      }),
    ],
  });
  const agent = supertest(app.listen());

  await agent.get('/.env').expect(200);
  expect(onBlockIP).not.toHaveBeenCalled();

  await agent.get('/.env').expect(403);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'honeypot', {
    count: 2,
    limit: 2,
    blockFor: expect.any(Number),
  });

  const blockedIp = onBlockIP.mock.calls[0]![0] as string;
  await abuse.unblockIP(blockedIp);
  onBlockIP.mockClear();

  // 窗口内仍满额、解封后再次命中：重新封禁并触发钩子
  await agent.get('/.env').expect(403);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'honeypot', {
    count: 3,
    limit: 2,
    blockFor: expect.any(Number),
  });

  await abuse.unblockIP(onBlockIP.mock.calls[0]![0] as string);
  onBlockIP.mockClear();

  await agent.get('/missing').expect(404);
  expect(onBlockIP).not.toHaveBeenCalled();
  await agent.get('/missing').expect(404);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'http-error', {
    count: 2,
    limit: 2,
    blockFor: expect.any(Number),
  });

  // 已封禁时继续累计 http-error 不再触发钩子
  onBlockIP.mockClear();
  await agent.get('/').expect(403);
  expect(onBlockIP).not.toHaveBeenCalled();

  await abuse.unblockIP(blockedIp);
  onBlockIP.mockClear();
  // 解封后 count 已 ≥ limit，下一次匹配即再封
  await agent.get('/missing').expect(404);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'http-error', {
    count: 3,
    limit: 2,
    blockFor: expect.any(Number),
  });

  await abuse.userAbuse(9, 'order-probe');
  expect(onBanUser).not.toHaveBeenCalled();
  await abuse.userAbuse(9, 'order-probe');
  expect(onBanUser).toHaveBeenCalledWith(9, 'order-probe', {
    count: 2,
    limit: 2,
    banFor: undefined,
  });
  onBanUser.mockClear();
  await abuse.userAbuse(9, 'order-probe');
  expect(onBanUser).not.toHaveBeenCalled();
});

test('ip-abuse 满额封禁 IP（logout miss 等场景）', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'ip-abuse',
        reason: 'logout-miss',
        limit: 2,
        window: 60_000,
        blockFor: '1 hour',
      },
    ],
    onBlockIP,
  });
  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        ctx.send(204);
      }),
    ],
  });

  const agent = supertest(app.listen());
  const ip = '::ffff:127.0.0.1';

  await abuse.ipAbuse(ip, 'logout-miss');
  expect(onBlockIP).not.toHaveBeenCalled();
  await agent.get('/logout').expect(204);

  await abuse.ipAbuse(ip, 'logout-miss');
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(onBlockIP).toHaveBeenCalledWith(ip, 'ip-abuse', {
    count: 2,
    limit: 2,
    blockFor: expect.any(Number),
  });
  expect(await abuse.isIPBlocked(ip)).toBe(true);
  await agent.get('/logout').expect(403);

  onBlockIP.mockClear();
  await abuse.ipAbuse(ip, 'logout-miss');
  await abuse.ipAbuse(ip, 'logout-miss');
  expect(onBlockIP).not.toHaveBeenCalled();
  expect(await abuse.isIPBlocked(ip)).toBe(true);

  await abuse.unblockIP(ip);
  onBlockIP.mockClear();
  await abuse.ipAbuse(ip, 'logout-miss');
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(await abuse.isIPBlocked(ip)).toBe(true);
});

test('未知 ip-abuse reason 抛错', async () => {
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'ip-abuse',
        reason: 'logout-miss',
        limit: 3,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
  });

  await expect(abuse.ipAbuse('1.1.1.1', 'nope' as 'logout-miss')).rejects.toThrow(
    /IP 滥用原因/,
  );
});

test('手动 blockIP / isIPBlocked / unblockIP', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
    onBlockIP,
  });
  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  const agent = supertest(app.listen());
  const ip = '::ffff:127.0.0.1';
  await abuse.blockIP(ip, '1 hour');
  expect(await abuse.isIPBlocked(ip)).toBe(true);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(onBlockIP).toHaveBeenCalledWith(ip, 'manual', {
    count: 1,
    limit: 1,
    blockFor: expect.any(Number),
  });
  await agent.get('/').expect(403);

  onBlockIP.mockClear();
  await abuse.blockIP(ip, '2 hours');
  expect(onBlockIP).not.toHaveBeenCalled();
  expect(await abuse.isIPBlocked(ip)).toBe(true);

  await abuse.unblockIP(ip);
  expect(await abuse.isIPBlocked(ip)).toBe(false);
  await agent.get('/').expect(200);
});

test('并发 blockIP / userAbuse 钩子只触发一次', async () => {
  const onBlockIP = vitest.fn();
  const onBanUser = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 'order-probe',
        limit: 1,
        window: 60_000,
      },
    ],
    onBlockIP,
    onBanUser,
  });

  const ip = '::ffff:127.0.0.1';
  await Promise.all([
    abuse.blockIP(ip, 60_000),
    abuse.blockIP(ip, 60_000),
    abuse.blockIP(ip, 60_000),
  ]);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(await abuse.isIPBlocked(ip)).toBe(true);

  await Promise.all([
    abuse.userAbuse(1, 'order-probe'),
    abuse.userAbuse(1, 'order-probe'),
    abuse.userAbuse(1, 'order-probe'),
  ]);
  expect(onBanUser).toHaveBeenCalledTimes(1);
});

test('honeypot 空 paths / http-error 空 statusCodes 创建即抛错', () => {
  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'honeypot',
          paths: [],
          limit: 1,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/paths 不能为空/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'http-error',
          statusCodes: [],
          limit: 1,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/statusCodes 不能为空/);
});

test('bypass 不检查封禁，API 仍可 block/unblock', async () => {
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  const app = new TestWebApp({
    mount: [
      abuse.web({
        bypass: (ctx) => ctx.request.pathname.startsWith('/ops'),
      }),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  const agent = supertest(app.listen());
  const ip = '::ffff:127.0.0.1';
  await abuse.blockIP(ip, 60_000);
  await agent.get('/').expect(403);
  await agent.get('/ops/ping').expect(200);
  await abuse.unblockIP(ip);
  await agent.get('/').expect(200);
});

test('http-error 可按 methods 过滤', async () => {
  const onBlockIP = vitest.fn();
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'http-error',
            statusCodes: [404],
            methods: ['POST'],
            limit: 1,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
        onBlockIP,
      }).web(),
      middleware.web((ctx) => {
        ctx.throw(404);
      }),
    ],
  });

  const agent = supertest(app.listen());
  await agent.get('/missing').expect(404);
  expect(onBlockIP).not.toHaveBeenCalled();
  await agent.post('/missing').expect(404);
  expect(onBlockIP).toHaveBeenCalled();
});

test('honeypot 配置 methods+paths 时需同时满足', async () => {
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'honeypot',
            paths: ['/.env'],
            methods: ['POST'],
            limit: 1,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
      }).web(),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await supertest(app.listen()).get('/.env').expect(200);
  await supertest(app.listen()).post('/other').expect(200);
  await supertest(app.listen()).post('/.env').expect(403);
});

test('http-error 可按 paths 过滤', async () => {
  const onBlockIP = vitest.fn();
  const app = new TestWebApp({
    mount: [
      createAbuse({
        store: new CacheMemoryAdapter(),
        strategies: [
          {
            strategy: 'http-error',
            statusCodes: [404],
            paths: ['/secret'],
            limit: 1,
            window: 60_000,
            blockFor: 60_000,
          },
        ],
        onBlockIP,
      }).web(),
      middleware.web((ctx) => {
        ctx.throw(404);
      }),
    ],
  });

  const agent = supertest(app.listen());
  await agent.get('/other').expect(404);
  expect(onBlockIP).not.toHaveBeenCalled();
  await agent.get('/secret').expect(404);
  expect(onBlockIP).toHaveBeenCalledWith(expect.any(String), 'http-error', {
    count: 1,
    limit: 1,
    blockFor: expect.any(Number),
  });
  await agent.get('/').expect(403);
});

test('http-error 未匹配的 throw 状态码不计入', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'http-error',
        statusCodes: [404],
        limit: 1,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });
  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        ctx.throw(400);
      }),
    ],
  });

  await supertest(app.listen()).get('/bad').expect(400);
  expect(onBlockIP).not.toHaveBeenCalled();
  await expect(abuse.isIPBlocked('::ffff:127.0.0.1')).resolves.toBe(false);
});

test('配置了 user-abuse 但未提供 onBanUser 时创建即抛错', () => {
  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'user-abuse',
          reason: 'order-probe',
          limit: 3,
          window: 60_000,
        },
      ],
      // 运行时绕过类型约束
      onBanUser: undefined as unknown as () => void,
    }),
  ).toThrow(/必须提供 onBanUser/);
});

test('limit / window / blockFor / banFor <= 0 创建即抛错', () => {
  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'honeypot',
          paths: ['/.env'],
          limit: 0,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/limit 必须为正整数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'http-error',
          statusCodes: [404],
          limit: -1,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/limit 必须为正整数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'honeypot',
          paths: ['/.env'],
          limit: 0.5,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/limit 必须为正整数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'ip-abuse',
          reason: 'logout-miss',
          limit: 3,
          window: 0,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/window 必须为正数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'user-abuse',
          reason: 'order-probe',
          limit: 3,
          window: '0ms',
        },
      ],
      onBanUser: () => {},
    }),
  ).toThrow(/window 必须为正数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'honeypot',
          paths: ['/.env'],
          limit: 1,
          window: 0,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/window 必须为正数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'honeypot',
          paths: ['/.env'],
          limit: 1,
          window: 60_000,
          blockFor: 0,
        },
      ],
    }),
  ).toThrow(/blockFor 必须为正数/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'user-abuse',
          reason: 'order-probe',
          limit: 3,
          window: 60_000,
          banFor: '0ms',
        },
      ],
      onBanUser: () => {},
    }),
  ).toThrow(/banFor 必须为正数/);
});

test('blockIP 时长 <= 0 抛错', async () => {
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [],
  });
  await expect(abuse.blockIP('1.1.1.1', 0)).rejects.toThrow(/blockFor 必须为正数/);
});

test('重复的 user-abuse / ip-abuse reason 创建即抛错', () => {
  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'user-abuse',
          reason: 'order-probe',
          limit: 3,
          window: 60_000,
        },
        {
          strategy: 'user-abuse',
          reason: 'order-probe',
          limit: 5,
          window: 60_000,
        },
      ],
      onBanUser: () => {},
    }),
  ).toThrow(/重复的用户滥用原因/);

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'ip-abuse',
          reason: 'logout-miss',
          limit: 3,
          window: 60_000,
          blockFor: 60_000,
        },
        {
          strategy: 'ip-abuse',
          reason: 'logout-miss',
          limit: 5,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/重复的 IP 滥用原因/);
});

test('user-abuse 与 ip-abuse 可共用同一 reason 字符串', () => {
  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'user-abuse',
          reason: 'shared',
          limit: 3,
          window: 60_000,
        },
        {
          strategy: 'ip-abuse',
          reason: 'shared',
          limit: 3,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
      onBanUser: () => {},
    }),
  ).not.toThrow();
});

test('user-abuse 数字与同形字符串 reason 视为重复', () => {
  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'user-abuse',
          reason: 1001,
          limit: 3,
          window: 60_000,
        },
        {
          strategy: 'user-abuse',
          reason: '1001',
          limit: 5,
          window: 60_000,
        },
      ],
      onBanUser: () => {},
    }),
  ).toThrow(/重复的用户滥用原因/);
});

test('未知 user-abuse reason 抛错', async () => {
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'user-abuse',
        reason: 'order-probe',
        limit: 3,
        window: 60_000,
      },
    ],
    onBanUser: () => {},
  });

  await expect(abuse.userAbuse(1, 'idor' as 'order-probe')).rejects.toThrow(
    /未知的用户滥用原因/,
  );
});

test('onBlockIP 抛错时封禁仍生效，蜜罐当次不走 throwBlocked', async () => {
  const onBlockIP = vitest.fn().mockRejectedValue(new Error('notify fail'));
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'honeypot',
        paths: ['/.env'],
        limit: 1,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });
  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });
  const agent = supertest(app.listen());

  await agent.get('/.env').expect(500);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(await abuse.isIPBlocked('::ffff:127.0.0.1')).toBe(true);
  await agent.get('/').expect(403);
});

test('request.ip 为空时跳过封禁与探测', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'honeypot',
        paths: ['/.env'],
        limit: 1,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx, next) => {
        Object.defineProperty(ctx.request, 'ip', {
          configurable: true,
          get: () => '',
        });
        await next();
      }),
      abuse.web(),
      middleware.web((ctx) => {
        ctx.send(200);
      }),
    ],
  });

  await abuse.blockIP('', 60_000);
  expect(onBlockIP).toHaveBeenCalledTimes(1);

  const agent = supertest(app.listen());
  await agent.get('/.env').expect(200);
  await agent.get('/').expect(200);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
});

test('ipAbuse 使用的 IP 须与 ctx.request.ip 一致才会拦截请求', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'ip-abuse',
        reason: 'logout-miss',
        limit: 1,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });
  const app = new TestWebApp({
    mount: [
      abuse.web(),
      middleware.web((ctx) => {
        ctx.send(204);
      }),
    ],
  });
  const agent = supertest(app.listen());

  await abuse.ipAbuse('1.2.3.4', 'logout-miss');
  expect(onBlockIP).toHaveBeenCalledWith('1.2.3.4', 'ip-abuse', expect.any(Object));
  expect(await abuse.isIPBlocked('1.2.3.4')).toBe(true);
  await agent.get('/logout').expect(204);

  await abuse.ipAbuse('::ffff:127.0.0.1', 'logout-miss');
  await agent.get('/logout').expect(403);
});

test('ip-abuse 支持 number reason；数字与同形字符串视为重复', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'ip-abuse',
        reason: 1001,
        limit: 2,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });

  const ip = '::ffff:127.0.0.1';
  await abuse.ipAbuse(ip, 1001);
  expect(onBlockIP).not.toHaveBeenCalled();
  await abuse.ipAbuse(ip, 1001);
  expect(onBlockIP).toHaveBeenCalledWith(ip, 'ip-abuse', {
    count: 2,
    limit: 2,
    blockFor: expect.any(Number),
  });

  expect(() =>
    createAbuse({
      store: new CacheMemoryAdapter(),
      strategies: [
        {
          strategy: 'ip-abuse',
          reason: 1001,
          limit: 3,
          window: 60_000,
          blockFor: 60_000,
        },
        {
          strategy: 'ip-abuse',
          reason: '1001',
          limit: 5,
          window: 60_000,
          blockFor: 60_000,
        },
      ],
    }),
  ).toThrow(/重复的 IP 滥用原因/);
});

test('并发 ipAbuse 满额时 onBlockIP 只触发一次', async () => {
  const onBlockIP = vitest.fn();
  const abuse = createAbuse({
    store: new CacheMemoryAdapter(),
    strategies: [
      {
        strategy: 'ip-abuse',
        reason: 'logout-miss',
        limit: 1,
        window: 60_000,
        blockFor: 60_000,
      },
    ],
    onBlockIP,
  });

  const ip = '::ffff:127.0.0.1';
  await Promise.all([
    abuse.ipAbuse(ip, 'logout-miss'),
    abuse.ipAbuse(ip, 'logout-miss'),
    abuse.ipAbuse(ip, 'logout-miss'),
  ]);
  expect(onBlockIP).toHaveBeenCalledTimes(1);
  expect(await abuse.isIPBlocked(ip)).toBe(true);
});

test('abuse 首次使用时才登记适配器生命周期', async () => {
  const order: string[] = [];
  class TrackingAdapter extends CacheMemoryAdapter {
    #connected = false;
    override async connect() {
      if (this.#connected) return;
      this.#connected = true;
      order.push('init');
    }
    override async disconnect() {
      order.push('destroy');
    }
  }

  const abuse = createAbuse({ store: new TrackingAdapter(), strategies: [] });
  expect(order).toEqual([]);
  expect(await abuse.isIPBlocked('203.0.113.1')).toBe(false);
  expect(order).toEqual(['init']);
  expect(await abuse.isIPBlocked('203.0.113.1')).toBe(false);
  expect(order).toEqual(['init']);
  await internalDestroyServices([]);
  expect(order).toEqual(['init', 'destroy']);
});

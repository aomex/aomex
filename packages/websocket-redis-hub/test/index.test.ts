import RedisMemoryServer from 'redis-memory-server';
import { afterAll, afterEach, beforeAll, expect, test } from 'vitest';
import { internalDestroyServices } from '@aomex/common';
import { getRedisBinary } from './helper/get-redis-binary';
import { RedisHub, type RedisOptions } from '../src';
import { i18n } from '../src/i18n';

type AppLogger = Parameters<RedisHub['bindLogger']>[0];
const silentLogger = { error() {}, warn() {} } as unknown as AppLogger;

let redisServer: RedisMemoryServer;
let opts: RedisOptions;
const adapters: RedisHub[] = [];

beforeAll(async () => {
  redisServer = await RedisMemoryServer.create({
    binary: getRedisBinary(),
  });
  await redisServer.ensureInstance();
  opts = {
    host: await redisServer.getHost(),
    port: await redisServer.getPort(),
  };
}, 60_000);

afterEach(async () => {
  while (adapters.length) {
    const adapter = adapters.pop()!;
    await adapter.onDestroy();
  }
});

afterAll(async () => {
  await redisServer.stop();
});

/** 单测不经 WebsocketHub，需自行 ensureReady */
const createAdapter = async (extra?: { channel?: string }) => {
  const adapter = new RedisHub({ ...opts, ...extra });
  adapter.bindLogger(silentLogger);
  adapters.push(adapter);
  await adapter.ensureReady();
  return adapter;
};

const waitFor = async (predicate: () => boolean, timeout = 3_000, interval = 20) => {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (predicate()) return;
    await new Promise((r) => setTimeout(r, interval));
  }
  throw new Error('waitFor timeout');
};

test('同节点房间广播与 except', async () => {
  const delivered: Array<[string, string, unknown]> = [];
  const hub = await createAdapter({ channel: 't:same-node' });
  hub.bind((clientId, event, data) => {
    delivered.push([clientId, event, data]);
  });

  hub.addClient('a');
  hub.addClient('b');
  hub.addClient('c');
  await hub.join('a', 'lobby');
  await hub.join('b', 'lobby');
  await hub.join('c', 'other');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect(hub['subscribedRooms'].has('other')).toBe(true);

  await hub.broadcast('lobby', 'chat', { text: 'hi' }, { exceptId: 'a' });
  await waitFor(() => delivered.length >= 1);
  expect(delivered).toEqual([['b', 'chat', { text: 'hi' }]]);
});

test('bindMetric：subscribe / publish / fanout 事件', async () => {
  const events: Array<{ type: string; scope?: string; ok?: boolean }> = [];
  const hub = await createAdapter({ channel: 't:metric' });
  hub.bindMetric((e) => {
    events.push(e);
  });
  hub.bind(() => {});

  hub.addClient('a');
  await hub.join('a', 'lobby');
  expect(events.some((e) => e.type === 'subscribe')).toBe(true);

  await hub.broadcast('lobby', 'x', 1);
  await waitFor(
    () =>
      events.some((e) => e.type === 'publish' && e.ok === true && e.scope === 'room') &&
      events.some((e) => e.type === 'fanout' && e.scope === 'room'),
  );

  events.length = 0;
  await hub.broadcastAll('n', 1);
  await waitFor(
    () =>
      events.some((e) => e.type === 'publish' && e.scope === 'all' && e.ok === true) &&
      events.some((e) => e.type === 'fanout' && e.scope === 'all'),
  );

  await hub.leave('a', 'lobby');
  expect(events.some((e) => e.type === 'unsubscribe')).toBe(true);
});

test('publish 失败时 metric ok=false 且向上抛错', async () => {
  const events: Array<{ type: string; ok?: boolean }> = [];
  const hub = await createAdapter({ channel: 't:publish-fail' });
  hub.bindMetric((e) => {
    events.push(e);
  });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');

  hub['redis'].disconnect();
  await expect(hub.broadcast('lobby', 'x', 1)).rejects.toThrow();
  expect(events.some((e) => e.type === 'publish' && e.ok === false)).toBe(true);
});

test('进房后立即退房：订阅完成后若房间已空则退订', async () => {
  const hub = await createAdapter({ channel: 't:join-leave-race' });
  hub.bind(() => {});
  hub.addClient('a');

  const joinP = hub.join('a', 'lobby');
  const leaveP = hub.leave('a', 'lobby');
  await Promise.all([joinP, leaveP]);

  await waitFor(() => !hub['subscribedRooms'].has('lobby'));
  expect(hub.stats()).toMatchObject({ rooms: 0, subscribedRooms: 0 });
});

test('并发进同一空房共用一次 subscribe', async () => {
  const hub = await createAdapter({ channel: 't:concurrent-join' });
  hub.bind(() => {});
  hub.addClient('a');
  hub.addClient('b');

  let subscribeCalls = 0;
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = ((...args: Parameters<typeof orig>) => {
    subscribeCalls += 1;
    return orig(...args);
  }) as typeof orig;

  await Promise.all([hub.join('a', 'lobby'), hub.join('b', 'lobby')]);
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  // 全员频道在 onInit 已订；房间频道应只多订一次（两个 join 共用 pending）
  expect(subscribeCalls).toBe(1);
});

test('unsubscribe 等待进行中的 subscribe；关闭中退订只清本地', async () => {
  const hub = await createAdapter({ channel: 't:unsub-pending' });
  hub.bind(() => {});
  hub.addClient('a');

  let resolveSub!: () => void;
  const gate = new Promise<void>((r) => {
    resolveSub = r;
  });
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    await gate;
    return orig(...args);
  }) as typeof orig;

  const joinP = hub.join('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  expect(hub['roomSyncs'].has('lobby')).toBe(true);

  const leaveP = hub.leave('a', 'lobby');
  resolveSub();
  await Promise.all([joinP, leaveP]);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
});

test('双节点房间广播互相投递', async () => {
  const channel = 't:two-nodes-room';
  const deliveredA: Array<[string, string]> = [];
  const deliveredB: Array<[string, string]> = [];

  const nodeA = await createAdapter({ channel });
  const nodeB = await createAdapter({ channel });
  nodeA.bind((id, event) => {
    deliveredA.push([id, event]);
  });
  nodeB.bind((id, event) => {
    deliveredB.push([id, event]);
  });

  nodeA.addClient('a1');
  await nodeA.join('a1', 'lobby');
  nodeB.addClient('b1');
  await nodeB.join('b1', 'lobby');

  await nodeA.broadcast('lobby', 'chat', { text: 'x' });
  await waitFor(() => deliveredA.length >= 1 && deliveredB.length >= 1);
  expect(deliveredA).toEqual([['a1', 'chat']]);
  expect(deliveredB).toEqual([['b1', 'chat']]);
});

test('广播只打本房频道，未订阅房间收不到', async () => {
  const channel = 't:room-isolation';
  const delivered: string[] = [];
  const hub = await createAdapter({ channel });
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  await hub.join('a', 'lobby');

  // 发到本机未订阅的房间频道：不应投递
  await hub['redis'].publish(
    hub['roomChannel']('ghost'),
    JSON.stringify({ event: 'x', data: 1 }),
  );
  await new Promise((r) => setTimeout(r, 50));
  expect(delivered).toEqual([]);

  await hub.broadcast('lobby', 'ok', null);
  await waitFor(() => delivered.length >= 1);
  expect(delivered).toEqual(['a']);
});

test('stats：在线、房间与已订频道数', async () => {
  const hub = await createAdapter({ channel: 't:stats' });
  expect(hub.stats()).toEqual({ online: 0, rooms: 0, subscribedRooms: 0 });

  hub.addClient('a');
  hub.addClient('b');
  await hub.join('a', 'lobby');
  await hub.join('b', 'other');
  expect(hub.stats()).toEqual({ online: 2, rooms: 2, subscribedRooms: 2 });

  await hub.leave('a', 'lobby');
  expect(hub.stats()).toEqual({ online: 2, rooms: 1, subscribedRooms: 1 });

  await hub.removeClient('b');
  expect(hub.stats()).toEqual({ online: 1, rooms: 0, subscribedRooms: 0 });
});

test('broadcastAll 跨节点且 except 生效', async () => {
  const channel = 't:two-nodes-all';
  const delivered: string[] = [];

  const nodeA = await createAdapter({ channel });
  const nodeB = await createAdapter({ channel });
  nodeA.bind((id) => {
    delivered.push(`A:${id}`);
  });
  nodeB.bind((id) => {
    delivered.push(`B:${id}`);
  });

  nodeA.addClient('a1');
  nodeA.addClient('a2');
  nodeB.addClient('b1');

  await nodeA.broadcastAll('notice', 1, { exceptId: 'a2' });
  await waitFor(() => delivered.length >= 2);
  expect(delivered.sort()).toEqual(['A:a1', 'B:b1']);
});

test('leave 后取消订阅且不再收到房间广播', async () => {
  const channel = 't:leave';
  const delivered: string[] = [];
  const hub = await createAdapter({ channel });
  hub.bind((id) => {
    delivered.push(id);
  });

  hub.addClient('a');
  hub.addClient('b');
  await hub.join('a', 'lobby');
  await hub.join('b', 'lobby');
  await hub.leave('b', 'lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);

  await hub.leave('a', 'lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);

  await hub.broadcast('lobby', 'x', null);
  await new Promise((r) => setTimeout(r, 50));
  expect(delivered).toEqual([]);
});

test('removeClient 清空本机房间并退订；非法总线消息忽略', async () => {
  const channel = 't:remove';
  const hub = await createAdapter({ channel });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  await hub.removeClient('a');
  expect([...(await hub.getClientRooms('a'))]).toEqual([]);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);

  await hub['redis'].publish(hub['allChannel'], 'not-json');
  await hub['redis'].publish(hub['allChannel'], JSON.stringify({ event: 1 }));
  await hub['redis'].publish(hub['roomChannel']('lobby'), JSON.stringify({ event: 1 }));
  await hub.broadcast('missing', 'x', 1);
});

test('离线 join 忽略；重复 addClient 保留房间', async () => {
  const hub = await createAdapter({ channel: 't:offline-join' });
  hub.bind(() => {});
  await hub.join('ghost', 'lobby');
  expect([...(await hub.getClientRooms('ghost'))]).toEqual([]);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);

  hub.addClient('a');
  await hub.join('a', 'lobby');
  hub.addClient('a');
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
});

test('ensureReady：onInit 连上、关停时自动 onDestroy', async () => {
  const hub = new RedisHub({ ...opts, channel: 't:lifecycle' });
  await hub.ensureReady();
  expect(hub['closed']).toBe(false);
  expect(hub['redis'].status).toBe('ready');
  expect(hub['sub'].status).toBe('ready');

  await internalDestroyServices([]);
  expect(hub['closed']).toBe(true);
  expect(hub['subscribedRooms'].size).toBe(0);
  await hub.onDestroy();
  expect(hub['closed']).toBe(true);
});

test('关闭后 broadcast 抛错', async () => {
  const hub = await createAdapter({ channel: 't:closed-broadcast' });
  await hub.onDestroy();
  await expect(hub.broadcast('lobby', 'x', 1)).rejects.toThrow();
  await expect(hub.broadcastAll('y', 2)).rejects.toThrow();
});

test('没有成员也没有订阅时对齐直接返回', async () => {
  const hub = await createAdapter({ channel: 't:unsub-noop' });
  await expect(hub['syncRoom']('never')).resolves.toBeUndefined();
  expect(hub['subscribedRooms'].has('never')).toBe(false);
});

test('已订或已关闭时对齐不再 subscribe', async () => {
  const hub = await createAdapter({ channel: 't:sub-noop' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);

  let calls = 0;
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = ((...args: Parameters<typeof orig>) => {
    calls += 1;
    return orig(...args);
  }) as typeof orig;

  await hub['syncRoom']('lobby');
  expect(calls).toBe(0);

  hub['closed'] = true;
  await hub['syncRoom']('other');
  expect(calls).toBe(0);
  hub['closed'] = false;
});

test('onInit 在已关闭时直接返回；非法总线载荷忽略', async () => {
  const hub = await createAdapter({ channel: 't:bus-junk' });
  const delivered: string[] = [];
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');

  hub['closed'] = true;
  await hub.onInit();
  hub['closed'] = false;

  await hub['redis'].publish(hub['allChannel'], 'null');
  await hub['redis'].publish(hub['allChannel'], JSON.stringify(null));
  await hub['redis'].publish(hub['allChannel'], JSON.stringify({ data: 1 }));
  // 房间名前缀后为空 → 忽略
  await hub['redis'].publish(
    hub['roomChannelPrefix'],
    JSON.stringify({ event: 'y', data: 1 }),
  );
  await new Promise((r) => setTimeout(r, 40));
  expect(delivered).toEqual([]);
});

test('订阅连接断线重连后仍能收到广播', async () => {
  const channel = 't:resubscribe';
  const delivered: string[] = [];
  const hub = await createAdapter({ channel });
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  await hub.join('a', 'lobby');

  hub['subscribedRooms'].clear();
  hub['sub'].stream.destroy();
  await waitFor(
    () => hub['sub'].status === 'ready' && hub['subscribedRooms'].has('lobby'),
  );

  await hub.broadcast('lobby', 'hello', null);
  await waitFor(() => delivered.length >= 1);
  expect(delivered).toEqual(['a']);
});

test('退订进行中有人进房：订阅保留且能收到广播', async () => {
  const hub = await createAdapter({ channel: 't:unsub-join' });
  const delivered: string[] = [];
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  hub.addClient('b');
  await hub.join('a', 'lobby');

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const orig = hub['sub'].unsubscribe.bind(hub['sub']);
  hub['sub'].unsubscribe = (async (...args: Parameters<typeof orig>) => {
    await gate;
    return orig(...args);
  }) as typeof orig;

  const leaveP = hub.leave('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  expect(hub['roomSyncs'].has('lobby')).toBe(true);
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);

  const joinP = hub.join('b', 'lobby');
  // 退订尚未完成时已订标记还在。join 会把 again 设上，这一轮结束后再按当前成员对齐。
  release();
  await Promise.all([leaveP, joinP]);

  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect([...(await hub.getClientRooms('a'))]).toEqual([]);
  expect([...(await hub.getClientRooms('b'))]).toEqual(['lobby']);

  await hub.broadcast('lobby', 'chat', 1);
  await waitFor(() => delivered.includes('b'));
  expect(delivered).toEqual(['b']);
});

test('订阅进行中换人：最终成员保持订阅并收到广播', async () => {
  const hub = await createAdapter({ channel: 't:sub-swap' });
  const delivered: string[] = [];
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  hub.addClient('b');

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (args[0] === hub['roomChannel']('lobby')) await gate;
    return orig(...args);
  }) as typeof orig;

  const joinA = hub.join('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  expect(hub['roomSyncs'].has('lobby')).toBe(true);
  const leaveA = hub.leave('a', 'lobby');
  const joinB = hub.join('b', 'lobby');
  release();
  await Promise.all([joinA, leaveA, joinB]);

  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect([...(await hub.getClientRooms('a'))]).toEqual([]);
  expect([...(await hub.getClientRooms('b'))]).toEqual(['lobby']);

  await hub.broadcast('lobby', 'chat', 1);
  await waitFor(() => delivered.includes('b'));
  expect(delivered).toEqual(['b']);
});

test('订阅失败撤回新成员，再次进房会重试', async () => {
  const hub = await createAdapter({ channel: 't:sub-fail' });
  hub.bind(() => {});
  hub.addClient('a');
  hub.addClient('b');

  const orig = hub['sub'].subscribe.bind(hub['sub']);
  let fail = true;
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (fail && args[0] === hub['roomChannel']('lobby')) {
      throw new Error('sub-fail');
    }
    return orig(...args);
  }) as typeof orig;

  await expect(
    Promise.all([hub.join('a', 'lobby'), hub.join('b', 'lobby')]),
  ).rejects.toThrow('sub-fail');
  expect(hub['rooms'].has('lobby')).toBe(false);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect([...(await hub.getClientRooms('a'))]).toEqual([]);
  expect([...(await hub.getClientRooms('b'))]).toEqual([]);

  fail = false;
  await hub.join('a', 'lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);
});

test('已在房内时订阅失败不移出成员，恢复后再次进房会订上', async () => {
  const hub = await createAdapter({ channel: 't:sub-fail-keep' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  hub['subscribedRooms'].delete('lobby');

  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async () => {
    throw new Error('sub-fail');
  }) as typeof orig;

  await expect(hub.join('a', 'lobby')).rejects.toThrow('sub-fail');
  expect(hub['rooms'].get('lobby')?.has('a')).toBe(true);
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);

  hub['sub'].subscribe = orig;
  await hub.join('a', 'lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
});

test('退订命令失败仍清本地订阅标记', async () => {
  const hub = await createAdapter({ channel: 't:unsub-fail' });
  const events: string[] = [];
  hub.bindMetric((event) => {
    if (event.type === 'unsubscribe') events.push(event.type);
  });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');

  hub['sub'].unsubscribe = (async () => {
    throw new Error('unsub-fail');
  }) as (typeof hub)['sub']['unsubscribe'];

  await expect(hub.leave('a', 'lobby')).resolves.toBeUndefined();
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect(hub.stats().rooms).toBe(0);
  expect(events).toEqual(['unsubscribe']);
});

test('有成员时对齐保持订阅；成员已清空则退订', async () => {
  const hub = await createAdapter({ channel: 't:unsub-reconcile' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');

  await hub['syncRoom']('lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);

  hub['dropMember']('a', 'lobby');
  await hub['syncRoom']('lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect(hub['rooms'].has('lobby')).toBe(false);
});

test('本地标记被清掉后按成员重新订阅', async () => {
  const hub = await createAdapter({ channel: 't:sub-heal' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  hub['subscribedRooms'].delete('lobby');

  await hub['syncRoom']('lobby');
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
});

test('关停后对齐直接返回；进行中的订阅不再记入已订房间', async () => {
  const hub = await createAdapter({ channel: 't:sync-closed' });
  hub.bind(() => {});
  hub.addClient('a');
  hub.addClient('b');

  hub['closed'] = true;
  await hub.join('a', 'quiet');
  await hub['syncRoom']('ghost');
  expect(hub['subscribedRooms'].has('quiet')).toBe(false);
  expect(hub['subscribedRooms'].has('ghost')).toBe(false);
  hub['closed'] = false;

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (args[0] === hub['roomChannel']('lobby')) await gate;
    return orig(...args);
  }) as typeof orig;

  const joinA = hub.join('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  const joinB = hub.join('b', 'lobby');
  hub['closed'] = true;
  release();
  await Promise.all([joinA, joinB]);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  hub['closed'] = false;
});

test('离开未知房间、移除未知连接、对齐表被清掉都不抛', async () => {
  const hub = await createAdapter({ channel: 't:sync-edges' });
  hub.bind(() => {});

  await hub.leave('ghost', 'missing');
  await hub.removeClient('ghost');
  expect(hub.stats()).toEqual({ online: 0, rooms: 0, subscribedRooms: 0 });

  hub.addClient('a');
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (args[0] === hub['roomChannel']('lobby')) await gate;
    return orig(...args);
  }) as typeof orig;

  const joinP = hub.join('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  hub['roomSyncs'].clear();
  release();
  await joinP;
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect(hub['roomSyncs'].has('lobby')).toBe(false);
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);
});

test('关停中的退订不再上报 unsubscribe', async () => {
  const hub = await createAdapter({ channel: 't:unsub-closed' });
  const events: string[] = [];
  hub.bindMetric((event) => {
    if (event.type === 'unsubscribe') events.push(event.type);
  });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const orig = hub['sub'].unsubscribe.bind(hub['sub']);
  hub['sub'].unsubscribe = (async (...args: Parameters<typeof orig>) => {
    await gate;
    return orig(...args);
  }) as typeof orig;

  const leaveP = hub.leave('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  hub['closed'] = true;
  release();
  await leaveP;
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect(events).toEqual([]);
  hub['closed'] = false;
});

test('订阅失败时离开和移除连接不向外抛', async () => {
  const hub = await createAdapter({ channel: 't:sync-catch' });
  hub.bind(() => {});
  hub.addClient('a');
  hub.addClient('b');
  hub['sub'].subscribe = (async () => {
    throw new Error('sub-fail');
  }) as (typeof hub)['sub']['subscribe'];

  const joinA = hub.join('a', 'lobby');
  const leaveA = hub.leave('a', 'lobby');
  const joinB = hub.join('b', 'other');
  const removeB = hub.removeClient('b');

  await expect(leaveA).resolves.toBeUndefined();
  await expect(removeB).resolves.toBeUndefined();
  await expect(joinA).rejects.toThrow('sub-fail');
  await expect(joinB).rejects.toThrow('sub-fail');
  expect(hub['rooms'].size).toBe(0);
  expect(hub.stats()).toMatchObject({ online: 1, rooms: 0, subscribedRooms: 0 });
});

test('过期重连不写已订标记，新一轮重连仍能收到广播', async () => {
  const hub = await createAdapter({ channel: 't:resync-epoch' });
  const delivered: string[] = [];
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  await hub.join('a', 'lobby');

  // 代数对不上时，恢复函数在发出任何 SUBSCRIBE 之前就返回。
  await hub['restoreSubscriptions'](-1);
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);

  let releaseAll!: () => void;
  const allGate = new Promise<void>((resolve) => {
    releaseAll = resolve;
  });
  let sawAll = false;
  let blockLobby = false;
  let releaseLobby!: () => void;
  const lobbyGate = new Promise<void>((resolve) => {
    releaseLobby = resolve;
  });
  let sawLobby = false;
  const lobby = hub['roomChannel']('lobby');
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (!sawAll && args[0] === hub['allChannel']) {
      sawAll = true;
      await allGate;
    }
    if (blockLobby && args[0] === lobby) {
      sawLobby = true;
      await lobbyGate;
    }
    return orig(...args);
  }) as typeof orig;

  const epoch = hub['subscriptionEpoch'];
  const stale = hub['resyncSubscriptions']();
  await waitFor(() => sawAll);
  hub['invalidateSubscriptions']();
  expect(hub['subscriptionEpoch']).toBe(epoch + 1);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect(hub['resubscribePromise']).toBeUndefined();

  blockLobby = true;
  const fresh = hub['resyncSubscriptions']();
  expect(hub['resubscribePromise']).toBe(fresh);
  releaseAll();
  await stale;
  await waitFor(() => sawLobby);
  // 旧一轮的 finally 不能把新一轮的占位清掉，也不能提前把房间标成已订。
  expect(hub['resubscribePromise']).toBe(fresh);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  releaseLobby();
  await fresh;
  expect(hub['resubscribePromise']).toBeUndefined();
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);

  await hub.broadcast('lobby', 'back', 1);
  await waitFor(() => delivered.includes('a'));
});

test('订阅返回时连接已换代，这次结果不记入已订房间', async () => {
  const hub = await createAdapter({ channel: 't:sub-epoch' });
  const events: string[] = [];
  hub.bindMetric((event) => {
    if (event.type === 'subscribe' && event.room) events.push(event.room);
  });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  events.length = 0;
  hub['subscribedRooms'].delete('lobby');

  let calls = 0;
  let releaseFirst!: () => void;
  let releaseSecond!: () => void;
  const firstGate = new Promise<void>((resolve) => {
    releaseFirst = resolve;
  });
  const secondGate = new Promise<void>((resolve) => {
    releaseSecond = resolve;
  });
  const lobby = hub['roomChannel']('lobby');
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (args[0] === lobby) {
      calls += 1;
      if (calls === 1) await firstGate;
      if (calls === 2) await secondGate;
    }
    return orig(...args);
  }) as typeof orig;

  const syncing = hub['syncRoom']('lobby');
  await waitFor(() => calls === 1);
  hub['invalidateSubscriptions']();
  releaseFirst();
  await waitFor(() => calls === 2);
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect(events).toEqual([]);
  releaseSecond();
  await syncing;
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect(events).toEqual(['lobby']);
});

test('退订返回时连接已换代，不上报 unsubscribe', async () => {
  const hub = await createAdapter({ channel: 't:unsub-epoch' });
  const events: string[] = [];
  hub.bindMetric((event) => {
    if (event.type === 'unsubscribe') events.push(event.type);
  });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');

  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const orig = hub['sub'].unsubscribe.bind(hub['sub']);
  hub['sub'].unsubscribe = (async (...args: Parameters<typeof orig>) => {
    await gate;
    return orig(...args);
  }) as typeof orig;

  const leaveP = hub.leave('a', 'lobby');
  await new Promise((r) => setImmediate(r));
  hub['invalidateSubscriptions']();
  release();
  await leaveP;
  expect(hub['subscribedRooms'].has('lobby')).toBe(false);
  expect(events).toEqual([]);
  expect(hub.stats().rooms).toBe(0);
});

test('重连会补上等待期间出现的房间，单个失败不挡住其它房间', async () => {
  const hub = await createAdapter({ channel: 't:resync-pass' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');

  let injected = false;
  const origSync = hub['syncRoom'].bind(hub);
  hub['syncRoom'] = ((room: string) => {
    if (room === 'lobby' && !injected) {
      injected = true;
      hub['rooms'].set('late', new Set(['a']));
    }
    if (room === 'bad') return Promise.reject(new Error('bad-room'));
    return origSync(room);
  }) as (typeof hub)['syncRoom'];

  hub['rooms'].set('bad', new Set(['a']));
  hub['subscribedRooms'].clear();
  await hub['resyncSubscriptions']();
  expect(injected).toBe(true);
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect(hub['subscribedRooms'].has('late')).toBe(true);
  expect(hub['subscribedRooms'].has('bad')).toBe(false);
});

test('房间订阅进行中再次断线，这一轮重连不再继续扫房间', async () => {
  const hub = await createAdapter({ channel: 't:resync-mid' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  hub['subscribedRooms'].delete('lobby');

  let calls = 0;
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  const lobby = hub['roomChannel']('lobby');
  const orig = hub['sub'].subscribe.bind(hub['sub']);
  hub['sub'].subscribe = (async (...args: Parameters<typeof orig>) => {
    if (args[0] === lobby && calls === 0) {
      calls += 1;
      await gate;
    }
    return orig(...args);
  }) as typeof orig;

  const task = hub['resyncSubscriptions']();
  await waitFor(() => calls === 1);
  // 第一轮已经开始之后才出现的房间。断线后这一轮必须停，不能把它标成已订。
  hub['rooms'].set('late', new Set(['a']));
  hub['invalidateSubscriptions']();
  release();
  await task;
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
  expect(hub['subscribedRooms'].has('late')).toBe(false);
  expect(hub['resubscribePromise']).toBeUndefined();
});

test('总线扇出时单个 deliver 失败不产生未处理 rejection', async () => {
  const delivered: string[] = [];
  const rejections: unknown[] = [];
  const onRejection = (err: unknown) => {
    rejections.push(err);
  };
  process.on('unhandledRejection', onRejection);
  try {
    const hub = await createAdapter({ channel: 't:fanout-reject' });
    hub.bind((id) => {
      if (id === 'bad') return Promise.reject(new Error('send-fail'));
      delivered.push(id);
      return undefined;
    });
    hub.addClient('bad');
    hub.addClient('ok');
    await hub.join('bad', 'lobby');
    await hub.join('ok', 'lobby');

    await hub.broadcast('lobby', 'x', 1);
    await waitFor(() => delivered.includes('ok'));
    expect(delivered).toEqual(['ok']);

    delivered.length = 0;
    await hub.broadcastAll('y', 2);
    await waitFor(() => delivered.includes('ok'));
    await new Promise((resolve) => setImmediate(resolve));
    expect(delivered).toEqual(['ok']);
    expect(rejections).toEqual([]);
  } finally {
    process.off('unhandledRejection', onRejection);
  }
});

test('总线回调接住 fanout 自己的拒绝', async () => {
  const hub = await createAdapter({ channel: 't:fanout-self' });
  hub['fanout'] = () => Promise.reject(new Error('fanout-fail'));
  const rejections: unknown[] = [];
  const onRejection = (err: unknown) => {
    rejections.push(err);
  };
  process.on('unhandledRejection', onRejection);
  try {
    hub['onBusMessage'](hub['allChannel'], JSON.stringify({ event: 'e', data: 1 }));
    hub['onBusMessage'](
      hub['roomChannel']('lobby'),
      JSON.stringify({ event: 'e', data: 1 }),
    );
    await new Promise((resolve) => setImmediate(resolve));
    expect(rejections).toEqual([]);
  } finally {
    process.off('unhandledRejection', onRejection);
  }
});

test('房间订阅对齐失败会记日志', async () => {
  const logs: string[] = [];
  const hub = await createAdapter({ channel: 't:sync-log' });
  hub.bindLogger({
    error() {},
    warn(_err: unknown, message?: string) {
      logs.push(message ?? '');
    },
  } as unknown as AppLogger);
  hub.addClient('a');
  await hub.join('a', 'lobby');
  hub['syncRoom'] = () => Promise.reject(new Error('sync-down'));
  await hub.leave('a', 'lobby');
  expect(logs).toEqual([i18n.t('sync_room_failed', { room: 'lobby' })]);
});

test('关停后重连直接返回', async () => {
  const hub = await createAdapter({ channel: 't:resync-closed' });
  hub.bind(() => {});
  hub.addClient('a');
  await hub.join('a', 'lobby');
  hub['closed'] = true;
  await hub['resyncSubscriptions']();
  expect(hub['resubscribePromise']).toBeUndefined();
  hub['closed'] = false;
  expect(hub['subscribedRooms'].has('lobby')).toBe(true);
});

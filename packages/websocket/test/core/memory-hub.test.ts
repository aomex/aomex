import { afterEach, expect, test } from 'vitest';
import { internalDestroyServices } from '@aomex/common';
import type { WebApp } from '@aomex/web';
import { MemoryHub, type WebsocketMetricEvent } from '../../src';
import { i18n } from '../../src/i18n';

afterEach(async () => {
  await internalDestroyServices([]);
});

test('MemoryHub 房间广播与 except', async () => {
  const delivered: Array<[string, string, unknown]> = [];
  const hub = new MemoryHub();
  hub.bind((clientId, event, data) => {
    delivered.push([clientId, event, data]);
  });

  hub.addClient('a');
  hub.addClient('b');
  hub.addClient('c');
  hub.join('a', 'lobby');
  hub.join('b', 'lobby');
  hub.join('c', 'other');

  await hub.broadcast('lobby', 'chat', { text: 'hi' }, { exceptId: 'a' });
  expect(delivered).toEqual([['b', 'chat', { text: 'hi' }]]);

  delivered.length = 0;
  await hub.broadcastAll('notice', 1, { exceptId: 'c' });
  expect(delivered.sort((x, y) => x[0].localeCompare(y[0]))).toEqual([
    ['a', 'notice', 1],
    ['b', 'notice', 1],
  ]);
});

test('MemoryHub removeClient 清空房间', async () => {
  const hub = new MemoryHub();
  hub.bind(() => {});
  hub.addClient('a');
  hub.join('a', 'lobby');
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);
  hub.removeClient('a');
  expect([...(await hub.getClientRooms('a'))]).toEqual([]);

  const delivered: string[] = [];
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('b');
  hub.join('b', 'lobby');
  await hub.broadcast('lobby', 'x', null);
  expect(delivered).toEqual(['b']);
});

test('重复 addClient 不丢已有房间；离线 join 忽略', async () => {
  const hub = new MemoryHub();
  hub.bind(() => {});
  hub.addClient('a');
  hub.join('a', 'lobby');
  hub.addClient('a');
  expect([...(await hub.getClientRooms('a'))]).toEqual(['lobby']);

  hub.join('ghost', 'lobby');
  expect([...(await hub.getClientRooms('ghost'))]).toEqual([]);
});

test('leave 不存在的房间与空房广播为空操作', async () => {
  const delivered: string[] = [];
  const hub = new MemoryHub();
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  hub.leave('a', 'missing');
  await hub.broadcast('missing', 'x', 1);
  expect(delivered).toEqual([]);

  hub.join('a', 'lobby');
  hub.leave('a', 'lobby');
  await hub.broadcast('lobby', 'x', 1);
  expect(delivered).toEqual([]);
});

test('broadcastAll 无 except 推给全部在线', async () => {
  const delivered: string[] = [];
  const hub = new MemoryHub();
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  hub.addClient('b');
  await hub.broadcastAll('n', true);
  expect(delivered.sort()).toEqual(['a', 'b']);
});

test('bindMetric：broadcast / broadcastAll 上报 fanout', async () => {
  const events: WebsocketMetricEvent[] = [];
  const hub = new MemoryHub();
  hub.bindMetric((e) => {
    events.push(e);
  });
  hub.bind(() => {});
  hub.addClient('a');
  hub.addClient('b');
  hub.join('a', 'lobby');
  hub.join('b', 'lobby');

  await hub.broadcast('lobby', 'x', 1, { exceptId: 'a' });
  expect(
    events.some(
      (e) =>
        e.type === 'fanout' && e.scope === 'room' && e.targets === 1 && e.failed === 0,
    ),
  ).toBe(true);

  events.length = 0;
  await hub.broadcastAll('n', true);
  expect(
    events.some(
      (e) =>
        e.type === 'fanout' && e.scope === 'all' && e.targets === 2 && e.failed === 0,
    ),
  ).toBe(true);

  events.length = 0;
  await hub.broadcast('empty', 'x', 1);
  expect(events.some((e) => e.type === 'fanout')).toBe(false);
});

test('stats：在线数与非空房间数；subscribedRooms 恒为 0', async () => {
  const hub = new MemoryHub();
  expect(hub.stats()).toEqual({ online: 0, rooms: 0, subscribedRooms: 0 });

  hub.addClient('a');
  hub.addClient('b');
  hub.join('a', 'lobby');
  hub.join('b', 'lobby');
  hub.join('b', 'other');
  expect(hub.stats()).toEqual({ online: 2, rooms: 2, subscribedRooms: 0 });

  hub.leave('a', 'lobby');
  hub.leave('b', 'lobby');
  expect(hub.stats()).toEqual({ online: 2, rooms: 1, subscribedRooms: 0 });

  hub.removeClient('b');
  expect(hub.stats()).toEqual({ online: 1, rooms: 0, subscribedRooms: 0 });
});

test('扇出时单个 deliver 失败不影响其余连接', async () => {
  const delivered: string[] = [];
  const events: WebsocketMetricEvent[] = [];
  const logs: Array<{ level: string; message?: string }> = [];
  const rejections: unknown[] = [];
  const onRejection = (err: unknown) => {
    rejections.push(err);
  };
  process.on('unhandledRejection', onRejection);
  try {
    const hub = new MemoryHub();
    hub.bindLogger({
      error(err, message) {
        logs.push({ level: 'error', message });
        void err;
      },
      warn(err, message) {
        logs.push({ level: 'warn', message });
        void err;
      },
    } as WebApp.Logger);
    hub.bindMetric((e) => {
      events.push(e);
    });
    hub.bind((id) => {
      if (id === 'sync') throw new Error('sync-fail');
      if (id === 'async') return Promise.reject(new Error('async-fail'));
      delivered.push(id);
      return undefined;
    });
    for (const id of ['sync', 'ok', 'async']) {
      hub.addClient(id);
      hub.join(id, 'lobby');
    }
    await expect(hub.broadcast('lobby', 'x', 1)).resolves.toBeUndefined();
    await new Promise((resolve) => setImmediate(resolve));
    expect(delivered).toEqual(['ok']);
    expect(rejections).toEqual([]);
    expect(logs).toEqual([
      {
        level: 'warn',
        message: i18n.t('fanout_deliver_failed', { failed: 2 }),
      },
    ]);
    expect(events).toEqual([
      expect.objectContaining({
        type: 'fanout',
        scope: 'room',
        room: 'lobby',
        targets: 3,
        failed: 2,
      }),
    ]);
  } finally {
    process.off('unhandledRejection', onRejection);
  }
});

test('未 bind 时 broadcast 走默认空 deliver', async () => {
  const hub = new MemoryHub();
  hub.addClient('a');
  hub.join('a', 'lobby');
  await expect(hub.broadcast('lobby', 'x', 1)).resolves.toBeUndefined();
  await expect(hub.broadcastAll('y', 2)).resolves.toBeUndefined();
});

test('扇出超过 batchSize 仍投递全部成员', async () => {
  const delivered: string[] = [];
  const hub = new MemoryHub({ fanoutBatchSize: 8 });
  hub.bind((id) => {
    delivered.push(id);
  });
  const n = 25;
  for (let i = 0; i < n; i++) {
    const id = `c${i}`;
    hub.addClient(id);
    hub.join(id, 'lobby');
  }
  await hub.broadcast('lobby', 'x', 1);
  expect(delivered).toHaveLength(n);
  expect(new Set(delivered).size).toBe(n);
});

test('扇出 batch 间会让出事件循环', async () => {
  const hub = new MemoryHub({ fanoutBatchSize: 2 });
  let yields = 0;
  const original = globalThis.setImmediate;
  globalThis.setImmediate = ((fn: (...args: any[]) => void, ...args: any[]) => {
    yields++;
    return original(fn, ...args);
  }) as typeof setImmediate;

  try {
    hub.bind(() => {});
    for (let i = 0; i < 5; i++) {
      const id = `c${i}`;
      hub.addClient(id);
      hub.join(id, 'big');
    }
    await hub.broadcast('big', 'x', 1);
    // 5 人、batch=2 → 完整批 2 次让出，末批不满不再让出
    expect(yields).toBe(2);
  } finally {
    globalThis.setImmediate = original;
  }
});

test('fanoutBatchSize 非法时回退默认分片', async () => {
  const delivered: string[] = [];
  const hub = new MemoryHub({ fanoutBatchSize: 0 });
  expect(hub['fanoutBatchSize']).toBe(256);
  hub.bind((id) => {
    delivered.push(id);
  });
  hub.addClient('a');
  hub.addClient('b');
  hub.join('a', 'r');
  hub.join('b', 'r');
  await hub.broadcast('r', 'x', 1);
  expect(delivered.sort()).toEqual(['a', 'b']);
});

test('fanoutBatchSize：undefined / 非有限数 / 小数分别解析', () => {
  expect(new MemoryHub()['fanoutBatchSize']).toBe(256);
  expect(new MemoryHub({ fanoutBatchSize: Number.NaN })['fanoutBatchSize']).toBe(256);
  expect(new MemoryHub({ fanoutBatchSize: -3 })['fanoutBatchSize']).toBe(256);
  expect(new MemoryHub({ fanoutBatchSize: 8.9 })['fanoutBatchSize']).toBe(8);
});

test('reportMetric 无 handler 时不抛；handler 抛错会记日志', async () => {
  const logs: string[] = [];
  const hub = new MemoryHub();
  hub.bindLogger({
    error() {},
    warn(_err: unknown, message?: string) {
      logs.push(message ?? '');
    },
  } as unknown as WebApp.Logger);
  hub.bind(() => {});
  hub.addClient('a');
  hub.join('a', 'r');
  await expect(hub.broadcast('r', 'x', 1)).resolves.toBeUndefined();

  hub.bindMetric(() => {
    throw new Error('boom');
  });
  await expect(hub.broadcast('r', 'x', 2)).resolves.toBeUndefined();
  expect(logs).toEqual([i18n.t('metric_handler_failed')]);
});

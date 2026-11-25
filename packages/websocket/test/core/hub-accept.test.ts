import { afterEach, expect, test } from 'vitest';
import type { Logger } from '@aomex/logger';
import { internalDestroyServices } from '@aomex/common';
import { MemoryHub, WebsocketHub, type WebsocketTransport } from '../../src';
import { i18n } from '../../src/i18n';

const silentLogger = { error() {}, warn() {} } as unknown as Logger;

const openHub = (
  adapter: ConstructorParameters<typeof WebsocketHub>[0],
  options?: ConstructorParameters<typeof WebsocketHub>[1],
) => {
  const hub = new WebsocketHub(adapter, options);
  hub.bindLogger(silentLogger);
  return hub;
};

afterEach(async () => {
  await internalDestroyServices([]);
});

const flush = () => new Promise((resolve) => setImmediate(resolve));

class ScriptedHub extends MemoryHub {
  mode: 'ok' | 'fail' | 'defer' = 'ok';
  failRemove = false;
  private deferredReject?: (err: Error) => void;

  override join(clientId: string, room: string): void | Promise<void> {
    if (this.mode === 'fail') return Promise.reject(new Error('join-fail'));
    if (this.mode === 'defer') {
      return new Promise<void>((_, reject) => {
        this.deferredReject = reject;
      });
    }
    super.join(clientId, room);
  }

  rejectDeferred(): void {
    this.deferredReject?.(new Error('join-fail'));
  }

  override removeClient(clientId: string): void | Promise<void> {
    if (this.failRemove) return Promise.reject(new Error('remove-fail'));
    super.removeClient(clientId);
  }
}

function fakeTransport(
  id: string,
  options?: { closeError?: Error; invokeClose?: boolean },
) {
  let onMessage: ((event: string, data: unknown) => void) | undefined;
  let onClose: (() => void) | undefined;
  const calls = { close: 0 };
  const transport: WebsocketTransport = {
    id,
    request: { ip: '' } as WebsocketTransport['request'],
    send() {},
    close() {
      calls.close += 1;
      if (options?.invokeClose !== false) onClose?.();
      if (options?.closeError) throw options.closeError;
    },
    onMessage(handler) {
      onMessage = handler;
    },
    onClose(handler) {
      onClose = handler;
    },
  };
  return {
    transport,
    calls,
    emit(event: string, data: unknown = null) {
      onMessage?.(event, data);
    },
    disconnect() {
      onClose?.();
    },
  };
}

async function expectNoUnhandled(run: () => Promise<void>): Promise<void> {
  const rejections: unknown[] = [];
  const onRejection = (err: unknown) => {
    rejections.push(err);
  };
  process.on('unhandledRejection', onRejection);
  try {
    await run();
    await flush();
    expect(rejections).toEqual([]);
  } finally {
    process.off('unhandledRejection', onRejection);
  }
}

test('接入失败日志跟随连接语言', async () => {
  const messages: string[] = [];
  const inner = new ScriptedHub();
  inner.mode = 'fail';
  const hub = new WebsocketHub(inner);
  hub.bindLogger({
    error(_err: unknown, message?: string) {
      messages.push(message ?? '');
    },
    warn() {},
  } as unknown as Logger);
  const conn = fakeTransport('c1');
  hub.accept(conn.transport, 'en-US');
  await flush();
  expect(messages).toContain(i18n.t('accept_failed', undefined, 'en-US'));
  expect(conn.calls.close).toBe(1);
});

test('接入后加入个人房间，断开后从在线表移除', async () => {
  const seen: string[] = [];
  const hub = openHub(new MemoryHub(), {
    pipeline: async (ctx) => {
      seen.push(ctx.event);
    },
  });
  const conn = fakeTransport('c1', { invokeClose: false });
  hub.accept(conn.transport, 'zh-CN');
  await flush();
  expect(hub['clients'].has('c1')).toBe(true);
  expect([...(await hub.getClientRooms('c1'))]).toEqual(['c1']);

  conn.emit('ping', { n: 1 });
  await flush();
  expect(seen).toEqual(['ping']);

  conn.disconnect();
  await flush();
  expect(hub['clients'].has('c1')).toBe(false);
  expect([...(await hub.getClientRooms('c1'))]).toEqual([]);
});

test('个人房间登记失败时移出在线表并关闭连接', async () => {
  await expectNoUnhandled(async () => {
    const inner = new ScriptedHub();
    inner.mode = 'defer';
    const hub = openHub(inner);
    const conn = fakeTransport('c1');
    hub.accept(conn.transport, 'zh-CN');
    await flush();
    conn.emit('ping', { n: 1 });
    inner.rejectDeferred();
    await flush();
    expect(hub['clients'].has('c1')).toBe(false);
    expect(conn.calls.close).toBe(1);
    expect([...(await hub.getClientRooms('c1'))]).toEqual([]);
  });
});

test('接入、进退房、移除和广播共享同一次 Hub 初始化', async () => {
  class GateHub extends MemoryHub {
    inits = 0;
    joins = 0;
    leaves = 0;
    removes = 0;
    broadcasts = 0;
    release!: () => void;

    override onInit(): Promise<void> {
      this.inits += 1;
      return new Promise((resolve) => {
        this.release = resolve;
      });
    }

    override join(clientId: string, room: string): void {
      this.joins += 1;
      super.join(clientId, room);
    }

    override leave(clientId: string, room: string): void {
      this.leaves += 1;
      super.leave(clientId, room);
    }

    override removeClient(clientId: string): void {
      this.removes += 1;
      super.removeClient(clientId);
    }

    override async broadcast(): Promise<void> {
      this.broadcasts += 1;
    }

    override async broadcastAll(): Promise<void> {
      this.broadcasts += 1;
    }
  }

  const inner = new GateHub();
  const hub = openHub(inner);
  const conn = fakeTransport('c1', { invokeClose: false });
  hub.accept(conn.transport, 'zh-CN');
  const client = hub['clients'].get('c1')!;
  await expect(hub.leave(client, '')).rejects.toThrow();

  const leaveP = hub.leave(client, 'lobby');
  const broadcastP = hub.broadcast('lobby', 'e', 1);
  const broadcastAllP = hub.broadcastAll('e', 1);
  await flush();
  expect(inner.inits).toBe(1);
  expect(inner.joins).toBe(0);
  expect(inner.leaves).toBe(0);
  expect(inner.broadcasts).toBe(0);
  expect([...(await hub.getClientRooms('c1'))]).toEqual([]);

  const removeP = hub.removeClient(client);
  await flush();
  expect(inner.removes).toBe(0);

  inner.release();
  await Promise.all([leaveP, broadcastP, broadcastAllP, removeP]);
  await flush();
  expect(inner.inits).toBe(1);
  expect(inner.joins).toBe(1);
  expect(inner.leaves).toBe(1);
  expect(inner.removes).toBe(1);
  expect(inner.broadcasts).toBe(2);
  expect(hub['clients'].has('c1')).toBe(false);
});

test('Hub 初始化失败时关掉连接且不产生未处理 rejection', async () => {
  class BoomHub extends MemoryHub {
    override onInit(): Promise<void> {
      return Promise.reject(new Error('hub-down'));
    }
  }

  await expectNoUnhandled(async () => {
    const hub = openHub(new BoomHub());
    const conn = fakeTransport('c1');
    hub.accept(conn.transport, 'zh-CN');
    await flush();
    expect(conn.calls.close).toBe(1);
    expect(hub['clients'].has('c1')).toBe(false);
    await expect(hub.broadcast('lobby', 'e', 1)).rejects.toThrow('hub-down');
  });
});

test('移除或关闭失败时仍不把连接留在在线表', async () => {
  await expectNoUnhandled(async () => {
    const inner = new ScriptedHub();
    inner.mode = 'fail';
    inner.failRemove = true;
    const hub = openHub(inner);
    const conn = fakeTransport('c1', { closeError: new Error('close-fail') });
    hub.accept(conn.transport, 'zh-CN');
    conn.emit('ping');
    await flush();
    expect(hub['clients'].has('c1')).toBe(false);
    expect(inner['online'].has('c1')).toBe(false);
    expect(conn.calls.close).toBe(1);
  });
});

test('回推 error 失败时入站队列不产生未处理 rejection，后续消息仍会处理', async () => {
  const seen: string[] = [];
  const logs: string[] = [];
  const conn = fakeTransport('c1', { invokeClose: false });
  conn.transport.send = () => {
    throw new Error('send-fail');
  };
  const hub = openHub(new MemoryHub(), {
    unknownEvent: 'error',
    pipeline: async (ctx, next) => {
      seen.push(ctx.event);
      await next?.();
    },
  });
  hub.bindLogger({
    error(_err, message) {
      logs.push(message ?? '');
    },
    warn(_err, message) {
      logs.push(message ?? '');
    },
  } as Logger);
  hub.accept(conn.transport, 'zh-CN');
  await flush();

  await expectNoUnhandled(async () => {
    conn.emit('a');
    conn.emit('b');
    await flush();
  });
  expect(seen).toEqual(['a', 'b']);
  expect(logs).toEqual([
    i18n.t('inbound_task_failed'),
    i18n.t('error_frame_failed'),
    i18n.t('inbound_task_failed'),
    i18n.t('error_frame_failed'),
  ]);
});

test('入站队列任务自己拒绝时也不会变成未处理 rejection', async () => {
  const hub = openHub(new MemoryHub());
  await expectNoUnhandled(async () => {
    hub['enqueue']('c1', async () => {
      throw new Error('task-fail');
    });
    await flush();
    hub['enqueue']('c1', async () => {});
    await flush();
    expect(hub['dispatchQueues'].has('c1')).toBe(false);
  });
});

test('移除适配器抛错时仍清掉在线表和房间成员', async () => {
  class StickyHub extends MemoryHub {
    override join(clientId: string, room: string): Promise<void> {
      super.join(clientId, room);
      return Promise.reject(new Error('join-fail'));
    }

    override removeClient(): Promise<void> {
      return Promise.reject(new Error('remove-fail'));
    }
  }

  const inner = new StickyHub();
  const hub = openHub(inner);
  const conn = fakeTransport('c1', { invokeClose: false });
  await expectNoUnhandled(async () => {
    hub.accept(conn.transport, 'zh-CN');
    await flush();
  });

  expect(hub['clients'].has('c1')).toBe(false);
  expect(inner['online'].has('c1')).toBe(false);
  expect(inner['rooms'].has('c1')).toBe(false);

  const delivered: string[] = [];
  inner.bind((id) => {
    delivered.push(id);
  });
  await inner.broadcast('c1', 'x', 1);
  await inner.broadcastAll('y', 1);
  expect(delivered).toEqual([]);
});

test('清本机成员再失败时仍断开连接', async () => {
  class ExplosiveHub extends MemoryHub {
    override join(): Promise<void> {
      return Promise.reject(new Error('join-fail'));
    }

    override removeClient(): Promise<void> {
      return Promise.reject(new Error('remove-fail'));
    }

    protected override forgetLocalClient(): readonly string[] {
      throw new Error('forget-fail');
    }
  }

  const hub = openHub(new ExplosiveHub());
  const conn = fakeTransport('c1', { invokeClose: false });
  await expectNoUnhandled(async () => {
    hub.accept(conn.transport, 'zh-CN');
    await flush();
  });
  expect(hub['clients'].has('c1')).toBe(false);
  expect(conn.calls.close).toBe(1);
});

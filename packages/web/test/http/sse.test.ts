import { TestWebApp } from '../../src/testing';
import { expect, test, vi } from 'vitest';
import http from 'node:http';
import type { AddressInfo } from 'node:net';
import request from 'supertest';
import { middleware } from '@aomex/common';
import { mockServer } from '../fixture/mock-server';
test('设置 SSE 响应头并发送 data', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.send({ data: { hello: 'world' } });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen())
    .get('/')
    .expect(200)
    .expect('content-type', /text\/event-stream/)
    .expect('cache-control', /no-cache/)
    .expect('x-accel-buffering', 'no');

  expect(res.text).toContain('data: {"hello":"world"}');
  expect(res.headers).not.toHaveProperty('content-encoding');
});

test('response.sse 与 ctx.sse 等价', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.response.sse({ heartbeat: false });
        sse.send({ event: 'ping', data: 'x' });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('event: ping');
  expect(res.text).toContain('data: x');
});

test('多行字符串 data 拆成多行 data 字段', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.send({ data: 'a\nb\nc' });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('data: a\ndata: b\ndata: c\n');
});

test('id / event / retry 字段', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false, retry: 3000 });
        sse.send({ id: '42', event: 'job', retry: 5000, data: 1 });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text.startsWith('retry: 3000\n')).toBeTruthy();
  expect(res.text).toContain('id: 42');
  expect(res.text).toContain('event: job');
  expect(res.text).toContain('retry: 5000');
  expect(res.text).toContain('data: 1');
});

test('Options.retry 为 0 仍写入', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false, retry: 0 });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text.startsWith('retry: 0\n')).toBeTruthy();
});

test('send 仅 event、无 data', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.send({ event: 'ready' });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('event: ready');
  expect(res.text).not.toContain('data:');
});

test('send 支持 null / boolean / array，undefined 不写 data', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.send({ data: null });
        sse.send({ data: true });
        sse.send({ data: [1, 2] });
        sse.send({ data: undefined });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('data: null\n');
  expect(res.text).toContain('data: true\n');
  expect(res.text).toContain('data: [1,2]\n');
  expect(res.text.match(/^data:/gm)?.length).toBe(3);
});

test('读取 Last-Event-ID', async () => {
  let lastEventId: string | undefined;
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        lastEventId = sse.lastEventId;
        sse.close();
      }),
    ],
  });

  await request(app.listen()).get('/').set('Last-Event-ID', '99').expect(200);
  expect(lastEventId).toBe('99');
});

test('无 Last-Event-ID 时为 undefined', async () => {
  let lastEventId: string | undefined = 'unset';
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        lastEventId = sse.lastEventId;
        sse.close();
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(lastEventId).toBeUndefined();
});

test('Last-Event-ID 空字符串为 undefined，数组取首项', async () => {
  let emptyId: string | undefined = 'unset';
  let arrayId: string | undefined;
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        ctx.request.headers['last-event-id'] = '';
        emptyId = sse.lastEventId;
        ctx.request.headers['last-event-id'] = ['a', 'b'];
        arrayId = sse.lastEventId;
        sse.close();
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(emptyId).toBeUndefined();
  expect(arrayId).toBe('a');
});

test('stream 推送结束后自动 close', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        await sse.stream(async (emit) => {
          emit({ data: 1 });
          emit({ data: 2 });
        });
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('data: 1');
  expect(res.text).toContain('data: 2');
});

test('stream 支持同步回调', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        await sse.stream((emit) => {
          emit({ data: 'sync' });
        });
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('data: sync');
});

test('onClose 在 close 时触发', async () => {
  const spy = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.onClose(spy);
        sse.send({ data: 'ok' });
        sse.close();
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('onClose 可链式且均可执行', async () => {
  const a = vi.fn();
  const b = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        expect(sse.onClose(a).onClose(b)).toBe(sse);
        sse.close();
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(a).toHaveBeenCalledTimes(1);
  expect(b).toHaveBeenCalledTimes(1);
});

test('已关闭后再 onClose 立即执行', async () => {
  const spy = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.close();
        sse.onClose(spy);
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('重复 close 幂等，onClose 只跑一轮', async () => {
  const spy = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.onClose(spy);
        sse.close();
        sse.close();
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('teardown 抛错不影响关流与后续 teardown', async () => {
  const spy = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.onClose(() => {
          throw new Error('teardown fail');
        });
        sse.onClose(spy);
        expect(() => sse.close()).not.toThrow();
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('headers 已发送后再开 SSE 抛错', async () => {
  let error: unknown;
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        ctx.response.statusCode = 200;
        ctx.response.setHeader('Content-Type', 'text/plain');
        ctx.response.flushHeaders();
        try {
          ctx.sse({ heartbeat: false });
        } catch (e) {
          error = e;
        }
        ctx.response.end('already');
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200).expect('already');
  expect(error).toBeInstanceOf(Error);
  expect((error as Error).message).toMatch(/headers already sent/);
});

test('close 后 send 不再写入', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.close();
        sse.send({ data: 'nope' });
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).not.toContain('nope');
});

test('response 不可写时 writeRaw 触发 close', async () => {
  const { ctx, res } = await mockServer((agent) => agent.get('/'));
  const sse = ctx.sse({ heartbeat: false });
  const spy = vi.fn();
  sse.onClose(spy);

  Object.defineProperty(res, 'writable', {
    configurable: true,
    get: () => false,
  });
  sse['writeRaw']('data: x\n\n');

  expect(spy).toHaveBeenCalledTimes(1);
  expect(sse.signal.aborted).toBe(true);

  Reflect.deleteProperty(res, 'writable');
  res.end();
});

test('id/event 中的换行会被剔除', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.send({ id: 'a\nb', event: 'x\ry', data: 'z' });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain('id: ab');
  expect(res.text).toContain('event: xy');
  expect(res.text).not.toMatch(/^id: a$/m);
});

test('stream 内 signal 在 close 后 aborted', async () => {
  let aborted = false;
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        await sse.stream(async (_emit, signal) => {
          sse.close();
          aborted = signal.aborted;
        });
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(aborted).toBe(true);
});

test('stream 抛错时仍会 close', async () => {
  const spy = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        sse.onClose(spy);
        await expect(
          sse.stream(async () => {
            throw new Error('boom');
          }),
        ).rejects.toThrow('boom');
      }),
    ],
  });

  await request(app.listen()).get('/').expect(200);
  expect(spy).toHaveBeenCalledTimes(1);
});

test('heartbeat: 0 与 false 均关闭心跳', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: 0 });
        sse.send({ data: 'ok' });
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).not.toContain(': \n\n');
  expect(res.text).toBe('data: ok\n\n');
});

test('heartbeat 定时写出注释行', async () => {
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: 30 });
        await new Promise((resolve) => setTimeout(resolve, 80));
        sse.close();
      }),
    ],
  });

  const res = await request(app.listen()).get('/').expect(200);
  expect(res.text).toContain(': \n\n');
});

test('客户端断开触发自动 close', async () => {
  const onClose = vi.fn();
  const app = new TestWebApp({
    mount: [
      middleware.web(async (ctx) => {
        const sse = ctx.sse({ heartbeat: false });
        await new Promise<void>((resolve) => {
          sse.onClose(() => {
            onClose();
            resolve();
          });
        });
      }),
    ],
  });

  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', () => resolve()));
  const { port } = server.address() as AddressInfo;

  await new Promise<void>((resolve, reject) => {
    const req = http.get(`http://127.0.0.1:${port}/`, (res) => {
      res.resume();
      req.destroy();
    });
    req.on('error', () => resolve());
    req.on('close', () => resolve());
    setTimeout(() => reject(new Error('client disconnect timeout')), 3000);
  });

  await vi.waitFor(() => expect(onClose).toHaveBeenCalled(), { timeout: 3000 });
  await new Promise<void>((resolve) => server.close(() => resolve()));
});

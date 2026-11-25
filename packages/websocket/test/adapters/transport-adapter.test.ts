import { IncomingMessage } from 'node:http';
import { Socket } from 'node:net';
import { afterEach, expect, test } from 'vitest';
import type { Logger } from '@aomex/logger';
import { internalDestroyServices } from '@aomex/common';
import { BaseWebRequest } from '@aomex/web';
import { TestWebApp } from '../../../web/src/testing';
import { WebsocketTransportAdapter } from '../../src';

afterEach(async () => {
  await internalDestroyServices([]);
});

class EnsureProbe extends WebsocketTransportAdapter {
  onInit(): void {}
  listen(): void {}
  onDestroy(): void {}
  ensure(req: IncomingMessage, app: TestWebApp) {
    return this['ensureRequest'](req, app);
  }
}

test('ensureReady：onInit 失败清空 readyPromise，下次可重试', async () => {
  let fail = true;
  let inits = 0;
  class FlakyProbe extends EnsureProbe {
    override async onInit(): Promise<void> {
      inits += 1;
      if (fail) throw new Error('transport-init-boom');
    }
  }
  const probe = new FlakyProbe();
  await expect(probe.ensureReady()).rejects.toThrow('transport-init-boom');
  expect(inits).toBe(1);
  expect(probe['readyPromise']).toBeUndefined();

  fail = false;
  await probe.ensureReady();
  expect(inits).toBe(2);
  await probe.ensureReady();
  expect(inits).toBe(2);
});

test('generateClientId 默认 256-bit CSPRNG base64url', () => {
  const probe = new EnsureProbe();
  const id = probe['generateClientId']({} as BaseWebRequest);
  expect(id).toMatch(/^[A-Za-z0-9_-]{43}$/);
  expect(probe['generateClientId']({} as BaseWebRequest)).not.toBe(id);
});

test('ensureRequest 对已是 BaseWebRequest 的入参只挂 app/req', () => {
  const app = new TestWebApp();
  const probe = new EnsureProbe();
  const raw = new IncomingMessage(new Socket());
  Object.setPrototypeOf(raw, BaseWebRequest.prototype);
  const base = raw as unknown as BaseWebRequest;
  const out = probe.ensure(raw, app);
  expect(out).toBe(base);
  expect(out).toBeInstanceOf(BaseWebRequest);
  expect(out.app).toBe(app);
  expect(out.req).toBe(out);
});

test('ensureRequest 提升普通 IncomingMessage 为 BaseWebRequest', () => {
  const app = new TestWebApp();
  const probe = new EnsureProbe();
  const raw = new IncomingMessage(new Socket());
  const out = probe.ensure(raw, app);
  expect(out).toBeInstanceOf(BaseWebRequest);
  expect(out.app).toBe(app);
  expect(out.req).toBe(out);
});

test('语言包加载失败时 failHandshake 直接抛出', async () => {
  const messages: string[] = [];
  class BoomLanguage extends EnsureProbe {
    protected override prepareLanguage(): Promise<never> {
      return Promise.reject(new Error('locale-missing'));
    }
  }
  const app = new TestWebApp();
  const probe = new BoomLanguage();
  probe.bindLogger({
    error(_err: unknown, message?: string) {
      messages.push(message ?? '');
    },
    warn() {},
  } as unknown as Logger);
  await expect(
    probe['failHandshake'](
      { app, path: '/ws', maxPayload: 1024, onConnection() {} },
      new IncomingMessage(new Socket()),
      new Error('verify-down'),
    ),
  ).rejects.toThrow('locale-missing');
  expect(messages).toEqual([]);
});

test('rejectIfDenied / acceptConnection 在基类收口', async () => {
  const app = new TestWebApp();
  const probe = new EnsureProbe();
  const raw = new IncomingMessage(new Socket());
  let seen: BaseWebRequest | undefined;

  await expect(
    probe['rejectIfDenied'](
      {
        app,
        path: '/ws',
        maxPayload: 1024,
        onConnection() {},
      },
      raw,
    ),
  ).resolves.toBeNull();

  await expect(
    probe['rejectIfDenied'](
      {
        app,
        path: '/ws',
        maxPayload: 1024,
        verify: (request) => {
          seen = request;
          return true;
        },
        onConnection() {},
      },
      raw,
    ),
  ).resolves.toBeNull();
  expect(seen).toBeInstanceOf(BaseWebRequest);
  expect(seen!.app).toBe(app);

  await expect(
    probe['rejectIfDenied'](
      {
        app,
        path: '/ws',
        maxPayload: 1024,
        verify: () => false,
        onConnection() {},
      },
      raw,
    ),
  ).resolves.toEqual({ statusCode: 403, message: 'Forbidden' });

  await expect(
    probe['rejectIfDenied'](
      {
        app,
        path: '/ws',
        maxPayload: 1024,
        verify: () => 401,
        onConnection() {},
      },
      raw,
    ),
  ).resolves.toMatchObject({ statusCode: 401 });

  let transportReq: BaseWebRequest | undefined;
  probe['acceptConnection'](
    {
      app,
      path: '/ws',
      maxPayload: 1024,
      onConnection(transport) {
        transportReq = transport.request;
      },
    },
    raw,
    (request) => ({
      id: '1',
      request,
      send() {},
      close() {},
      onMessage() {},
      onClose() {},
    }),
  );
  expect(transportReq).toBe(seen);
});

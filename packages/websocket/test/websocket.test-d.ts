import { expectType } from 'ts-expect';
import type { Logger } from '@aomex/logger';
import { middleware, type I18nLanguage } from '@aomex/common';
import type { BaseWebRequest } from '@aomex/web';
import { WsTransport } from '../../websocket-ws-transport/src';
import {
  Channel,
  MemoryHub,
  WebsocketApp,
  WebsocketHub,
  channels,
  type WebsocketTransport,
  type WebsocketAll,
  type WebsocketAppOptions,
  type WebsocketRoom,
  type WebsocketStats,
  type WebsocketTransportVerify,
} from '../src';
import { TestWebsocketApp } from '../src/testing';

const transport = new WsTransport({ heartbeatInterval: 0 });
declare const logger: Logger;
declare const connection: WebsocketTransport;
const language = { mode: 'fixed', language: 'zh-CN' } as const;

// WebsocketApp 配置
{
  const opts = {
    logger,
    language,
    path: '/ws',
    transport,
    mount: [channels('./src/channels')],
  } satisfies WebsocketAppOptions;
  new WebsocketApp(opts);
  new WebsocketApp({ logger, language, transport, mount: [channels([new Channel()])] });
  new WebsocketApp({
    logger,
    language,
    transport,
    hub: new MemoryHub(),
    mount: [channels([new Channel()])],
  });
  new WebsocketApp({
    logger,
    language,
    transport,
    unknownEvent: 'ignore',
    mount: [channels([new Channel()])],
  });
  new WebsocketApp({
    logger,
    language,
    transport,
    unknownEvent: 'error',
    mount: [channels([new Channel()])],
  });
  new WebsocketApp({
    logger,
    language,
    transport,
    mount: [middleware.socket(async (_ctx, next) => next()), channels([new Channel()])],
  });
  new WebsocketApp({
    logger,
    transport,
    language: { mode: 'fixed', language: 'en-US' },
    mount: [channels([new Channel()])],
  });
  new WebsocketApp({
    logger,
    transport,
    language: { mode: 'dynamic', fallback: 'zh-CN' },
    mount: [channels([new Channel()])],
  });
  new WebsocketApp({
    logger,
    transport,
    language: { mode: 'dynamic', header: 'x-language', fallback: 'en-US' },
    mount: [channels([new Channel()])],
  });
  const badLanguageMode = {
    logger,
    transport,
    // @ts-expect-error mode 只能是 fixed 或 dynamic
    language: { mode: 'auto', language: 'zh-CN' },
    mount: [channels([new Channel()])],
  } satisfies WebsocketAppOptions;
  void badLanguageMode;
  const badDynamic = {
    logger,
    transport,
    // @ts-expect-error dynamic 必须带 fallback
    language: { mode: 'dynamic' },
    mount: [channels([new Channel()])],
  } satisfies WebsocketAppOptions;
  void badDynamic;
  new WebsocketApp({
    logger,
    language,
    transport,
    mount: [channels([new Channel()])],
    onMetric: (e) => {
      if (e.type === 'online') expectType<number>(e.online);
      if (e.type === 'inbound') {
        expectType<boolean>(e.ok);
        expectType<number>(e.durationMs);
      }
      if (e.type === 'fanout') {
        expectType<'room' | 'all'>(e.scope);
        expectType<number>(e.targets);
        expectType<number>(e.failed);
        expectType<number>(e.durationMs);
        expectType<string | undefined>(e.room);
      }
      if (e.type === 'publish') {
        expectType<boolean>(e.ok);
        expectType<'room' | 'all'>(e.scope);
      }
      if (e.type === 'subscribe' || e.type === 'unsubscribe') {
        expectType<string>(e.room);
        expectType<number>(e.subscribedRooms);
      }
    },
  });
  // @ts-expect-error 缺少 language
  new WebsocketApp({ logger, transport, mount: [channels([])] });
  // @ts-expect-error 缺少 logger
  new WebsocketApp({ language, transport, mount: [channels([])] });
  // @ts-expect-error 缺少 transport
  new WebsocketApp({ logger, language, mount: [channels([])] });
  // @ts-expect-error path 类型错误
  new WebsocketApp({ logger, language, path: 1, transport, mount: [channels([])] });
  // @ts-expect-error hub 类型错误
  new WebsocketApp({ logger, language, transport, mount: [channels([])], hub: {} });
  new WebsocketApp({
    logger,
    language,
    transport,
    mount: [channels([])],
    // @ts-expect-error unknownEvent 非法取值
    unknownEvent: 'drop',
  });
  // @ts-expect-error onMetric 须为函数
  new WebsocketApp({ logger, language, transport, mount: [channels([])], onMetric: 1 });
  new WebsocketApp({
    logger,
    language,
    transport,
    // @ts-expect-error 全局 mount 不能挂 web 中间件
    mount: [middleware.web(async (_ctx, next) => next())],
  });
}

// stats() 拉式快照
{
  const app = new WebsocketApp({
    logger,
    language,
    transport,
    mount: [channels([new Channel()])],
  });
  expectType<Promise<WebsocketStats>>(app.stats());
  void app.stats().then((s) => {
    expectType<number>(s.online);
    expectType<number>(s.rooms);
    expectType<number>(s.subscribedRooms);
  });
  expectType<WebsocketAll>(app.all);
  expectType<WebsocketRoom>(app.room('order:1'));
  void app.all.send('order.updated', { id: '1' });
  void app.all.send('order.updated');
  void app.all.send('order.updated', { id: '1' }, { except: 'cid' });
  void app.all.send('order.updated', { id: '1' }, { except: { id: 'cid' } });
  void app.room('order:1').send('order.updated', { id: '1' });
  void app.room('order:1').send('dm', { text: 'hi' }, { except: { id: 'cid' } });
}

// ctx.rawPayload 始终可读
{
  const c = new Channel();
  c.on('x', {
    action: async (ctx) => {
      expectType<string>(ctx.event);
      expectType<unknown>(ctx.rawPayload);
      expectType<Logger>(ctx.logger);
      ctx.logger.info('ok');
      ctx.logger.error(new Error('x'), 'failed');
      // @ts-expect-error logger 只读，不可替换
      ctx.logger = null;
      ctx.client.id;
      ctx.client.data['userId'] = '1';
      await ctx.client.getRooms();
      expectType<BaseWebRequest>(ctx.client.request);
      expectType<I18nLanguage>(ctx.client.language);
      ctx.client.request.cookies;
      ctx.client.request.ip;
      ctx.all.send('y', undefined, { except: ctx.client });
      ctx.room('r').send('y', undefined, { except: ctx.client });
      ctx.room('r').send('y', undefined, { except: ctx.client.id });
    },
  });
}

{
  const verify: WebsocketTransportVerify = (request) => {
    expectType<BaseWebRequest>(request);
    request.cookies;
    request.query;
    request.ip;
    if (!request.cookies['sid']) return 401;
    return true;
  };
  new WebsocketApp({
    logger,
    language,
    transport,
    mount: [channels([new Channel()])],
    verify,
  });
  const deny: WebsocketTransportVerify = () => false;
  const unauthorized: WebsocketTransportVerify = () => 401;
  void deny;
  void unauthorized;
  // @ts-expect-error 不能返回对象
  const bad: WebsocketTransportVerify = () => ({ ok: false });
  void bad;
  // @ts-expect-error 不能返回成功态状态码
  const badOk: WebsocketTransportVerify = () => 200;
  void badOk;
}

// 非法事件名在类型上仍是 string；运行时再拒
{
  const c = new Channel();
  c.on('ok', { action: async () => {} });
}

// accept 的 language 必填
{
  const hub = new WebsocketHub();
  hub.accept(connection, 'zh-CN');
  // @ts-expect-error 缺少 language
  hub.accept(connection);
}

// TestWebsocketApp：logger / language 选填，transport 必填
{
  new TestWebsocketApp({ transport });
  new TestWebsocketApp({ transport, mount: [] });
  new TestWebsocketApp({ transport, mount: [channels([new Channel()])] });
  new TestWebsocketApp({
    transport,
    mount: [middleware.socket(async (_ctx, next) => next())],
  });
  new TestWebsocketApp({ transport, logger, language });
  new TestWebsocketApp({
    transport,
    language: { mode: 'fixed', language: 'en-US' },
  });
  new TestWebsocketApp({
    transport,
    language: { mode: 'dynamic', fallback: 'zh-CN' },
  });
  new TestWebsocketApp({
    transport,
    language: { mode: 'dynamic', header: 'x-language', fallback: 'en-US' },
  });
  // @ts-expect-error 缺少 transport
  new TestWebsocketApp({});
  // @ts-expect-error 缺少 transport
  new TestWebsocketApp({ logger, language });
  new TestWebsocketApp({
    transport,
    // @ts-expect-error fallback 必填
    language: { mode: 'dynamic' },
  });
  new TestWebsocketApp({
    transport,
    // @ts-expect-error mode 只能是 fixed 或 dynamic
    language: { mode: 'auto', language: 'zh-CN' },
  });
  new TestWebsocketApp({
    transport,
    // @ts-expect-error 全局 mount 不能挂 web 中间件
    mount: [middleware.web(async (_ctx, next) => next())],
  });
}

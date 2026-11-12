import { middleware } from '@aomex/common';
import { WebApp, type ServerSentEvents } from '../../src';

const app = new WebApp({
  mount: [
    middleware.web(async (ctx) => {
      ctx.sse();
      ctx.sse({});
      const sse = ctx.sse({ heartbeat: false, retry: 1000 });
      sse satisfies ServerSentEvents;

      const chained: ServerSentEvents = sse.onClose(() => {});
      chained satisfies ServerSentEvents;

      sse.send({ data: { a: 1 } });
      sse.send({ event: 'x', id: '1', retry: 2, data: 's' });
      sse.send({});
      sse.send({ data: null });
      sse.send({ data: [] });
      sse.send({ data: true });
      sse.send({ event: 'only' });

      // @ts-expect-error data 以外的未知字段
      sse.send({ foo: 1 });

      // @ts-expect-error id 应为 string
      sse.send({ id: 1 });

      // @ts-expect-error heartbeat 类型
      ctx.sse({ heartbeat: 'fast' });

      // @ts-expect-error heartbeat 不能为 true
      ctx.sse({ heartbeat: true });

      // @ts-expect-error retry 应为 number
      ctx.sse({ retry: '3000' });

      // @ts-expect-error Message.retry 应为 number
      sse.send({ retry: '1' });

      // @ts-expect-error writable 为 protected
      sse.writable;

      const fromResponse: ServerSentEvents = ctx.response.sse();
      fromResponse.onClose(() => {});

      await fromResponse.stream(async (emit, signal) => {
        emit satisfies (message: ServerSentEvents.Message) => void;
        signal satisfies AbortSignal;
        emit({ data: true });
      });

      await fromResponse.stream((emit) => {
        emit({ data: 'sync' });
      });

      const streamResult = fromResponse.stream(async () => {});
      streamResult satisfies Promise<void>;

      sse.lastEventId satisfies string | undefined;
      sse.signal satisfies AbortSignal;
      sse.close();

      // ctx.sse 与 response.sse 同签名
      const a = ctx.sse;
      const b = ctx.response.sse;
      a satisfies typeof b;
    }),
  ],
});

app satisfies WebApp;

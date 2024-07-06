import { WebApp, WebContext } from '@aomex/web';
import { ConsoleApp, ConsoleContext } from '@aomex/console';
import { traceMiddleware, type AsyncTraceRecord } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

new WebApp({
  mount: [
    traceMiddleware('', (record, ctx: WebContext) => {
      expectType<TypeEqual<AsyncTraceRecord, typeof record>>(true);
      ctx;
    }),
  ],
});

new ConsoleApp({
  mount: [
    traceMiddleware('', (record, ctx: ConsoleContext) => {
      expectType<TypeEqual<AsyncTraceRecord, typeof record>>(true);
      ctx;
    }),
  ],
});

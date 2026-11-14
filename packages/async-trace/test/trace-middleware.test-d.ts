import { WebContext } from '@aomex/web';
import { TestWebApp } from '../../web/src/testing';
import { ConsoleContext } from '@aomex/console';
import { TestConsoleApp } from '../../console/src/testing';
import { traceMiddleware, type AsyncTraceRecord } from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

new TestWebApp({
  mount: [
    traceMiddleware('', (record, ctx: WebContext) => {
      expectType<TypeEqual<AsyncTraceRecord, typeof record>>(true);
      ctx;
    }),
  ],
});

new TestConsoleApp({
  mount: [
    traceMiddleware('', (record, ctx: ConsoleContext) => {
      expectType<TypeEqual<AsyncTraceRecord, typeof record>>(true);
      ctx;
    }),
  ],
});

import { MixinMiddleware } from '@aomex/common';
import { WebContext } from '@aomex/web';
import { TestWebApp } from '../../web/src/testing';
import { ConsoleContext } from '@aomex/console';
import { TestConsoleApp } from '../../console/src/testing';
import {
  traceMiddleware,
  type AsyncTraceMiddlewareProps,
  type AsyncTraceRecord,
} from '../src';
import { expectType, type TypeEqual } from 'ts-expect';

expectType<
  TypeEqual<
    MixinMiddleware<AsyncTraceMiddlewareProps>,
    ReturnType<typeof traceMiddleware>
  >
>(true);

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

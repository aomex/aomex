import { middleware } from '@aomex/core';
import { asyncTrace, type AsyncTraceRecord } from './async-trace';

export interface AsyncTraceMiddlewareProps {
  /**
   * 链路追踪记录，仅在中间件后面的任务结束后才会生成
   */
  readonly asyncTrace?: { record: AsyncTraceRecord };
}

/**
 * 追踪中间件从开始到结束的总链路
 */
export const traceMiddleware = (
  label: string,
  callback?: (record: AsyncTraceRecord, ctx: any) => any,
) => {
  return middleware.mixin<AsyncTraceMiddlewareProps>(async (ctx, next) => {
    let traceId!: string;
    try {
      await asyncTrace.run(label, async (id) => {
        traceId = id;
        await next();
      });
    } finally {
      const record = asyncTrace.getRecord(traceId);
      ctx.asyncTrace = { record };
      await callback?.(record, ctx);
    }
  });
};

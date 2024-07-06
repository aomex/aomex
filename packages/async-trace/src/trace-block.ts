import { asyncTrace, type AsyncTraceRecord } from './async-trace';

/**
 * 追踪代码段的链路
 * ```typescript
 * const result = await traceBlock('foo', async () => {
 *   await ...
 *   return 'bar';
 * }, (record)=> {
 *   console.log(record); // { label: 'foo', delta: 123, ... }
 * });
 *
 * console.log(result); // 'bar'
 * ```
 */
export const traceBlock = async <T>(
  label: string,
  logic: () => Promise<T>,
  callback?: (record: AsyncTraceRecord) => any,
): Promise<T> => {
  let traceId!: string;
  try {
    return await asyncTrace.run<T>(label, (id) => {
      traceId = id;
      return logic();
    });
  } finally {
    await callback?.(asyncTrace.getRecord(traceId));
  }
};

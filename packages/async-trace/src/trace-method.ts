import { asyncTrace, type AsyncTraceRecord } from './async-trace';

/**
 * 追踪类的方法或静态方法的链路
 * ```typescript
 * class MyService {
 *  .@traceMethod('label')
 *   async getData() {
 *     return [];
 *   }
 * }
 * ```
 */
export const traceMethod = <T, P extends (...args: any[]) => Promise<T>>(
  label: string | ((...args: Parameters<P>) => string),
  callback?: (record: AsyncTraceRecord) => any,
) => {
  return (originalMethod: P, _context: ClassMethodDecoratorContext) => {
    return async function (this: object, ...args: Parameters<P>): Promise<any> {
      let traceId!: string;
      try {
        return await asyncTrace.run<T>(
          typeof label === 'string' ? label : label(...args),
          (id) => {
            traceId = id;
            return originalMethod.apply(this, args);
          },
        );
      } finally {
        callback?.(asyncTrace.getRecord(traceId));
      }
    };
  };
};

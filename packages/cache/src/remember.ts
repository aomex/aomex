import { traceBlock } from '@aomex/async-trace';
import { sleep, type DurationInput } from '@aomex/common';
import { SINGLE_FLIGHT_LOCK_MS, type Caching } from './caching';

export type RememberOptions<
  R extends Caching.Types | null = Caching.Types | null,
  P extends (...args: any[]) => Promise<R> = (...args: any[]) => Promise<R>,
  Q extends NonNullable<R> = NonNullable<R>,
> = {
  key?: string | ((this: any, ...args: Parameters<P>) => string);
  /** 过期时间：毫秒数或可读时长（如 `'1 day'`、`'30m'`） */
  duration: DurationInput;
  /**
   * 当数据源返回 null 或者 undefined 时，则返回默认值
   */
  defaultValue?: Q;
};

/**
 * 可调用的方法装饰器，由 `createRemember(cache)` 创建。
 * 绑定到指定 `Caching` 实例；连接由 cache 懒加载 `ensureReady` 负责。
 */
export interface Remember {
  (
    duration: DurationInput,
  ): (
    originalMethod: (...args: any[]) => Promise<any>,
    context: ClassMethodDecoratorContext,
  ) => (...args: any[]) => Promise<any>;
  <
    R extends Caching.Types | null,
    P extends (...args: any[]) => Promise<R>,
    Q extends NonNullable<R>,
  >(
    opts: RememberOptions<R, P, Q>,
  ): (originalMethod: P, context: ClassMethodDecoratorContext) => P;
}

/**
 * 创建绑定到指定 `Caching` 的 remember 装饰器。
 *
 * ```typescript
 * export const cache = new Caching(adapter);
 * export const remember = createRemember(cache);
 * ```
 */
export function createRemember(cache: Caching): Remember {
  const remember = (<
    R extends Caching.Types | null = Caching.Types | null,
    P extends (...args: any[]) => Promise<R> = (...args: any[]) => Promise<R>,
    Q extends NonNullable<R> = NonNullable<R>,
  >(
    optsOrDuration: DurationInput | RememberOptions<R, P, Q>,
  ) => {
    const opts: RememberOptions<R, P, Q> =
      typeof optsOrDuration === 'number' || typeof optsOrDuration === 'string'
        ? { duration: optsOrDuration }
        : optsOrDuration;
    const { key: getKey, duration, defaultValue = null } = opts;

    return (originalMethod: P, context: ClassMethodDecoratorContext) => {
      return async function (this: object, ...args: Parameters<P>): Promise<any> {
        const dataKey =
          getKey === undefined
            ? `${
                'displayName' in this && typeof this.displayName === 'string'
                  ? this.displayName
                  : this.constructor.name
              }-${String(context.name)}-${JSON.stringify(args)}`
            : typeof getKey === 'string'
              ? getKey
              : getKey.apply(this, args);
        const waitingKey = dataKey + ':$#_waiting_#$';

        const value = await traceBlock('Remember.get', () => cache.get<Q>(dataKey));
        if (value !== null) return value;

        const win = await cache.setNX(waitingKey, 1, SINGLE_FLIGHT_LOCK_MS);
        if (win) {
          const timer = setInterval(() => {
            cache.expire(waitingKey, SINGLE_FLIGHT_LOCK_MS);
          }, 5_000);
          try {
            const result = await traceBlock('Remember.exec', async () => {
              return originalMethod.apply(this, args);
            });
            if (result !== null) {
              await traceBlock('Remember.set', async () => {
                await cache.set(dataKey, result!, duration);
              });
            }
            return result === null ? defaultValue : result;
          } finally {
            clearInterval(timer);
            await cache.delete(waitingKey);
          }
        } else {
          return traceBlock('Remember.wait', async () => {
            while (true) {
              const waiting = await cache.exists(waitingKey);
              if (waiting) {
                await sleep(100);
                continue;
              }
              return cache.get<Q>(dataKey, defaultValue);
            }
          });
        }
      };
    };
  }) as Remember;

  return remember;
}

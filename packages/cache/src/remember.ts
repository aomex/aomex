import { traceBlock } from '@aomex/async-trace';
import { sleep } from '@aomex/common';
import type { BaseCacheService } from './base-cache-service';
import type { Caching } from './caching';

export type RememberOptions<
  R extends Caching.Types | null = Caching.Types | null,
  P extends (...args: any[]) => Promise<R> = (...args: any[]) => Promise<R>,
  Q extends NonNullable<R> = NonNullable<R>,
> = {
  key?: string | ((this: any, ...args: Parameters<P>) => string);
  duration: number;
  /**
   * 当数据源返回 null 或者 undefined 时，则返回默认值
   */
  defaultValue?: Q;
};

/**
 * 可调用的方法装饰器，并携带独立的 `BaseCacheService` 作用域。
 * `fork()` 会得到一份新的 remember（各自的 setInstance / deleteInstance 互不影响）。
 */
export interface Remember {
  (
    durationMs: number,
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
  /** 登记本作用域唯一的 `BaseCacheService`；重复传入同一实例为幂等，传入不同实例则抛错 */
  setInstance(service: BaseCacheService): void;
  /** 清除本作用域的 `BaseCacheService` 登记 */
  deleteInstance(): void;
  /** 派生一份独立作用域的 remember */
  fork(): Remember;
}

function createRemember(): Remember {
  let service: BaseCacheService | undefined;

  const remember = (<
    R extends Caching.Types | null = Caching.Types | null,
    P extends (...args: any[]) => Promise<R> = (...args: any[]) => Promise<R>,
    Q extends NonNullable<R> = NonNullable<R>,
  >(
    optsOrDurationMs: number | RememberOptions<R, P, Q>,
  ) => {
    const opts: RememberOptions<R, P, Q> =
      typeof optsOrDurationMs === 'number'
        ? { duration: optsOrDurationMs }
        : optsOrDurationMs;
    const { key: getKey, duration, defaultValue = null } = opts;

    return (originalMethod: P, context: ClassMethodDecoratorContext) => {
      return async function (this: object, ...args: Parameters<P>): Promise<any> {
        if (!service) {
          throw new Error(
            'Cache service is not registered; call remember.setInstance(service) first',
          );
        }
        const cache = service['_cache'];

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

        const value = await traceBlock('Cache.get', () => cache.get<Q>(dataKey));
        if (value !== null) return value;

        const win = await cache.setNX(waitingKey, 1, 20_000);
        if (win) {
          const timer = setInterval(() => {
            cache.expire(waitingKey, 20_000);
          }, 5_000);
          try {
            const result = await traceBlock('Cache.exec', async () => {
              return originalMethod.apply(this, args);
            });
            if (result !== null) {
              await traceBlock('Cache.set', async () => {
                await cache.set(dataKey, result!, duration);
              });
            }
            return result === null ? defaultValue : result;
          } finally {
            clearInterval(timer);
            await cache.delete(waitingKey);
          }
        } else {
          return traceBlock('Cache.wait', async () => {
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

  remember.setInstance = (next: BaseCacheService): void => {
    if (service !== undefined && service !== next) {
      throw new Error('Only one cache service is allowed');
    }
    service = next;
  };

  remember.deleteInstance = (): void => {
    service = undefined;
  };

  remember.fork = (): Remember => createRemember();

  return remember;
}

/**
 * 方法装饰器：自动获取缓存，未命中则执行原方法并写入；并发相同 key 会截流共享首个请求。
 * 每个 remember（含 `fork()` 产物）各自只允许登记一个 `BaseCacheService`。
 *
 * ```typescript
 * class CacheService extends BaseCacheService {
 *   protected createAdapter() {
 *     return redisAdapter({ host: '127.0.0.1' });
 *   }
 *
 *   protected override async onInit() {
 *     await super.onInit();
 *     remember.setInstance(this);
 *   }
 *
 *   protected override async onDestroy() {
 *     remember.deleteInstance();
 *     await super.onDestroy();
 *   }
 * }
 *
 * await combineServices(
 *   {
 *     cache: () => import('./cache.service.js'),
 *     report: () => import('./report.service.js'),
 *   },
 *   { eager: ['cache'] },
 * );
 *
 * class Report {
 *   @remember(60_000)
 *   async build() {
 *     return { ok: true };
 *   }
 * }
 *
 * // 另一套缓存作用域
 * const rememberB = remember.fork();
 * rememberB.setInstance(otherCacheService);
 * ```
 */
export const remember = createRemember();

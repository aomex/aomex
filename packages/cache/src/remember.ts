import { traceBlock } from '@aomex/async-trace';
import { sleep } from '@aomex/common';
import type { BaseCacheService } from './base-cache-service';
import type { Caching } from './caching';
import { i18n } from './i18n';

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
 * 可调用的方法装饰器，由 `createRemember(CacheService)` 创建。
 * 绑定到指定缓存服务类；实例 `onInit` 完成前调用会等待就绪，`onDestroy` 后调用会抛错。
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
}

/** 任意 `BaseCacheService` 构造函数（含基类，供内部挂载使用） */
export type CacheServiceCtor = abstract new (...args: any[]) => BaseCacheService;

/**
 * 具体缓存服务子类构造函数。传入 `BaseCacheService` 本身时类型为 `never`。
 */
export type ConcreteCacheServiceCtor<C extends CacheServiceCtor = CacheServiceCtor> =
  BaseCacheService extends InstanceType<C> ? never : C;

type CtorState = {
  cache: Caching | undefined;
  /** 已经 onDestroy，且尚未再次 onInit */
  destroyed: boolean;
  ready: PromiseWithResolvers<Caching>;
};

/** 每个服务类一份：当前 `Caching` + 未就绪时的等待 Promise */
const stateByCtor = new WeakMap<CacheServiceCtor, CtorState>();

function getState(ctor: CacheServiceCtor): CtorState {
  const existing = stateByCtor.get(ctor);
  if (existing) return existing;

  const state: CtorState = {
    cache: undefined,
    destroyed: false,
    ready: Promise.withResolvers<Caching>(),
  };
  stateByCtor.set(ctor, state);
  return state;
}

async function ensureCache(ctor: CacheServiceCtor): Promise<Caching> {
  const state = getState(ctor);
  if (state.destroyed) {
    throw new Error(i18n.t('cache_service_destroyed'));
  }
  if (state.cache) return state.cache;

  await state.ready.promise;
  // attach resolve 与 await 恢复之间可能已经 onDestroy
  if (state.destroyed || !state.cache) {
    throw new Error(i18n.t('cache_service_destroyed'));
  }
  return state.cache;
}

/** 供 `BaseCacheService.onInit` 挂载；包外请勿直接调用 */
export function attachRememberScopes(service: BaseCacheService): void {
  const ctor = service.constructor as CacheServiceCtor;
  const cache = service['_cache'];
  const state = getState(ctor);
  state.destroyed = false;
  state.cache = cache;
  state.ready.resolve(cache);
}

/** 供 `BaseCacheService.onDestroy` / `onInit` 失败时卸载；包外请勿直接调用 */
export function detachRememberScopes(service: BaseCacheService): void {
  const ctor = service.constructor as CacheServiceCtor;
  const state = stateByCtor.get(ctor);
  if (!state) return;
  // 已有其它实例挂载时，非当前挂载者不处理；尚未 attach（如 connect 失败）时仍要 reject 等待者
  if (state.cache !== undefined && state.cache !== service['_cache']) return;
  // 先标 destroyed，避免并发 ensureCache 在清 cache 后误走已 settle 的 ready
  state.destroyed = true;
  state.cache = undefined;
  state.ready.reject(new Error(i18n.t('cache_service_destroyed')));
}

/**
 * 创建绑定到指定 `BaseCacheService` 子类的 remember 装饰器。
 * 必须传入具体子类，不能传入 `BaseCacheService` 本身。
 *
 * ```typescript
 * export const remember = createRemember(CacheService);
 * ```
 */
export function createRemember<C extends CacheServiceCtor>(
  ctor: ConcreteCacheServiceCtor<C>,
): Remember {
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
        const cache = await ensureCache(ctor);

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

  return remember;
}

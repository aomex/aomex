import { i18n } from './i18n';
import type { Middleware } from './middleware';

export type Next = () => Promise<any>;
export type ComposeFn = (ctx: any, next?: Next) => Promise<void>;
const noop = (): any => {};

/**
 * 组合中间件
 */
export const compose = (middlewareList: Middleware[]): ComposeFn => {
  const total = middlewareList.length;
  const fns = middlewareList.map((md) => md['fn']);

  return (ctx, next) => {
    let lastIndex = -1;
    const dispatch = async (i: number): Promise<void> => {
      if (i <= lastIndex) {
        throw new Error(i18n.t('middleware.call_next_multiple'));
      }
      const finished = (lastIndex = i) === total;
      const fn = finished ? next : fns[lastIndex];
      if (fn) {
        await fn(ctx, finished ? noop : dispatch.bind(null, i + 1));
      }
    };
    return dispatch(0);
  };
};

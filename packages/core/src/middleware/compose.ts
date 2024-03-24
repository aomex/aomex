import type { Middleware } from './middleware';

export type Next = () => Promise<any>;
export type ComposeFn = (ctx: any, next?: Next) => Promise<void>;

/**
 * 组合中间件
 */
export const compose = (middlewareList: Middleware[]): ComposeFn => {
  return (ctx, next) => {
    let lastIndex = -1;
    const dispatch = async (i: number): Promise<void> => {
      if (i <= lastIndex) {
        throw new Error('多次执行中间件next()函数');
      }
      const fn = i === middlewareList.length ? next : middlewareList[i]!['fn'];
      lastIndex = i;
      await fn?.(ctx, dispatch.bind(null, i + 1));
    };

    return dispatch(0);
  };
};

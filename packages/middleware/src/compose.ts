import { Chain, MiddleWareToken } from './chain';

export type Next = () => Promise<any>;
export type Compose = (ctx: any, next?: Next) => Promise<any>;

/**
 * Compose middleware and chains
 */
export const compose = (tokens: MiddleWareToken[]): Compose => {
  const middlewareList = Chain.flatten(tokens);

  return (ctx, next): Promise<any> => {
    let lastIndex = -1;
    const dispatch = async (i: number): Promise<any> => {
      if (i <= lastIndex) {
        throw new Error('call next() multiple times');
      }
      const fn = i === middlewareList.length ? next : middlewareList[i]!.fn;
      lastIndex = i;
      return fn?.(ctx, dispatch.bind(null, i + 1));
    };

    return dispatch(0);
  };
};

import type { MiddleWareToken } from './middleware-chain';
import type { Middleware } from './middleware';

/**
 * 拍平中间件和链条，并返回中间件列表
 */
export const flattenMiddlewareToken = (
  tokens?: MiddleWareToken | null | Array<MiddleWareToken | null>,
): Middleware[] => {
  if (Array.isArray(tokens)) {
    return tokens.reduce(
      (carry, item) => carry.concat(flattenMiddlewareToken(item)),
      <Middleware[]>[],
    );
  }

  return tokens == null
    ? []
    : 'middlewareList' in tokens
      ? tokens['middlewareList'].slice()
      : [tokens];
};

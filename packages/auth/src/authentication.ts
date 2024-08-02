import type { WebMiddleware } from '@aomex/web';
import type { AuthenticationAdapter } from './authentication-adapter';
import { middleware } from '@aomex/core';

const DEFAULT_KEY = 'auth';

/**
 * 授权认证中间件
 * @param adapter 授权具体实现方案
 * @param authKey 授权成功后挂载到ctx上的属性名称，默认值：`auth`
 */
export const authentication = <
  Payload extends object | string,
  Key extends string = typeof DEFAULT_KEY,
>(
  adapter: AuthenticationAdapter<Payload>,
  authKey?: Key,
): WebMiddleware<{ readonly [K in Key]: Payload }> => {
  return middleware.web({
    fn: async (ctx, next) => {
      let payload: Payload | false = false;

      try {
        payload = await adapter['authenticate'](ctx);
      } catch (e) {
        return void ctx.throw(401, e as Error);
      }

      if (payload === false) return void ctx.throw(401);

      Object.defineProperty(ctx, authKey || DEFAULT_KEY, {
        get: () => payload,
      });
      return next();
    },
    openapi: adapter['openapi'](),
  });
};

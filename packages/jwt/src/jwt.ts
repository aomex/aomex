import {
  JwtHeader,
  JwtPayload,
  verify,
  VerifyOptions,
  Jwt,
} from 'jsonwebtoken';
import { toArray } from '@aomex/helper';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { getSecret } from './getSecret';
import { resolveAuthorizationHeader, resolveCookies } from './resolvers';
import { middleware } from '@aomex/core';

export interface JWTOptions extends Omit<VerifyOptions, 'complete'> {
  secret: JWTSecret | JWTSecretLoader;
  getToken?: JWTResolverLoader;
  isRevoked?(
    ctx: WebContext,
    decodedToken: string | Jwt | JwtPayload,
    token: string,
  ): Promise<boolean>;
  cookie?: string;
}

export type JWTResolverLoader = (
  ctx: WebContext,
  opts: JWTOptions,
) => string | null | undefined;
export type JWTSecret = string | string[] | Buffer | Buffer[];
export type JWTSecretLoader = (
  header: JwtHeader,
  payload: string | JwtPayload,
) => Promise<JWTSecret>;

export const jwt = <UserType = object>(
  options: JWTOptions,
): WebMiddleware<{
  readonly jwt: {
    user: UserType;
    token: string;
  };
}> => {
  // TODO: debug属性应该给在主库设置
  const { getToken, isRevoked } = options;
  const tokenResolvers = [resolveCookies, resolveAuthorizationHeader];

  getToken && tokenResolvers.unshift(getToken);

  return middleware.web(async (ctx, next) => {
    let token: string | null | undefined;
    for (const resolver of tokenResolvers) {
      if ((token = resolver(ctx, options))) break;
    }

    if (!token) {
      ctx.throw(
        401,
        ctx.app.debug ? 'Token not found' : 'Authentication Error',
      );
      return;
    }

    let { secret } = options;

    try {
      if (typeof secret === 'function') {
        secret = await getSecret(secret, token);
      }

      let secrets = toArray(secret);
      if (!secret || !secrets.length) {
        ctx.throw(500, 'Secret not provided');
      }

      let decodedToken: string | Jwt | JwtPayload | undefined;

      if (secrets.length === 1) {
        decodedToken = verify(token!, secrets[0]!, options);
      } else {
        decodedToken = await Promise.any(
          secrets.map((s) => {
            // verify会立即报错，加上 try/catch 才能保证map持续处理
            try {
              return verify(token!, s, options);
            } catch {
              return Promise.reject();
            }
          }),
        ).catch(() => {
          return Promise.reject('invalid signature');
        });
      }

      if (isRevoked) {
        const tokenRevoked = await isRevoked(ctx, decodedToken!, token);
        if (tokenRevoked) {
          ctx.throw(400, 'Token revoked');
        }
      }

      ctx.jwt = {
        // @ts-ignore
        user: decodedToken!,
        token: token,
      };
    } catch (e) {
      const msg = ctx.app.debug
        ? e instanceof Error
          ? e.message
          : String(e)
        : 'Authentication Error';
      ctx.throw(401, msg, { originalError: e });
    }

    return next();
  });
};

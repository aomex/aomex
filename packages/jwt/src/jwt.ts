import type { JwtHeader, JwtPayload, VerifyOptions, Jwt } from 'jsonwebtoken';
import jsonWebToken from 'jsonwebtoken'; // jsonwebtoken is CommonJS
import { toArray } from '@aomex/utility';
import { WebContext, WebMiddleware, WebMiddlewareToDocument } from '@aomex/web';
import { getSecret } from './getSecret';
import { resolveAuthorizationHeader, resolveCookies } from './resolvers';

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

export class JsonWebTokenMiddleware<
  Props extends object = object,
> extends WebMiddleware<Props> {
  public override toDocument({
    document,
    methodItem,
  }: WebMiddlewareToDocument): void {
    document.components ||= {};
    document.components.securitySchemes ||= {};
    document.components.securitySchemes['jwt'] ||= {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    };

    if (methodItem) {
      methodItem.security ||= [{ jwt: [] }];
    }
  }
}

export const jwt = <UserSchema = object>(
  options: JWTOptions,
): JsonWebTokenMiddleware<{
  readonly jwt: {
    user: UserSchema;
    token: string;
  };
}> => {
  const { getToken, isRevoked } = options;
  const tokenResolvers = [resolveCookies, resolveAuthorizationHeader];

  getToken && tokenResolvers.unshift(getToken);

  return new JsonWebTokenMiddleware(async (ctx, next) => {
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

      const secrets = toArray(secret);
      if (!secret || !secrets.length) {
        ctx.throw(500, 'Secret not provided');
      }

      let decodedToken: string | Jwt | JwtPayload | undefined;

      if (secrets.length === 1) {
        decodedToken = jsonWebToken.verify(token!, secrets[0]!, options);
      } else {
        decodedToken = await Promise.any(
          secrets.map((s) => {
            // verify will sync throw exception
            try {
              return jsonWebToken.verify(token!, s, options);
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

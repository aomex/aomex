import jsonWebToken, {
  type VerifyOptions,
  type Secret,
  type SignOptions,
} from 'jsonwebtoken'; // CommonJS
import { toArray } from '@aomex/internal-tools';
import { statuses, WebContext } from '@aomex/web';
import { tokenFromHeader, tokenFromCookie, tokenFromQueryString } from './loaders';
import { i18n, middleware } from '@aomex/core';

type SecretProvider =
  | {
      /**
       * 密码，用于生成令牌和验证令牌
       */
      secret: Secret;
    }
  | {
      /**
       * 公钥，用于验证令牌
       */
      publicKey: Secret;
      /**
       * 密钥，用于生成令牌
       */
      privateKey: Secret;
    };

export type JWTOptions<UserSchema extends string | object = object> = SecretProvider & {
  /**
   * 自定义获取令牌的逻辑。
   *
   * 优先从自定义渠道获取令牌，如果获取失败，则继续从内置的渠道获取。内置获取渠道分别是：
   * - header，格式：Authorization: Bearer xxxxxx
   * - cookie，需指定cookie名称
   * - querystring，需指定参数名称
   */
  tokenLoader?: TokenLoader | TokenLoader[];
  /**
   * 允许令牌从cookie中的某个key获取
   */
  tokenFromCookie?: string;
  /**
   * 允许令牌从查询字符串的某个key获取
   */
  tokenFromQueryString?: string;
  verifyOptions?: Omit<VerifyOptions, 'complete'>;
  /**
   * 检测token是否已经被销毁
   */
  isRevoked?(ctx: WebContext, decodedToken: UserSchema, token: string): Promise<boolean>;

  /**
   * 更换密码或者密钥后，为了能验证旧的JWT令牌，请提供旧的密码或者公钥
   */
  legacySecretOrPublicKey?: Secret[];
};

export type TokenLoader = (
  ctx: WebContext,
  opts: JWTOptions<any>,
) => string | null | undefined | Promise<string | null | undefined>;

export class JWT<UserSchema extends string | object = object> {
  protected readonly tokenLoaders: TokenLoader[];

  constructor(protected readonly options: JWTOptions<UserSchema>) {
    const { tokenLoader } = options;
    this.tokenLoaders = [tokenFromHeader, tokenFromCookie, tokenFromQueryString];
    tokenLoader && this.tokenLoaders.unshift(...toArray(tokenLoader));
  }

  get middleware() {
    const { legacySecretOrPublicKey = [] } = this.options;

    return middleware.web<{
      readonly jwt: { user: UserSchema; token: string };
    }>({
      fn: async (ctx, next) => {
        let token: string | null | undefined;
        for (const loader of this.tokenLoaders) {
          if ((token = await loader(ctx, this.options))) break;
        }

        if (!token) {
          ctx.throw(401);
          return;
        }

        const secrets: Secret[] =
          'secret' in this.options ? [this.options.secret] : [this.options.publicKey];
        secrets.push(...legacySecretOrPublicKey);

        let payload: UserSchema | undefined;
        for (const secret of secrets) {
          try {
            payload = jsonWebToken.verify(
              token,
              secret,
              this.options.verifyOptions,
            ) as any;
          } catch {
            // no catch
          }
        }

        if (!payload) {
          ctx.throw(401);
          return;
        }

        if (await this.options.isRevoked?.(ctx, payload, token)) {
          ctx.throw(401, i18n.t('jwt.revoked'));
        }
        ctx.jwt = { user: payload, token };

        return next();
      },
      openapi: {
        onDocument(document) {
          document.components ||= {};
          document.components.securitySchemes ||= {};
          document.components.securitySchemes['jwt'] ||= {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          };
        },
        onMethod(methodItem) {
          methodItem.security ||= [];
          methodItem.security.push({ jwt: [] });
        },
        postMethod(methodItem) {
          const statusCode = 401;
          methodItem.responses[statusCode] ||= {
            description: statuses.message[statusCode]!,
          };
        },
      },
    });
  }

  sign(payload: UserSchema, opts?: SignOptions): string {
    return jsonWebToken.sign(
      payload,
      'secret' in this.options ? this.options.secret : this.options.privateKey,
      opts,
    );
  }
}

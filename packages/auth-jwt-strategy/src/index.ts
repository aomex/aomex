import jsonWebToken, {
  type VerifyOptions,
  type Secret,
  type SignOptions,
} from 'jsonwebtoken'; // CommonJS
import { WebContext, type OpenApiInjector } from '@aomex/web';
import { BaseBearerStrategy, type TokenLoaderItem } from '@aomex/auth-bearer-strategy';
import type { AuthError } from '@aomex/auth';

export namespace JwtStrategy {
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

  export type Options<
    Payload extends string | object,
    VerifiedPayload,
    AuthorizeArgs extends any[],
  > = SecretProvider & {
    /**
     * 按从左到右的顺序获取token。默认：`[{ type: 'header', key: 'authorization' }]`
     */
    tokenLoaders?: TokenLoaderItem[];
    /**
     * 验证令牌时的额外参数。需要和生成令牌时保持一致
     */
    verifyOptions?: Omit<VerifyOptions, 'complete'>;
    /**
     * JWT解析成功后的回调。如果token或者payload无效，则返回`false`
     */
    onVerified(
      payload: Payload,
      ctx: WebContext,
      token: string,
    ): VerifiedPayload | AuthError | false | Promise<VerifiedPayload | AuthError | false>;
    /**
     * 更换密码或者密钥后，为了能验证旧的JWT令牌，请提供旧的密码或者公钥
     */
    legacySecretOrPublicKey?: Secret[];
  } & ({
      /**
       * 身份认证后的权限判断，如果权限不足，则返回`false`，系统会自动响应`403`状态码
       *
       * 有两种方式可以获得认证的身份数据
       * ```
       * {
       *   onLoaded(token) {
       *     return { userId: 1, role: 1 };
       *   },
       *   // 方式一：
       *   onAuthorize(role: number) {
       *     const identity = this.getIdentity();
       *     return identity.role === role;
       *   },
       *   // 方式二：
       *   onAuthorize: (role: number) => (identity) => {
       *     return identity.role === role;
       *   }
       * }
       * ```
       */
      onAuthorize?: (
        ...args: AuthorizeArgs
      ) =>
        | boolean
        | AuthError
        | Promise<boolean>
        | ((data: VerifiedPayload) => boolean | AuthError | Promise<boolean | AuthError>);
    } & ThisType<{ getIdentity: () => VerifiedPayload }>);
}

/**
 * JWT 认证策略
 *
 * 注意：请在这里onVerified形参中指定payload类型。
 */
export class JwtStrategy<
  Payload extends object | string,
  VerifiedPayload extends object | string | number,
  AuthorizeArgs extends any[],
> extends BaseBearerStrategy<VerifiedPayload, AuthorizeArgs> {
  constructor(
    protected readonly opts: JwtStrategy.Options<Payload, VerifiedPayload, AuthorizeArgs>,
  ) {
    super(opts.tokenLoaders);
  }

  /**
   * 生成签名，已自动包含了密码或者密钥
   */
  signature(payload: Payload, opts?: SignOptions): string {
    return jsonWebToken.sign(
      payload,
      'secret' in this.opts ? this.opts.secret : this.opts.privateKey,
      opts,
    );
  }

  protected override async authenticate(ctx: WebContext) {
    const token = this.loadToken(ctx);
    if (!token) return false;

    const { legacySecretOrPublicKey = [], onVerified } = this.opts;
    const secrets: Secret[] =
      'secret' in this.opts ? [this.opts.secret] : [this.opts.publicKey];
    secrets.push(...legacySecretOrPublicKey);
    let payload: Payload | undefined;
    for (const secret of secrets) {
      try {
        payload = jsonWebToken.verify(token, secret, this.opts.verifyOptions) as any;
      } catch {
        // no catch
      }
    }

    if (!payload) return false;

    return onVerified
      ? onVerified(payload, ctx, token)
      : (payload as unknown as VerifiedPayload);
  }

  protected override authorize(payload: VerifiedPayload, ...args: AuthorizeArgs) {
    if (!this.opts.onAuthorize) return false;
    const result = this.opts.onAuthorize.call({ getIdentity: () => payload }, ...args);
    if (typeof result === 'function') {
      return result(payload);
    }
    return result;
  }

  protected override openapi(): OpenApiInjector {
    return {
      ...super.openapi(),
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
    };
  }
}

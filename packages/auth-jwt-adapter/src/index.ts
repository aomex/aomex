import jsonWebToken, {
  type VerifyOptions,
  type Secret,
  type SignOptions,
} from 'jsonwebtoken'; // CommonJS
import { WebContext, type OpenApiInjector } from '@aomex/web';
import {
  AuthenticationBaseBearerAdapter,
  type BearerAdapterOptions,
} from '@aomex/auth-bearer-adapter';

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

export type JwtAdapterOptions<
  Payload extends string | object,
  VerifiedPayload = Payload,
> = SecretProvider &
  Pick<BearerAdapterOptions<Payload>, 'tokenLoaders'> & {
    /**
     * 验证令牌时的额外参数。需要和生成令牌时保持一致
     */
    verifyOptions?: Omit<VerifyOptions, 'complete'>;
    /**
     * 验证成功后的回调，对payload做额外处理。如果token或者payload无效，则返回`false`
     */
    onVerified?(data: {
      payload: Payload;
      ctx: WebContext;
      token: string;
    }): Promise<VerifiedPayload | false>;
    /**
     * 更换密码或者密钥后，为了能验证旧的JWT令牌，请提供旧的密码或者公钥
     */
    legacySecretOrPublicKey?: Secret[];
  };

export class AuthenticationJwtAdapter<
  Payload extends object | string,
  VerifiedPayload extends object | string = Payload,
> extends AuthenticationBaseBearerAdapter<VerifiedPayload> {
  constructor(protected readonly opts: JwtAdapterOptions<Payload, VerifiedPayload>) {
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

  protected override async authenticate(
    ctx: WebContext,
  ): Promise<VerifiedPayload | false> {
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
      ? onVerified({ payload, ctx, token })
      : (payload as unknown as VerifiedPayload);
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

export const jwtAdapter = <
  Payload extends object | string,
  VerifiedPayload extends object | string = Payload,
>(
  opts: JwtAdapterOptions<Payload, VerifiedPayload>,
) => new AuthenticationJwtAdapter<Payload, VerifiedPayload>(opts);

import { createHash, randomBytes } from 'node:crypto';
import { CacheAdapter, Caching } from '@aomex/cache';
import { parseDuration, registerLifecycle, type DurationInput } from '@aomex/common';
import type { WebContext } from '@aomex/web';
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from 'jose';
import { validate as validateOidcTokenHash } from 'oidc-token-hash';
import { i18n } from './i18n';

/** state 允许的字符集（与 `base64url` 一致） */
const STATE_PATTERN = /^[A-Za-z0-9_-]+$/;

/** 出站 HTTP（换票 / 刷新 / 吊销 / discovery）超时 */
const FETCH_TIMEOUT_MS = 30_000;

/** id_token 验签允许的算法（仅非对称，拒绝 none / HS*） */
const ID_TOKEN_ALGORITHMS = [
  'RS256',
  'RS384',
  'RS512',
  'ES256',
  'ES384',
  'ES512',
  'PS256',
  'PS384',
  'PS512',
  'EdDSA',
] as const;

type StatePayload = {
  verifier: string;
  nonce?: string;
};

type OidcMetadata = {
  issuer: string;
  authorization_endpoint: string;
  token_endpoint: string;
  jwks_uri: string;
  revocation_endpoint?: string;
};

export namespace OAuth2Client {
  /**
   * 令牌端点成功响应的常见字段。
   */
  export type TokenSet = {
    access_token: string;
    /** 已规范为小写，仅 `bearer` / `dpop` */
    token_type: 'bearer' | 'dpop';
    expires_in?: number;
    refresh_token?: string;
    scope?: string;
    id_token?: string;
  };

  /**
   * 标准 id_token 声明。可通过类第二泛型扩展（如 Google 的 `hd`）。
   */
  export type IdTokenClaims = {
    readonly iss: string;
    readonly sub: string;
    readonly aud: string | readonly string[];
    readonly exp: number;
    readonly iat: number;
    readonly nonce?: string;
    /**
     * Access Token 绑定哈希（OIDC Core 3.1.3.6）；存在时会与本次 access_token 校验
     */
    readonly at_hash?: string;
    /**
     * 授权方；`aud` 为多值时必须存在且等于 `client_id`
     */
    readonly azp?: string;
    readonly auth_time?: number;
    readonly email?: string;
    /**
     * 多数 IdP 为布尔；Apple 也可能返回 `"true"` / `"false"` 字符串
     */
    readonly email_verified?: boolean | 'true' | 'false';
    readonly name?: string;
    readonly preferred_username?: string;
    readonly picture?: string;
  };

  export type OidcConfig = {
    /**
     * Issuer，如 `https://accounts.google.com`。
     * 会请求 `{issuer}/.well-known/openid-configuration` 补齐端点与 `jwks_uri`。
     */
    issuer: string;
    /**
     * 覆盖 discovery 得到的 `jwks_uri`
     */
    jwksUri?: string;
    /**
     * 期望的 `id_token.iss`。默认：`issuer`（去掉末尾 `/` 后与声明比较前由 jose 按配置校验）
     */
    expectedIssuer?: string;
  };

  /**
   * 客户端密钥：静态字符串，或按需生成（如 Apple 的 JWT `client_secret`）
   */
  export type ClientSecret = string | (() => string | Promise<string>);

  type CommonOptions = {
    clientId: string;
    clientSecret: ClientSecret;
    /**
     * 回调地址。可为固定字符串，或按请求动态生成
     */
    redirectUri: string | ((ctx: WebContext) => string);
    /**
     * 授权范围。启用 `oidc` 时若未包含 `openid` 会自动补上
     */
    scopes?: readonly string[];
    /**
     * 存放 state、PKCE verifier（及 OIDC nonce）。
     * 首次读写 state 时经 `registerLifecycle` 调用 `connect`，关停时 `disconnect`
     */
    store: CacheAdapter;
    /**
     * state 缓存有效期。默认：`10 minutes`
     */
    stateTtl?: DurationInput;
    /**
     * 是否启用 PKCE（S256）。默认：`true`
     */
    pkce?: boolean;
    /**
     * 换票 / 刷新 / 吊销时的客户端认证方式。默认：`body`
     */
    tokenAuth?: 'body' | 'basic';
    /**
     * 令牌吊销端点。
     * 纯 OAuth2 需手写；OIDC 未配置时尝试从 discovery 的 `revocation_endpoint` 读取
     * @see https://datatracker.ietf.org/doc/html/rfc7009
     */
    revocationEndpoint?: string;
    /**
     * 附加到授权 URL 的查询参数（不会覆盖必要字段）
     */
    authorizationParams?: Record<string, string>;
  };

  export type RefreshOptions = {
    /**
     * 请求的 scope（空格分隔字符串，或字符串数组）。
     * 不传则请求体不带 `scope`，由授权服务器按该 refresh_token 原有范围签发；
     * 传入时只能等于或小于原范围，不能扩大。
     * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
     */
    scope?: string | readonly string[];
  };

  export type RevokeOptions = {
    tokenTypeHint?: 'access_token' | 'refresh_token';
  };

  /** 纯 OAuth2 的 `onProfile` 入参 */
  export type OAuth2OnProfileArgs = {
    token: TokenSet;
    ctx: WebContext;
  };

  /** 启用 OIDC 时的 `onProfile` 入参 */
  export type OidcOnProfileArgs<Claims extends IdTokenClaims = IdTokenClaims> = {
    token: TokenSet;
    oidc: { readonly claims: Claims };
    ctx: WebContext;
  };

  /**
   * 纯 OAuth2：必须手写 authorize / token 端点；`onProfile` 无 `oidc`
   */
  export type OAuth2OnlyOptions<Profile> = CommonOptions & {
    authorizationEndpoint: string;
    tokenEndpoint: string;
    oidc?: undefined;
    onProfile: (args: OAuth2OnProfileArgs) => Profile | Promise<Profile>;
  };

  /**
   * 启用 OIDC 且自定义 `onProfile`
   */
  export type OidcWithOnProfileOptions<
    Profile,
    Claims extends IdTokenClaims = IdTokenClaims,
  > = CommonOptions & {
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    oidc: OidcConfig;
    onProfile: (args: OidcOnProfileArgs<Claims>) => Profile | Promise<Profile>;
  };

  /**
   * 启用 OIDC 且省略 `onProfile`：`callback` 直接返回已验签的 claims
   */
  export type OidcWithoutOnProfileOptions = CommonOptions & {
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
    oidc: OidcConfig;
    onProfile?: undefined;
  };

  /**
   * 启用 OIDC：可只配 `oidc.issuer`（discovery 补齐端点）。
   * `onProfile` 可选；省略时 `callback` 直接返回已验签的 claims。
   */
  export type OidcEnabledOptions<
    Profile = IdTokenClaims,
    Claims extends IdTokenClaims = IdTokenClaims,
  > = OidcWithOnProfileOptions<Profile, Claims> | OidcWithoutOnProfileOptions;

  export type Options<Profile, Claims extends IdTokenClaims = IdTokenClaims> =
    | OAuth2OnlyOptions<Profile>
    | OidcWithOnProfileOptions<Profile, Claims>
    | OidcWithoutOnProfileOptions;
}

/**
 * OAuth 2.0 授权码客户端（默认 PKCE S256）。
 * 配置 `oidc` 时按 OpenID Connect 校验 `id_token`（nonce + JWKS）。
 */
export class OAuth2Client<
  Profile = OAuth2Client.IdTokenClaims,
  Claims extends OAuth2Client.IdTokenClaims = OAuth2Client.IdTokenClaims,
> {
  protected readonly caching: Caching;
  protected readonly stateTtlMs: number;
  protected readonly pkce: boolean;
  protected readonly tokenAuth: 'body' | 'basic';
  protected metadata: OidcMetadata | null = null;
  protected jwks: ReturnType<typeof createRemoteJWKSet> | null = null;
  protected readyPromise: Promise<void> | undefined;

  /** OIDC 且省略 `onProfile`：`callback` 返回已验签 claims（`Profile` 默认为 `IdTokenClaims`） */
  constructor(opts: OAuth2Client.OidcWithoutOnProfileOptions);
  constructor(opts: OAuth2Client.OidcWithOnProfileOptions<Profile, Claims>);
  constructor(opts: OAuth2Client.OAuth2OnlyOptions<Profile>);
  constructor(protected readonly opts: OAuth2Client.Options<Profile, Claims>) {
    if (!opts.clientId) {
      throw new Error(i18n.t('client_id_empty'));
    }
    if (typeof opts.clientSecret === 'string' && !opts.clientSecret) {
      throw new Error(i18n.t('client_secret_empty'));
    }
    if (typeof opts.redirectUri === 'string' && !opts.redirectUri) {
      throw new Error(i18n.t('redirect_uri_empty'));
    }
    const ttl = parseDuration(opts.stateTtl ?? '10 minutes');
    if (ttl === 0) {
      throw new Error(i18n.t('state_ttl_invalid'));
    }

    if (opts.oidc) {
      if (!opts.oidc.issuer) {
        throw new Error(i18n.t('oidc_issuer_empty'));
      }
    } else {
      if (!opts.authorizationEndpoint) {
        throw new Error(i18n.t('authorization_endpoint_empty'));
      }
      if (!opts.tokenEndpoint) {
        throw new Error(i18n.t('token_endpoint_empty'));
      }
    }

    this.caching = new Caching(opts.store);
    this.stateTtlMs = ttl;
    this.pkce = opts.pkce !== false;
    this.tokenAuth = opts.tokenAuth ?? 'body';
  }

  /**
   * 确保 store 已 `connect`（可重入）。首次读写 state 时登记生命周期。
   */
  protected ensureReady(): Promise<void> {
    this.readyPromise ??= registerLifecycle({
      onInit: () => this.opts.store.connect(),
      onDestroy: () => this.opts.store.disconnect(),
    });
    return this.readyPromise;
  }

  /**
   * 写入 state（及 PKCE verifier / OIDC nonce）后返回授权 URL，不发送响应
   */
  async getAuthorizationUrl(ctx: WebContext): Promise<string> {
    await this.ensureReady();
    const { authorizationEndpoint } = await this.resolveEndpoints();
    const state = this.randomToken();
    const verifier = this.pkce ? this.randomToken() : '';
    const nonce = this.opts.oidc ? this.randomToken() : undefined;

    await this.caching.set(
      this.stateKey(state),
      { verifier, nonce } satisfies StatePayload,
      this.stateTtlMs,
    );

    const redirectUri = this.resolveRedirectUri(ctx);
    const url = new URL(authorizationEndpoint);

    for (const [key, value] of Object.entries(this.opts.authorizationParams ?? {})) {
      url.searchParams.set(key, value);
    }

    url.searchParams.set('response_type', 'code');
    url.searchParams.set('client_id', this.opts.clientId);
    url.searchParams.set('redirect_uri', redirectUri);
    url.searchParams.set('state', state);

    const scopes = this.resolveScopes();
    if (scopes?.length) {
      url.searchParams.set('scope', scopes.join(' '));
    }

    if (nonce) {
      url.searchParams.set('nonce', nonce);
    }

    if (this.pkce) {
      const challenge = createHash('sha256').update(verifier).digest('base64url');
      url.searchParams.set('code_challenge', challenge);
      url.searchParams.set('code_challenge_method', 'S256');
    }

    return url.toString();
  }

  /**
   * 302 跳转到授权服务器
   */
  async redirect(ctx: WebContext): Promise<void> {
    const url = await this.getAuthorizationUrl(ctx);
    ctx.redirect(url);
  }

  /**
   * 校验 state → 用 code 换 token →（OIDC 则验 id_token）→ `onProfile`。
   *
   * OIDC 且未配置 `onProfile` 时，直接返回已验签的 claims。
   * state 在换票前原子消费且不可恢复：并发 callback 仅一方成功；换票失败需重新授权。
   * 授权服务器返回 `error`（如用户取消）时校验并清除 state 后抛出。
   */
  async callback(ctx: WebContext): Promise<Profile> {
    const {
      code,
      state,
      error: oauthError,
      iss,
      id_token: callbackIdToken,
      token: callbackToken,
    } = this.readCallbackInput(ctx);

    if (typeof state !== 'string' || !this.isValidState(state)) {
      throw new Error(i18n.t('missing_code_or_state'));
    }

    // 仅支持授权码流；回调带 id_token/token 视为隐式/混合流
    if (callbackIdToken !== undefined || callbackToken !== undefined) {
      await this.consumeState(state);
      throw new Error(i18n.t('callback_unsupported_response'));
    }

    // RFC 9207：若回调带 iss，须与配置的 Issuer 一致（仅 OIDC 场景可校验）
    if (typeof iss === 'string' && iss) {
      try {
        await this.assertCallbackIssuer(iss);
      } catch (err) {
        await this.consumeState(state);
        throw err;
      }
    }

    // RFC 6749 §4.1.2.1：错误回调带 error（及 state），通常无 code
    if (typeof oauthError === 'string' && oauthError) {
      if (!this.isValidOAuthErrorCode(oauthError)) {
        throw new Error(i18n.t('missing_code_or_state'));
      }
      await this.consumeState(state);
      throw new Error(i18n.t('authorization_denied', { error: oauthError }));
    }

    if (typeof code !== 'string' || !code) {
      throw new Error(i18n.t('missing_code_or_state'));
    }

    const saved = await this.consumeState(state);
    const token = await this.exchangeCode(code, saved.verifier, ctx);

    if (this.opts.oidc) {
      if (!token.id_token) {
        throw new Error(i18n.t('oidc_missing_id_token'));
      }
      if (!saved.nonce) {
        throw new Error(i18n.t('invalid_state'));
      }
      const claims = await this.verifyIdToken(
        token.id_token,
        saved.nonce,
        token.access_token,
      );
      if (this.opts.onProfile) {
        return this.opts.onProfile({ token, oidc: { claims }, ctx });
      }
      return claims as unknown as Profile;
    }

    return this.opts.onProfile({ token, ctx });
  }

  /**
   * 用 refresh_token 换取新的令牌集
   * @see https://datatracker.ietf.org/doc/html/rfc6749#section-6
   */
  async refresh(
    refreshToken: string,
    options?: OAuth2Client.RefreshOptions,
  ): Promise<OAuth2Client.TokenSet> {
    if (!refreshToken) {
      throw new Error(i18n.t('refresh_token_empty'));
    }

    const { tokenEndpoint } = await this.resolveEndpoints();
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    const scope = this.formatScope(options?.scope);
    if (scope) {
      body.set('scope', scope);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    await this.applyClientAuth(body, headers);

    const res = await this.fetchOutbound(
      tokenEndpoint,
      {
        method: 'POST',
        headers,
        body,
      },
      'token_refresh_failed',
    );

    return this.parseTokenResponse(res, 'token_refresh_failed');
  }

  /**
   * 吊销 access_token 或 refresh_token
   * @see https://datatracker.ietf.org/doc/html/rfc7009
   */
  async revoke(token: string, options?: OAuth2Client.RevokeOptions): Promise<void> {
    if (!token) {
      throw new Error(i18n.t('revoke_token_empty'));
    }

    const revocationEndpoint = await this.resolveRevocationEndpoint();
    const body = new URLSearchParams({ token });
    if (options?.tokenTypeHint) {
      body.set('token_type_hint', options.tokenTypeHint);
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    await this.applyClientAuth(body, headers);

    const res = await this.fetchOutbound(
      revocationEndpoint,
      {
        method: 'POST',
        headers,
        body,
      },
      'token_revoke_failed',
    );

    // RFC 7009：无效令牌仍应 200；非 2xx 视为客户端/服务端错误
    if (!res.ok) {
      throw new Error(i18n.t('token_revoke_failed'));
    }
  }

  /**
   * 用 JWKS 验签并校验 iss / aud / exp / nonce；若含 `at_hash` 则绑定 access_token
   * @see https://openid.net/specs/openid-connect-core-1_0.html#CodeFlowTokenValidation
   */
  protected async verifyIdToken(
    idToken: string,
    nonce: string,
    accessToken: string,
  ): Promise<Claims> {
    const { issuer, jwks_uri } = await this.resolveEndpoints();
    const jwks = this.getJwks(jwks_uri);

    let payload: JWTPayload;
    let alg: string;
    try {
      // issuer 自行做去尾斜杠比较，避免配置与 id_token.iss 一侧带 `/` 导致 jose 严格匹配失败
      const verified = await jwtVerify(idToken, jwks, {
        audience: this.opts.clientId,
        algorithms: [...ID_TOKEN_ALGORITHMS],
      });
      payload = verified.payload;
      if (
        typeof verified.protectedHeader.alg !== 'string' ||
        !verified.protectedHeader.alg
      ) {
        throw new Error('missing alg');
      }
      alg = verified.protectedHeader.alg;
    } catch {
      throw new Error(i18n.t('oidc_id_token_invalid'));
    }

    const actualIss =
      typeof payload.iss === 'string' ? this.normalizeIssuer(payload.iss) : '';
    if (!actualIss || actualIss !== this.normalizeIssuer(issuer)) {
      throw new Error(i18n.t('oidc_id_token_invalid'));
    }

    if (payload['nonce'] !== nonce) {
      throw new Error(i18n.t('oidc_nonce_mismatch'));
    }

    if (typeof payload.sub !== 'string' || !payload.sub) {
      throw new Error(i18n.t('oidc_id_token_invalid'));
    }

    this.assertAuthorizedParty(payload);

    // OIDC Core 3.1.3.6：存在 at_hash 时必须与 access_token 绑定校验
    if (payload['at_hash'] !== undefined) {
      if (typeof payload['at_hash'] !== 'string' || !payload['at_hash']) {
        throw new Error(i18n.t('oidc_at_hash_mismatch'));
      }
      this.assertAtHash(accessToken, payload['at_hash'], alg);
    }

    return payload as Claims;
  }

  /**
   * 多 audience 时必须有 `azp` 且等于 `client_id`；若声明了 `azp` 也须匹配
   * @see https://openid.net/specs/openid-connect-core-1_0.html#IDTokenValidation
   */
  protected assertAuthorizedParty(payload: JWTPayload): void {
    const aud = payload.aud;
    const azp = payload['azp'];
    const multiAud = Array.isArray(aud) && aud.length > 1;

    if (multiAud) {
      if (typeof azp !== 'string' || azp !== this.opts.clientId) {
        throw new Error(i18n.t('oidc_azp_mismatch'));
      }
      return;
    }

    if (azp !== undefined && azp !== this.opts.clientId) {
      throw new Error(i18n.t('oidc_azp_mismatch'));
    }
  }

  /**
   * 校验 `at_hash` 与 access_token
   * @see https://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken
   */
  protected assertAtHash(accessToken: string, atHash: string, alg: string): void {
    try {
      // EdDSA 未带 crv 时按 Ed25519（SHA-512）；Ed448 极少见
      validateOidcTokenHash(
        { claim: 'at_hash', source: 'access_token' },
        atHash,
        accessToken,
        alg,
        alg === 'EdDSA' ? 'Ed25519' : undefined,
      );
    } catch {
      throw new Error(i18n.t('oidc_at_hash_mismatch'));
    }
  }

  protected getJwks(jwksUri: string): ReturnType<typeof createRemoteJWKSet> {
    if (!this.jwks) {
      this.jwks = createRemoteJWKSet(new URL(jwksUri), {
        timeoutDuration: FETCH_TIMEOUT_MS,
      });
    }
    return this.jwks;
  }

  protected async resolveEndpoints(): Promise<{
    authorizationEndpoint: string;
    tokenEndpoint: string;
    issuer: string;
    jwks_uri: string;
  }> {
    if (!this.opts.oidc) {
      return {
        authorizationEndpoint: this.opts.authorizationEndpoint,
        tokenEndpoint: this.opts.tokenEndpoint,
        issuer: '',
        jwks_uri: '',
      };
    }

    const oidc = this.opts.oidc;
    let authorizationEndpoint = this.opts.authorizationEndpoint;
    let tokenEndpoint = this.opts.tokenEndpoint;
    let jwks_uri = oidc.jwksUri;
    let issuer = oidc.expectedIssuer ?? oidc.issuer;

    // 端点或 JWKS 有缺省时才走 discovery
    if (!authorizationEndpoint || !tokenEndpoint || !jwks_uri) {
      const metadata = await this.ensureOidcMetadata();
      authorizationEndpoint ||= metadata.authorization_endpoint;
      tokenEndpoint ||= metadata.token_endpoint;
      jwks_uri ||= metadata.jwks_uri;
      issuer = oidc.expectedIssuer ?? metadata.issuer;
    }

    if (!authorizationEndpoint) {
      throw new Error(i18n.t('authorization_endpoint_empty'));
    }
    if (!tokenEndpoint) {
      throw new Error(i18n.t('token_endpoint_empty'));
    }
    if (!jwks_uri) {
      throw new Error(i18n.t('oidc_jwks_uri_missing'));
    }

    return {
      authorizationEndpoint,
      tokenEndpoint,
      issuer: this.normalizeIssuer(issuer),
      jwks_uri,
    };
  }

  protected async resolveRevocationEndpoint(): Promise<string> {
    if (this.opts.revocationEndpoint) {
      return this.opts.revocationEndpoint;
    }
    if (this.opts.oidc) {
      const metadata = await this.ensureOidcMetadata();
      if (metadata.revocation_endpoint) {
        return metadata.revocation_endpoint;
      }
    }
    throw new Error(i18n.t('revocation_endpoint_empty'));
  }

  protected async ensureOidcMetadata(): Promise<OidcMetadata> {
    if (!this.opts.oidc) {
      throw new Error(i18n.t('oidc_discovery_failed'));
    }
    if (!this.metadata) {
      this.metadata = await this.fetchOidcMetadata(this.opts.oidc.issuer);
    }
    return this.metadata;
  }

  protected async fetchOidcMetadata(issuer: string): Promise<OidcMetadata> {
    const base = this.normalizeIssuer(issuer);
    const url = `${base}/.well-known/openid-configuration`;
    const res = await this.fetchOutbound(url, undefined, 'oidc_discovery_failed');
    let json: Record<string, unknown>;
    try {
      if (!res.ok) {
        throw new Error('status');
      }
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      throw new Error(i18n.t('oidc_discovery_failed'));
    }

    if (
      typeof json['issuer'] !== 'string' ||
      typeof json['authorization_endpoint'] !== 'string' ||
      typeof json['token_endpoint'] !== 'string' ||
      typeof json['jwks_uri'] !== 'string'
    ) {
      throw new Error(i18n.t('oidc_discovery_failed'));
    }

    // OpenID Discovery：文档中的 issuer 必须与用于拉取配置的 Issuer URL 一致
    if (this.normalizeIssuer(json['issuer']) !== base) {
      throw new Error(i18n.t('oidc_issuer_mismatch'));
    }

    return {
      issuer: json['issuer'],
      authorization_endpoint: json['authorization_endpoint'],
      token_endpoint: json['token_endpoint'],
      jwks_uri: json['jwks_uri'],
      revocation_endpoint:
        typeof json['revocation_endpoint'] === 'string'
          ? json['revocation_endpoint']
          : undefined,
    };
  }

  /** 去掉末尾 `/`，便于与 discovery / id_token.iss 比较 */
  protected normalizeIssuer(issuer: string): string {
    return issuer.replace(/\/$/, '');
  }

  protected resolveScopes(): string[] | undefined {
    const scopes = [...(this.opts.scopes ?? [])];
    if (this.opts.oidc && !scopes.includes('openid')) {
      scopes.unshift('openid');
    }
    return scopes.length ? scopes : undefined;
  }

  protected async exchangeCode(
    code: string,
    verifier: string,
    ctx: WebContext,
  ): Promise<OAuth2Client.TokenSet> {
    const { tokenEndpoint } = await this.resolveEndpoints();
    const redirectUri = this.resolveRedirectUri(ctx);
    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    });

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    await this.applyClientAuth(body, headers);

    if (this.pkce) {
      body.set('code_verifier', verifier);
    }

    const res = await this.fetchOutbound(
      tokenEndpoint,
      {
        method: 'POST',
        headers,
        body,
      },
      'token_exchange_failed',
    );

    return this.parseTokenResponse(res);
  }

  /**
   * 从请求中读取授权回调参数。默认读 query；`form_post` 等场景可由子类改为读 body。
   */
  protected readCallbackInput(ctx: WebContext): {
    code?: string;
    state?: string;
    error?: string;
    /** RFC 9207 Issuer Identification */
    iss?: string;
    /** 隐式/混合流参数；出现则拒绝 */
    id_token?: string;
    token?: string;
  } {
    const q = ctx.request.query;
    return {
      code: typeof q['code'] === 'string' ? q['code'] : undefined,
      state: typeof q['state'] === 'string' ? q['state'] : undefined,
      error: typeof q['error'] === 'string' ? q['error'] : undefined,
      iss: typeof q['iss'] === 'string' ? q['iss'] : undefined,
      id_token: typeof q['id_token'] === 'string' ? q['id_token'] : undefined,
      token: typeof q['token'] === 'string' ? q['token'] : undefined,
    };
  }

  /** RFC 9207：回调 `iss` 与 OIDC 配置 Issuer 比对 */
  protected async assertCallbackIssuer(iss: string): Promise<void> {
    if (!this.opts.oidc) {
      return;
    }
    const { issuer } = await this.resolveEndpoints();
    if (!issuer || this.normalizeIssuer(iss) !== this.normalizeIssuer(issuer)) {
      throw new Error(i18n.t('callback_iss_mismatch'));
    }
  }

  protected async resolveClientSecret(): Promise<string> {
    const raw = this.opts.clientSecret;
    const secret = typeof raw === 'function' ? await raw() : raw;
    if (!secret) {
      throw new Error(i18n.t('client_secret_empty'));
    }
    return secret;
  }

  /**
   * 按 `tokenAuth` 写入 client 凭证（Basic 时对 id/secret 做 form-urlencoded 编码）
   * @see https://datatracker.ietf.org/doc/html/rfc6749#section-2.3.1
   */
  protected async applyClientAuth(
    body: URLSearchParams,
    headers: Record<string, string>,
  ): Promise<void> {
    const clientSecret = await this.resolveClientSecret();
    if (this.tokenAuth === 'basic') {
      const credentials = Buffer.from(
        `${this.formUrlEncode(this.opts.clientId)}:${this.formUrlEncode(clientSecret)}`,
        'utf8',
      ).toString('base64');
      headers['Authorization'] = `Basic ${credentials}`;
      return;
    }
    body.set('client_id', this.opts.clientId);
    body.set('client_secret', clientSecret);
  }

  /**
   * `application/x-www-form-urlencoded` 编码（RFC 6749 Appendix B），供 Basic 凭证使用
   */
  protected formUrlEncode(value: string): string {
    return encodeURIComponent(value).replace(/(?:[-_.!~*'()]|%20)/g, (substring) => {
      switch (substring) {
        case '-':
        case '_':
        case '.':
        case '!':
        case '~':
        case '*':
        case "'":
        case '(':
        case ')':
          return `%${substring.charCodeAt(0).toString(16).toUpperCase()}`;
        case '%20':
          return '+';
        default:
          return substring;
      }
    });
  }

  protected formatScope(
    scope: string | readonly string[] | undefined,
  ): string | undefined {
    if (scope === undefined) return undefined;
    if (typeof scope === 'string') return scope || undefined;
    const joined = scope.filter(Boolean).join(' ');
    return joined || undefined;
  }

  /**
   * 带超时的出站 fetch；不跟随重定向；网络错误 / 超时时抛出对应 i18n 文案
   */
  protected async fetchOutbound(
    url: string,
    init: RequestInit | undefined,
    errorKey:
      | 'token_exchange_failed'
      | 'token_refresh_failed'
      | 'token_revoke_failed'
      | 'oidc_discovery_failed',
  ): Promise<Response> {
    try {
      return await fetch(url, {
        ...init,
        // 防 discovery / 换票被 30x 拐走
        redirect: 'manual',
        signal: init?.signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
      });
    } catch {
      throw new Error(i18n.t(errorKey));
    }
  }

  protected async parseTokenResponse(
    res: Response,
    errorKey: 'token_exchange_failed' | 'token_refresh_failed' = 'token_exchange_failed',
  ): Promise<OAuth2Client.TokenSet> {
    // redirect:manual 下 3xx 的 ok 为 false，与错误响应对齐
    if (!res.ok) {
      throw new Error(i18n.t(errorKey));
    }

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const text = await res.text();
      const params = new URLSearchParams(text);
      const access_token = params.get('access_token');
      if (params.has('error') || !access_token) {
        throw new Error(i18n.t(errorKey));
      }
      return {
        access_token,
        token_type: this.parseTokenType(params.get('token_type')),
        expires_in: this.parseExpiresIn(params.get('expires_in')),
        refresh_token: params.get('refresh_token') || undefined,
        scope: params.get('scope') || undefined,
        id_token: params.get('id_token') || undefined,
      };
    }

    let json: Record<string, unknown>;
    try {
      json = (await res.json()) as Record<string, unknown>;
    } catch {
      throw new Error(i18n.t(errorKey));
    }

    if (typeof json['error'] === 'string' || typeof json['access_token'] !== 'string') {
      throw new Error(i18n.t(errorKey));
    }

    return {
      access_token: json['access_token'],
      token_type: this.parseTokenType(json['token_type']),
      expires_in: this.parseExpiresIn(json['expires_in']),
      refresh_token:
        typeof json['refresh_token'] === 'string' ? json['refresh_token'] : undefined,
      scope: typeof json['scope'] === 'string' ? json['scope'] : undefined,
      id_token: typeof json['id_token'] === 'string' ? json['id_token'] : undefined,
    };
  }

  /** RFC 6749：`token_type` 必填；仅接受 bearer / dpop（大小写不敏感） */
  protected parseTokenType(value: unknown): 'bearer' | 'dpop' {
    if (typeof value !== 'string' || !value) {
      throw new Error(i18n.t('token_type_invalid'));
    }
    const normalized = value.toLowerCase();
    if (normalized === 'bearer' || normalized === 'dpop') {
      return normalized;
    }
    throw new Error(i18n.t('token_type_invalid'));
  }

  /** 接受 number 或数字字符串（部分 AS 返回 `"3600"`） */
  protected parseExpiresIn(value: unknown): number | undefined {
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim() !== '') {
      const n = Number(value);
      if (Number.isFinite(n)) {
        return n;
      }
    }
    return undefined;
  }

  protected resolveRedirectUri(ctx: WebContext): string {
    const uri =
      typeof this.opts.redirectUri === 'function'
        ? this.opts.redirectUri(ctx)
        : this.opts.redirectUri;
    if (!uri) {
      throw new Error(i18n.t('redirect_uri_empty'));
    }
    return uri;
  }

  /** 默认：`oauth2:state:${clientId}:${state}`；子类可 override */
  protected stateKey(state: string): Caching.Key {
    return `oauth2:state:${this.opts.clientId}:${state}`;
  }

  /**
   * 原子消费 state（`Caching.getAndDelete`）。
   * 并发 callback 仅一方成功；换票失败不恢复（防授权码重放）。
   */
  protected async consumeState(state: string): Promise<StatePayload> {
    await this.ensureReady();
    const saved = await this.caching.getAndDelete<StatePayload>(this.stateKey(state));
    if (!saved || (this.pkce && !saved.verifier)) {
      throw new Error(i18n.t('invalid_state'));
    }
    return saved;
  }

  protected isValidState(state: string): boolean {
    return state.length > 0 && state.length <= 128 && STATE_PATTERN.test(state);
  }

  /** RFC 6749 error 码字符集（防把任意 query 拼进错误文案） */
  protected isValidOAuthErrorCode(error: string): boolean {
    return error.length > 0 && error.length <= 64 && /^[A-Za-z0-9._-]+$/.test(error);
  }

  protected randomToken(): string {
    return randomBytes(32).toString('base64url');
  }
}

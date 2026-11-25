import type { Caching } from '@aomex/cache';
import type { DurationInput } from '@aomex/common';
import type { HttpError, WebContext, WebMiddleware } from '@aomex/web';
import type { SocketMiddleware, WebsocketContext } from '@aomex/websocket';

/** 用户主体标识。存储前统一 `String(id)` */
export type AbuseId = string | number;

/** 路径匹配：精确路径、简单 glob，或正则（正则会匹配 pathname+search） */
export type AbusePathMatcher = string | RegExp;

/**
 * HTTP 路径蜜罐：命中后按 IP 计数，满额封 IP。仅 `.web()` 生效。
 */
export type AbuseHoneypotStrategy = {
  strategy: 'honeypot';
  /**
   * 蜜罐路径（不能为空）。字符串支持 `*` / `**`；正则匹配 `pathname + search`
   */
  paths: readonly AbusePathMatcher[];
  /**
   * 仅统计匹配方法的响应。未配置则不限方法
   */
  methods?: readonly string[];
  /** 窗口内累计次数上限，须为正整数 */
  limit: number;
  /**
   * 固定计数窗口（须为正数时长）。自该 IP 首次命中起算，窗口内累计次数；到期后计数清零重开
   */
  window: DurationInput;
  /**
   * 撞线后封禁 IP 的时长（须为正数）
   */
  blockFor: DurationInput;
};

/**
 * 按 HTTP 响应状态码累计。满额后封 IP。仅 `.web()` 生效。
 */
export type AbuseHttpErrorStrategy = {
  strategy: 'http-error';
  /**
   * 计入的 HTTP 状态码（不能为空；同一策略内混合累计）
   */
  statusCodes: readonly number[];
  /**
   * 仅统计匹配路径的响应。字符串支持 `*` / `**`；正则匹配 `pathname + search`。未配置则不限路径
   */
  paths?: readonly AbusePathMatcher[];
  /**
   * 仅统计匹配方法的响应。未配置则不限方法
   */
  methods?: readonly string[];
  /**
   * 窗口内累计次数上限，达到后封禁该 IP；须为正整数
   */
  limit: number;
  /**
   * 固定计数窗口（须为正数时长）。自该 IP 首次命中起算，窗口内累计次数；到期后计数清零重开
   */
  window: DurationInput;
  /**
   * 撞线后封禁 IP 的时长（须为正数）
   */
  blockFor: DurationInput;
};

/**
 * WebSocket 事件蜜罐：命中 `events` 后按 IP 计数，满额封 IP。仅 `.socket()` 生效。
 */
export type AbuseSocketEventsStrategy = {
  strategy: 'socket-events';
  /**
   * 蜜罐事件名（不能为空）。字符串支持 `*`；正则整串匹配 `ctx.event`
   */
  events: readonly (string | RegExp)[];
  /** 窗口内累计次数上限，须为正整数 */
  limit: number;
  /**
   * 固定计数窗口（须为正数时长）。自该 IP 首次命中起算，窗口内累计次数；到期后计数清零重开
   */
  window: DurationInput;
  /**
   * 撞线后封禁 IP 的时长（须为正数）
   */
  blockFor: DurationInput;
};

/**
 * 业务上报的用户滥用。只吃返回值上的 `userAbuse()`（HTTP / WebSocket 均可调）；
 * 满额触发 `onBanUser`，不自动封 IP。
 */
export type AbuseUserAbuseStrategy<Reason extends string | number = string | number> = {
  strategy: 'user-abuse';
  /**
   * 滥用分桶标识（`string | number`），与 `userAbuse(id, reason)` 的第二参对应；存储前统一 `String(reason)`
   */
  reason: Reason;
  /**
   * 窗口内累计次数上限，达到后触发 `onBanUser`；须为正整数
   */
  limit: number;
  /**
   * 固定计数窗口（须为正数时长）。自该用户该 reason 首次上报起算，窗口内累计次数；到期后计数清零重开
   */
  window: DurationInput;
  /**
   * 建议封禁时长（须为正数），经 `onBanUser` 传出；包内不写用户库
   */
  banFor?: DurationInput;
};

/**
 * 业务上报的 IP 滥用（如 logout token 未命中仍返回 204）。
 * 只吃 `ipAbuse()`（HTTP / WebSocket 均可调）；满额封 IP。
 */
export type AbuseIpAbuseStrategy<Reason extends string | number = string | number> = {
  strategy: 'ip-abuse';
  /**
   * 滥用分桶标识，与 `ipAbuse(ip, reason)` 的第二参对应；存储前统一 `String(reason)`
   */
  reason: Reason;
  /**
   * 窗口内累计次数上限，达到后封禁该 IP；须为正整数
   */
  limit: number;
  /**
   * 固定计数窗口（须为正数时长）。自该 IP 该 reason 首次上报起算，窗口内累计次数；到期后计数清零重开
   */
  window: DurationInput;
  /**
   * 撞线后封禁 IP 的时长（须为正数）
   */
  blockFor: DurationInput;
};

export type AbuseStrategy =
  | AbuseHoneypotStrategy
  | AbuseHttpErrorStrategy
  | AbuseSocketEventsStrategy
  | AbuseUserAbuseStrategy
  | AbuseIpAbuseStrategy;

export type InferUserAbuseReasons<S extends readonly AbuseStrategy[]> =
  Extract<S[number], { strategy: 'user-abuse' }> extends { reason: infer R }
    ? R extends string | number
      ? R
      : never
    : never;

export type InferIpAbuseReasons<S extends readonly AbuseStrategy[]> =
  Extract<S[number], { strategy: 'ip-abuse' }> extends { reason: infer R }
    ? R extends string | number
      ? R
      : never
    : never;

/** `onBlockIP` 的 reason */
export type AbuseBlockStrategy =
  'honeypot' | 'http-error' | 'socket-events' | 'ip-abuse' | 'manual';

export type AbuseApi<
  UserAbuseReason extends string | number = string | number,
  IpAbuseReason extends string | number = string | number,
> = {
  /**
   * 上报一次用户滥用（按 reason 分桶计数）。满额只回调 `onBanUser`，需业务自行写库封用户
   */
  userAbuse(id: AbuseId, reason: UserAbuseReason): Promise<void>;
  /**
   * 上报一次 IP 滥用（按 reason 分桶计数）。满额封 IP 并触发 `onBlockIP`
   *
   * @example logout 时 token 未命中 Redis 仍返回 204，可 `ipAbuse(ctx.request.ip, 'logout-miss')`
   */
  ipAbuse(ip: string, reason: IpAbuseReason): Promise<void>;
  /**
   * 手动封禁 IP。未封禁时写入并触发 `onBlockIP`；已封禁则跳过（不刷新 TTL、不重复回调）
   */
  blockIP(ip: string, duration: DurationInput): Promise<void>;
  /**
   * 解除 IP 封禁
   */
  unblockIP(ip: string): Promise<void>;
  /**
   * 是否已封禁该 IP
   */
  isIPBlocked(ip: string): Promise<boolean>;
};

/** `.web()` 可选配置 */
export type AbuseWebOptions = {
  /**
   * 跳过探测与封禁检查（如健康检查、内网）
   */
  bypass?: (ctx: WebContext) => boolean | Promise<boolean>;
  /**
   * IP 被封禁时抛出的错误。默认：`403 Forbidden`
   */
  blockedError?: HttpError;
};

/** `.socket()` 可选配置 */
export type AbuseSocketOptions = {
  /**
   * 跳过封禁检查（如内网、监控探针）
   */
  bypass?: (ctx: WebsocketContext) => boolean | Promise<boolean>;
  /**
   * 被封禁时回推 `error` 帧的文案（随后以 1008 断开连接）。默认走 i18n
   */
  errorMessage?: string;
};

/**
 * `Abuse` 实例的公开形状：上报 API + `.web()` / `.socket()` 适配器。
 * 不挂 `ctx`；HTTP / WebSocket 共用同一封禁态与 API。
 */
export type AbuseService<
  UserAbuseReason extends string | number = string | number,
  IpAbuseReason extends string | number = string | number,
> = AbuseApi<UserAbuseReason, IpAbuseReason> & {
  /**
   * HTTP 中间件。挂在 `WebApp.mount`。
   * 含蜜罐 / http-error 累计与 IP 封禁检查。
   *
   * ```ts
   * mount: [abuse.web({ bypass: (ctx) => ctx.request.pathname === '/health' })]
   * ```
   */
  web(options?: AbuseWebOptions): WebMiddleware;
  /**
   * WebSocket 入站中间件。挂在 `WebsocketApp.mount`。
   * 调用前须 `import '@aomex/websocket'`（注册 `middleware.socket`）。
   * IP 已封禁或 `socket-events` 满额时：回推 `error` 并以 1008 断开连接。
   *
   * ```ts
   * import '@aomex/websocket';
   * mount: [abuse.socket(), channels('./src/channels')]
   * ```
   */
  socket(options?: AbuseSocketOptions): SocketMiddleware;
};

type AbuseOnBanUser<S extends readonly AbuseStrategy[]> = (
  id: AbuseId,
  reason: InferUserAbuseReasons<S>,
  detail: { count: number; limit: number; banFor?: number },
) => void | Promise<void>;

type AbuseOptionsBase<S extends readonly AbuseStrategy[]> = {
  /**
   * 缓存门面。组合根应 `const cache = new Caching(adapter)`，再传入此处
   */
  store: Caching;
  /**
   * IP 被封禁时回调（策略撞线、`ipAbuse` 满额或手动 `blockIP`）
   */
  onBlockIP?: (
    ip: string,
    reason: AbuseBlockStrategy,
    detail: AbuseBlockDetail,
  ) => void | Promise<void>;
  strategies: S;
};

/**
 * 配置项。存在 `user-abuse` 策略时 `onBanUser` 必填，否则可选
 */
export type AbuseOptions<S extends readonly AbuseStrategy[] = readonly AbuseStrategy[]> =
  AbuseOptionsBase<S> &
    ([Extract<S[number], { strategy: 'user-abuse' }>] extends [never]
      ? {
          /**
           * `user-abuse` 计数满额时回调。应在此写入用户库完成账号封禁
           */
          onBanUser?: AbuseOnBanUser<S>;
        }
      : {
          /**
           * `user-abuse` 计数满额时回调。应在此写入用户库完成账号封禁。
           * 配置了 `user-abuse` 时必填；未提供时创建阶段会抛错
           */
          onBanUser: AbuseOnBanUser<S>;
        });

/** IP 封禁终态详情。手动 `blockIP` 时 `count` / `limit` 为 `1` */
export type AbuseBlockDetail = {
  count: number;
  limit: number;
  /** 封禁时长，单位毫秒 */
  blockFor: number;
};

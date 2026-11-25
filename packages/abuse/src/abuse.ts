import { CacheKey, Caching } from '@aomex/cache';
import { middleware, parseDuration, type DurationInput } from '@aomex/common';
import { HttpError, type WebContext, type WebMiddleware } from '@aomex/web';
import type { SocketMiddleware, WebsocketContext } from '@aomex/websocket';
import { i18n } from './i18n';
import type {
  AbuseApi,
  AbuseBlockDetail,
  AbuseBlockStrategy,
  AbuseHoneypotStrategy,
  AbuseHttpErrorStrategy,
  AbuseId,
  AbuseIpAbuseStrategy,
  AbuseOptions,
  AbusePathMatcher,
  AbuseSocketEventsStrategy,
  AbuseSocketOptions,
  AbuseStrategy,
  AbuseWebOptions,
  AbuseUserAbuseStrategy,
  InferIpAbuseReasons,
  InferUserAbuseReasons,
} from './types';

const abuseKey = CacheKey.key('abuse');

/**
 * 蜜罐路径 / 错误累计 / 业务滥用计数。
 *
 * - `honeypot` / `http-error`：仅 `.web()` 按请求匹配计数，满额封 IP
 * - `socket-events`：仅 `.socket()` 按事件名蜜罐计数，满额封 IP
 * - `ip-abuse`：业务上报 IP 滥用（如 logout token 未命中），满额封 IP
 * - `user-abuse`：业务上报，满额只触发 `onBanUser`（账号封禁由业务写库）
 *
 * 实例即服务（API + `.web()` / `.socket()`），不挂到 `ctx`：
 * ```ts
 * const cache = new Caching(adapter);
 * const abuse = new Abuse({
 *   store: cache,
 *   strategies: [
 *     { strategy: 'socket-events', events: ['admin.destroy'], limit: 1, window: '1h', blockFor: '1d' },
 *   ],
 * });
 * app.mount([abuse.web()]);
 * // 须先 import '@aomex/websocket'，以注册 middleware.socket
 * ws.mount([abuse.socket(), channels('./src/channels')]);
 * await abuse.ipAbuse(ip, 'logout-miss');
 * ```
 */
export class Abuse<
  const S extends readonly AbuseStrategy[] = readonly AbuseStrategy[],
  UserAbuseReason extends string | number = InferUserAbuseReasons<S>,
  IpAbuseReason extends string | number = InferIpAbuseReasons<S>,
> implements AbuseApi<UserAbuseReason, IpAbuseReason> {
  protected readonly cache: Caching;
  protected readonly onBanUser?: (
    id: AbuseId,
    reason: UserAbuseReason,
    detail: { count: number; limit: number; banFor?: number },
  ) => void | Promise<void>;
  protected readonly onBlockIP?: (
    ip: string,
    reason: AbuseBlockStrategy,
    detail: AbuseBlockDetail,
  ) => void | Promise<void>;
  protected readonly honeypotStrategies: AbuseHoneypotStrategy[];
  protected readonly httpErrorStrategies: AbuseHttpErrorStrategy[];
  protected readonly socketEventsStrategies: AbuseSocketEventsStrategy[];
  protected readonly userAbuseStrategies: Map<string, AbuseUserAbuseStrategy>;
  protected readonly ipAbuseStrategies: Map<string, AbuseIpAbuseStrategy>;
  constructor(options: AbuseOptions<S>) {
    this.cache = options.store;
    this.onBanUser = options.onBanUser as typeof this.onBanUser;
    this.onBlockIP = options.onBlockIP;

    this.honeypotStrategies = options.strategies.filter(
      (item): item is AbuseHoneypotStrategy => item.strategy === 'honeypot',
    );
    this.httpErrorStrategies = options.strategies.filter(
      (item): item is AbuseHttpErrorStrategy => item.strategy === 'http-error',
    );
    this.socketEventsStrategies = options.strategies.filter(
      (item): item is AbuseSocketEventsStrategy => item.strategy === 'socket-events',
    );
    const { userAbuseStrategies, ipAbuseStrategies } = Abuse.validateStrategies(
      options.strategies,
    );
    this.userAbuseStrategies = userAbuseStrategies;
    this.ipAbuseStrategies = ipAbuseStrategies;

    if (userAbuseStrategies.size > 0 && !options.onBanUser) {
      throw new Error(i18n.t('missing_on_ban_user'));
    }
  }

  async userAbuse(id: AbuseId, reason: UserAbuseReason): Promise<void> {
    const reasonKey = String(reason);
    const strategy = this.userAbuseStrategies.get(reasonKey);
    if (!strategy) {
      throw new Error(i18n.t('unknown_user_abuse_reason', { reason: reasonKey }));
    }
    const idKey = String(id);
    const countKey = abuseKey.key('count', 'user-abuse', reasonKey, idKey);
    const windowMs = parseDuration(strategy.window);
    const count = await this.bumpCount(countKey, windowMs);
    if (count < strategy.limit) return;

    // 无 IP 封禁键：hook 标记 setNX，避免窗口内重复 / 并发触发 onBanUser
    const hookKey = abuseKey.key('hook', 'user-abuse', reasonKey, idKey);
    const banFor =
      strategy.banFor === undefined ? undefined : parseDuration(strategy.banFor);
    const countTtl = await this.cache.ttl(countKey);
    const marked = await this.cache.setNX(
      hookKey,
      '1',
      Math.max(countTtl > 0 ? countTtl : windowMs, 1),
    );
    if (!marked) return;
    try {
      await this.onBanUser!(id, reason, {
        count,
        limit: strategy.limit,
        banFor,
      });
    } catch (e) {
      // 回调失败则释放 hook，允许窗口内重试
      await this.cache.delete(hookKey);
      throw e;
    }
  }

  async ipAbuse(ip: string, reason: IpAbuseReason): Promise<void> {
    const reasonKey = String(reason);
    const strategy = this.ipAbuseStrategies.get(reasonKey);
    if (!strategy) {
      throw new Error(i18n.t('unknown_ip_abuse_reason', { reason: reasonKey }));
    }
    const countKey = abuseKey.key('count', 'ip-abuse', reasonKey, ip);
    const count = await this.bumpCount(countKey, parseDuration(strategy.window));
    if (count < strategy.limit) return;

    await this.ensureBlocked(ip, 'ip-abuse', {
      count,
      limit: strategy.limit,
      blockFor: parseDuration(strategy.blockFor),
    });
  }

  async blockIP(ip: string, duration: DurationInput): Promise<void> {
    const blockFor = parseDuration(duration);
    if (blockFor <= 0) {
      throw new Error(i18n.t('invalid_block_for', { blockFor: String(duration) }));
    }
    await this.ensureBlocked(ip, 'manual', {
      count: 1,
      limit: 1,
      blockFor,
    });
  }

  async unblockIP(ip: string): Promise<void> {
    await this.cache.delete(this.getBlockKey(ip));
  }

  async isIPBlocked(ip: string): Promise<boolean> {
    return this.cache.exists(this.getBlockKey(ip));
  }

  /**
   * HTTP 中间件。挂在 `WebApp.mount`。
   * 含蜜罐 / http-error 累计与 IP 封禁检查。
   */
  web(webOptions: AbuseWebOptions = {}): WebMiddleware {
    const bypass = webOptions.bypass ?? (() => false);
    const throwBlocked = (ctx: WebContext): never => {
      if (webOptions.blockedError) throw webOptions.blockedError;
      return ctx.throw(403);
    };

    return middleware.web(async (ctx, next) => {
      if (await bypass(ctx)) return next();

      const ip = ctx.request.ip;

      if (await this.cache.exists(this.getBlockKey(ip))) {
        return throwBlocked(ctx);
      }

      const request = ctx.request;

      for (let i = 0; i < this.honeypotStrategies.length; i += 1) {
        const strategy = this.honeypotStrategies[i]!;
        if (
          !this.matchMethod(request.method, strategy.methods) ||
          !this.matchAnyPath(request.pathname, request.search, strategy.paths)
        ) {
          continue;
        }

        const countKey = abuseKey.key('count', 'honeypot', i, ip);
        const count = await this.bumpCount(countKey, parseDuration(strategy.window));
        if (count < strategy.limit) continue;

        await this.ensureBlocked(ip, 'honeypot', {
          count,
          limit: strategy.limit,
          blockFor: parseDuration(strategy.blockFor),
        });
        return throwBlocked(ctx);
      }

      let statusCode: number;
      let thrown: HttpError | undefined;
      try {
        await next();
        statusCode = ctx.response.statusCode;
      } catch (e) {
        thrown = HttpError.from(e);
        statusCode = thrown.statusCode;
      }

      for (let i = 0; i < this.httpErrorStrategies.length; i += 1) {
        const strategy = this.httpErrorStrategies[i]!;
        if (
          !strategy.statusCodes.includes(statusCode) ||
          !this.matchMethod(request.method, strategy.methods) ||
          !this.matchAnyPath(request.pathname, request.search, strategy.paths)
        ) {
          continue;
        }

        const countKey = abuseKey.key('count', 'http-error', i, ip);
        const count = await this.bumpCount(countKey, parseDuration(strategy.window));
        if (count < strategy.limit) continue;

        await this.ensureBlocked(ip, 'http-error', {
          count,
          limit: strategy.limit,
          blockFor: parseDuration(strategy.blockFor),
        });
      }

      if (thrown) throw thrown;
    });
  }

  /**
   * WebSocket 入站中间件。挂在 `WebsocketApp.mount`。
   * 调用前须 `import '@aomex/websocket'`（注册 `middleware.socket`）。
   * IP 已封禁或 `socket-events` 满额时：回推 `error` 并以 1008 断开连接。
   */
  socket(socketOptions: AbuseSocketOptions = {}): SocketMiddleware {
    // 调用方须先 import '@aomex/websocket'，以注册 middleware.socket
    const socketBypass = socketOptions.bypass ?? (() => false);
    /** 回推 error 后断开：封禁不是软限流，连接不应继续占用 */
    const rejectBlocked = async (ctx: WebsocketContext) => {
      const message = socketOptions.errorMessage || i18n.t('blocked');
      try {
        await ctx.client.send('error', { message });
      } finally {
        // 1008 Policy Violation；reason 与 error 帧一致，传输层会截断超长 reason
        await ctx.client.close(1008, message);
      }
    };

    return middleware.socket(async (ctx: WebsocketContext, next) => {
      if (await socketBypass(ctx)) return next();

      const ip = ctx.client.request.ip;

      if (await this.cache.exists(this.getBlockKey(ip))) {
        await rejectBlocked(ctx);
        return;
      }

      for (let i = 0; i < this.socketEventsStrategies.length; i += 1) {
        const strategy = this.socketEventsStrategies[i]!;
        if (!this.matchAnyEvent(ctx.event, strategy.events)) continue;

        const countKey = abuseKey.key('count', 'socket-events', i, ip);
        const count = await this.bumpCount(countKey, parseDuration(strategy.window));
        if (count < strategy.limit) continue;

        await this.ensureBlocked(ip, 'socket-events', {
          count,
          limit: strategy.limit,
          blockFor: parseDuration(strategy.blockFor),
        });
        await rejectBlocked(ctx);
        return;
      }

      return next();
    });
  }

  /** 校验策略并按 reason 分桶；非法配置创建期抛错 */
  protected static validateStrategies(strategies: readonly AbuseStrategy[]) {
    const userAbuseStrategies = new Map<string, AbuseUserAbuseStrategy>();
    const ipAbuseStrategies = new Map<string, AbuseIpAbuseStrategy>();

    for (const item of strategies) {
      if (!Number.isInteger(item.limit) || item.limit <= 0) {
        throw new Error(i18n.t('invalid_limit', { limit: String(item.limit) }));
      }
      const windowMs = parseDuration(item.window);
      if (windowMs <= 0) {
        throw new Error(i18n.t('invalid_window', { window: String(item.window) }));
      }
      if (item.strategy === 'honeypot') {
        if (item.paths.length === 0) {
          throw new Error(i18n.t('empty_honeypot_paths'));
        }
      } else if (item.strategy === 'http-error') {
        if (item.statusCodes.length === 0) {
          throw new Error(i18n.t('empty_http_error_status_codes'));
        }
      } else if (item.strategy === 'socket-events') {
        if (item.events.length === 0) {
          throw new Error(i18n.t('empty_socket_events'));
        }
      }
      if (item.strategy === 'user-abuse') {
        if (item.banFor !== undefined) {
          const banForMs = parseDuration(item.banFor);
          if (banForMs <= 0) {
            throw new Error(i18n.t('invalid_ban_for', { banFor: String(item.banFor) }));
          }
        }
        const reasonKey = String(item.reason);
        if (userAbuseStrategies.has(reasonKey)) {
          throw new Error(i18n.t('duplicate_user_abuse_reason', { reason: reasonKey }));
        }
        userAbuseStrategies.set(reasonKey, item);
      } else {
        const blockForMs = parseDuration(item.blockFor);
        if (blockForMs <= 0) {
          throw new Error(
            i18n.t('invalid_block_for', { blockFor: String(item.blockFor) }),
          );
        }
        if (item.strategy === 'ip-abuse') {
          const reasonKey = String(item.reason);
          if (ipAbuseStrategies.has(reasonKey)) {
            throw new Error(i18n.t('duplicate_ip_abuse_reason', { reason: reasonKey }));
          }
          ipAbuseStrategies.set(reasonKey, item);
        }
      }
    }

    return { userAbuseStrategies, ipAbuseStrategies };
  }

  /**
   * 路径匹配：精确字符串、简单 glob（`*` / `**`）、或正则。
   * 正则会对 `pathname + search` 检测，便于捕获 query 中的探测特征。
   */
  protected matchPath(
    pathname: string,
    search: string,
    matcher: AbusePathMatcher,
  ): boolean {
    if (matcher instanceof RegExp) {
      return matcher.test(pathname + search);
    }

    if (!matcher.includes('*')) {
      return pathname === matcher;
    }

    return this.globToRegExp(matcher).test(pathname);
  }

  /**
   * 任一路径匹配器命中即为 true。
   * `paths` 为 `undefined` 时视为不限路径；空数组不命中。
   */
  protected matchAnyPath(
    pathname: string,
    search: string,
    paths?: readonly AbusePathMatcher[],
  ): boolean {
    if (paths === undefined) return true;
    return paths.some((item) => this.matchPath(pathname, search, item));
  }

  /**
   * 匹配 HTTP 方法（忽略大小写）。
   * `methods` 为 `undefined` 或空数组时视为不限方法。
   */
  protected matchMethod(method: string, methods?: readonly string[]): boolean {
    if (!methods?.length) return true;
    const upper = method.toUpperCase();
    return methods.some((item) => item.toUpperCase() === upper);
  }

  /**
   * 事件名匹配：精确字符串、简单 glob（`*` → 任意字符）、或正则。
   */
  protected matchEvent(event: string, matcher: string | RegExp): boolean {
    if (matcher instanceof RegExp) {
      return matcher.test(event);
    }

    if (!matcher.includes('*')) {
      return event === matcher;
    }

    let pattern = '';
    for (let i = 0; i < matcher.length; i += 1) {
      const char = matcher[i]!;
      if (char === '*') {
        pattern += '.*';
        continue;
      }
      if (/[.+?^${}()|[\]\\]/.test(char)) {
        pattern += `\\${char}`;
        continue;
      }
      pattern += char;
    }
    return new RegExp(`^${pattern}$`).test(event);
  }

  /**
   * 任一事件匹配器命中即为 true。
   * `events` 为 `undefined` 时视为不限；空数组不命中。
   */
  protected matchAnyEvent(event: string, events?: readonly (string | RegExp)[]): boolean {
    if (events === undefined) return true;
    return events.some((item) => this.matchEvent(event, item));
  }

  protected globToRegExp(glob: string): RegExp {
    let source = glob;
    let optionalDeep = false;
    if (source.endsWith('/**')) {
      source = source.slice(0, -3);
      optionalDeep = true;
    }

    let pattern = '';
    for (let i = 0; i < source.length; i += 1) {
      const char = source[i]!;
      if (char === '*') {
        if (source[i + 1] === '*') {
          pattern += '.*';
          i += 1;
        } else {
          pattern += '[^/]*';
        }
        continue;
      }
      if (/[.+?^${}()|[\]\\]/.test(char)) {
        pattern += `\\${char}`;
        continue;
      }
      pattern += char;
    }
    if (optionalDeep) pattern += '(?:/.*)?';
    return new RegExp(`^${pattern}$`);
  }

  protected getBlockKey(ip: string) {
    return abuseKey.key('block', ip);
  }

  protected async bumpCount(countKey: Caching.Key, windowMs: number): Promise<number> {
    const count = await this.cache.increment(countKey);
    if (count === 1 || (await this.cache.ttl(countKey)) === -1) {
      await this.cache.expire(countKey, Math.max(windowMs, 1));
    }
    return count;
  }

  /**
   * 封 IP：`setNX` 原子抢占，已封禁则跳过钩子；抢到则写入并触发 `onBlockIP`
   */
  protected async ensureBlocked(
    ip: string,
    reason: AbuseBlockStrategy,
    detail: { count: number; limit: number; blockFor: number },
  ): Promise<boolean> {
    const created = await this.cache.setNX(this.getBlockKey(ip), reason, detail.blockFor);
    if (!created) return false;
    await this.onBlockIP?.(ip, reason, detail);
    return true;
  }
}

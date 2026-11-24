import { CacheKey, Caching } from '@aomex/cache';
import { middleware, parseDuration, registerLifecycle } from '@aomex/common';
import { HttpError, type WebContext } from '@aomex/web';
import type { SocketMiddleware, WebsocketContext } from '@aomex/websocket';
import { i18n } from './i18n';
import { matchAnyEvent, matchAnyPath, matchMethod } from './match';
import type {
  AbuseApi,
  AbuseBlockStrategy,
  AbuseHoneypotStrategy,
  AbuseHttpErrorStrategy,
  AbuseIpAbuseStrategy,
  AbuseOptions,
  AbuseService,
  AbuseSocketEventsStrategy,
  AbuseSocketOptions,
  AbuseStrategy,
  AbuseWebOptions,
  AbuseUserAbuseStrategy,
  InferIpAbuseReasons,
  InferUserAbuseReasons,
} from './types';

const abuseKey = new CacheKey().key('abuse');

/** 校验策略并按 reason 分桶；非法配置创建期抛错 */
const validateStrategies = (strategies: readonly AbuseStrategy[]) => {
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
        throw new Error(i18n.t('invalid_block_for', { blockFor: String(item.blockFor) }));
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
};

/**
 * 蜜罐路径 / 错误累计 / 业务滥用计数。
 *
 * - `honeypot` / `http-error`：仅 `.web()` 按请求匹配计数，满额封 IP
 * - `socket-events`：仅 `.socket()` 按事件名蜜罐计数，满额封 IP
 * - `ip-abuse`：业务上报 IP 滥用（如 logout token 未命中），满额封 IP
 * - `user-abuse`：业务上报，满额只触发 `onBanUser`（账号封禁由业务写库）
 *
 * 返回值是服务（API + `.web()` / `.socket()`），不挂到 `ctx`：
 * ```ts
 * const abuse = createAbuse({
 *   store,
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
export const createAbuse = <const S extends readonly AbuseStrategy[]>(
  options: AbuseOptions<S>,
): AbuseService<InferUserAbuseReasons<S>, InferIpAbuseReasons<S>> => {
  const adapter = options.store;
  const caching = new Caching(adapter);
  const getBlockKey = (ip: string) => abuseKey.key('block', ip);
  const onBanUser = options.onBanUser;
  const onBlockIP = options.onBlockIP;

  const bumpCount = async (countKey: Caching.Key, windowMs: number): Promise<number> => {
    const count = await caching.increment(countKey);
    if (count === 1 || (await caching.ttl(countKey)) === -1) {
      await caching.expire(countKey, Math.max(windowMs, 1));
    }
    return count;
  };

  /**
   * 封 IP：`setNX` 原子抢占，已封禁则跳过钩子；抢到则写入并触发 `onBlockIP`
   */
  const ensureBlocked = async (
    ip: string,
    reason: AbuseBlockStrategy,
    detail: { count: number; limit: number; blockFor: number },
  ): Promise<boolean> => {
    const created = await caching.setNX(getBlockKey(ip), reason, detail.blockFor);
    if (!created) return false;
    await onBlockIP?.(ip, reason, detail);
    return true;
  };

  const honeypotStrategies = options.strategies.filter(
    (item): item is AbuseHoneypotStrategy => item.strategy === 'honeypot',
  );
  const httpErrorStrategies = options.strategies.filter(
    (item): item is AbuseHttpErrorStrategy => item.strategy === 'http-error',
  );
  const socketEventsStrategies = options.strategies.filter(
    (item): item is AbuseSocketEventsStrategy => item.strategy === 'socket-events',
  );
  const { userAbuseStrategies, ipAbuseStrategies } = validateStrategies(
    options.strategies,
  );

  if (userAbuseStrategies.size > 0 && !onBanUser) {
    throw new Error(i18n.t('missing_on_ban_user'));
  }

  let ready: Promise<void> | undefined;
  const ensureReady = () => {
    ready ??= registerLifecycle({
      onInit: () => adapter.connect(),
      onDestroy: () => adapter.disconnect(),
    });
    return ready;
  };

  const api: AbuseApi<InferUserAbuseReasons<S>, InferIpAbuseReasons<S>> = {
    async userAbuse(id, reason) {
      await ensureReady();
      const reasonKey = String(reason);
      const strategy = userAbuseStrategies.get(reasonKey);
      if (!strategy) {
        throw new Error(i18n.t('unknown_user_abuse_reason', { reason: reasonKey }));
      }
      const idKey = String(id);
      const countKey = abuseKey.key('count', 'user-abuse', reasonKey, idKey);
      const windowMs = parseDuration(strategy.window);
      const count = await bumpCount(countKey, windowMs);
      if (count < strategy.limit) return;

      // 无 IP 封禁键：hook 标记 setNX，避免窗口内重复 / 并发触发 onBanUser
      const hookKey = abuseKey.key('hook', 'user-abuse', reasonKey, idKey);
      const banFor =
        strategy.banFor === undefined ? undefined : parseDuration(strategy.banFor);
      const countTtl = await caching.ttl(countKey);
      const marked = await caching.setNX(
        hookKey,
        '1',
        Math.max(countTtl > 0 ? countTtl : windowMs, 1),
      );
      if (!marked) return;
      try {
        await onBanUser!(id, reason, { count, limit: strategy.limit, banFor });
      } catch (e) {
        // 回调失败则释放 hook，允许窗口内重试
        await caching.delete(hookKey);
        throw e;
      }
    },
    async ipAbuse(ip, reason) {
      await ensureReady();
      const reasonKey = String(reason);
      const strategy = ipAbuseStrategies.get(reasonKey);
      if (!strategy) {
        throw new Error(i18n.t('unknown_ip_abuse_reason', { reason: reasonKey }));
      }
      const countKey = abuseKey.key('count', 'ip-abuse', reasonKey, ip);
      const count = await bumpCount(countKey, parseDuration(strategy.window));
      if (count < strategy.limit) return;

      await ensureBlocked(ip, 'ip-abuse', {
        count,
        limit: strategy.limit,
        blockFor: parseDuration(strategy.blockFor),
      });
    },
    async blockIP(ip, duration) {
      await ensureReady();
      const blockFor = parseDuration(duration);
      if (blockFor <= 0) {
        throw new Error(i18n.t('invalid_block_for', { blockFor: String(duration) }));
      }
      await ensureBlocked(ip, 'manual', {
        count: 1,
        limit: 1,
        blockFor,
      });
    },
    async unblockIP(ip) {
      await ensureReady();
      await caching.delete(getBlockKey(ip));
    },
    async isIPBlocked(ip) {
      await ensureReady();
      return caching.exists(getBlockKey(ip));
    },
  };

  const web = (webOptions: AbuseWebOptions = {}) => {
    const bypass = webOptions.bypass ?? (() => false);
    const throwBlocked = (ctx: WebContext): never => {
      if (webOptions.blockedError) throw webOptions.blockedError;
      return ctx.throw(403);
    };

    return middleware.web(async (ctx, next) => {
      await ensureReady();
      if (await bypass(ctx)) return next();

      const ip = ctx.request.ip;

      if (await caching.exists(getBlockKey(ip))) {
        return throwBlocked(ctx);
      }

      const request = ctx.request;

      for (let i = 0; i < honeypotStrategies.length; i += 1) {
        const strategy = honeypotStrategies[i]!;
        if (
          !matchMethod(request.method, strategy.methods) ||
          !matchAnyPath(request.pathname, request.search, strategy.paths)
        ) {
          continue;
        }

        const countKey = abuseKey.key('count', 'honeypot', i, ip);
        const count = await bumpCount(countKey, parseDuration(strategy.window));
        if (count < strategy.limit) continue;

        await ensureBlocked(ip, 'honeypot', {
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

      for (let i = 0; i < httpErrorStrategies.length; i += 1) {
        const strategy = httpErrorStrategies[i]!;
        if (
          !strategy.statusCodes.includes(statusCode) ||
          !matchMethod(request.method, strategy.methods) ||
          !matchAnyPath(request.pathname, request.search, strategy.paths)
        ) {
          continue;
        }

        const countKey = abuseKey.key('count', 'http-error', i, ip);
        const count = await bumpCount(countKey, parseDuration(strategy.window));
        if (count < strategy.limit) continue;

        await ensureBlocked(ip, 'http-error', {
          count,
          limit: strategy.limit,
          blockFor: parseDuration(strategy.blockFor),
        });
      }

      if (thrown) throw thrown;
    });
  };

  const socket = (socketOptions: AbuseSocketOptions = {}): SocketMiddleware => {
    // 调用方须先 import '@aomex/websocket'，以注册 middleware.socket
    const socketBypass = socketOptions.bypass ?? (() => false);
    const blockedMessage = () => socketOptions.errorMessage || i18n.t('blocked');

    return middleware.socket(async (ctx: WebsocketContext, next) => {
      await ensureReady();
      if (await socketBypass(ctx)) return next();

      const ip = ctx.client.request.ip;

      if (await caching.exists(getBlockKey(ip))) {
        await ctx.client.send('error', { message: blockedMessage() });
        return;
      }

      for (let i = 0; i < socketEventsStrategies.length; i += 1) {
        const strategy = socketEventsStrategies[i]!;
        if (!matchAnyEvent(ctx.event, strategy.events)) continue;

        const countKey = abuseKey.key('count', 'socket-events', i, ip);
        const count = await bumpCount(countKey, parseDuration(strategy.window));
        if (count < strategy.limit) continue;

        await ensureBlocked(ip, 'socket-events', {
          count,
          limit: strategy.limit,
          blockFor: parseDuration(strategy.blockFor),
        });
        await ctx.client.send('error', { message: blockedMessage() });
        return;
      }

      return next();
    });
  };

  return {
    ...api,
    web,
    socket,
  } as AbuseService<InferUserAbuseReasons<S>, InferIpAbuseReasons<S>>;
};

import http from 'node:http';
import https from 'node:https';
import stream from 'node:stream';
import { WebRequest } from './request';
import { WebResponse } from './response';
import {
  I18n,
  Middleware,
  compose,
  ensureI18nLanguage,
  resolveI18nLanguage,
  internalDestroyServices,
  middleware,
  type CombinedServices,
  type I18nLanguage,
  type PromisifiedService,
} from '@aomex/common';
import type { BaseLoggerService } from '@aomex/logger';
import { WebContext } from './context';
import type { HttpError } from '../utils';
import type { WebMiddlewareToken } from '../override';
import { toArray, type Union2Intersection } from '@aomex/internal-tools';
import { parseBody } from '../middleware/parse-body';

export namespace WebApp {
  export type Logger = PromisifiedService<BaseLoggerService>;

  export interface Option<T extends WebMiddlewareToken[] | []> {
    /**
     * 全局中间件
     *
     * ```typescript
     * const app = new WebApp({
     *   services,
     *   logger: services.logger,
     *   language: { mode: 'fixed', language: 'zh-CN' },
     *   proxyIP: { mode: 'detect' },
     *   mount: [md1, md2],
     * });
     *
     * declare module '@aomex/web' {
     *   namespace WebApp {
     *     type T = WebApp.Infer<typeof app>;
     *     interface Props extends T {}
     *   }
     * }
     * ```
     */
    mount?: T;
    /**
     * `combineServices` 的返回值（单个或数组）。
     * 关停：SIGINT/SIGTERM → `server.close()` → 再 await 销毁已加载服务。
     */
    services: CombinedServices | readonly CombinedServices[];
    /**
     * 经 `combineServices` 处理后的 logger（通常为 `services.logger`）。
     * 默认 `error` 监听 / `ctx.logger` 均走此实例。
     *
     * ```ts
     * const services = await combineServices(
     *   { logger: () => import('./logger.service.js') },
     *   { eager: ['logger'] },
     * );
     * new WebApp({
     *   services,
     *   logger: services.logger,
     *   language: { mode: 'fixed', language: 'zh-CN' },
     *   proxyIP: { mode: 'detect' },
     * });
     * ```
     */
    logger: Logger;
    /**
     * 语言。
     *
     * - `mode: 'fixed'`：整站固定为 `language`（内置规范码，如 `zh-CN`）。
     * - `mode: 'dynamic'`：按请求头协商。`zh_CN`、`zh-cn` 等别名会归一到规范码；都不中则用必填的 `fallback`。
     *
     * ```ts
     * language: { mode: 'fixed', language: 'zh-CN' }
     * language: { mode: 'dynamic', fallback: 'zh-CN' }
     * language: { mode: 'dynamic', header: 'x-language', fallback: 'en-US' }
     * ```
     */
    language: LanguageOption;
    /**
     * 客户端 IP 解析（`ctx.request.ip`）。
     *
     * - `mode: 'detect'`：探测 `X-Forwarded-For` / `X-Real-IP` / `CF-Connecting-IP` 等常见头
     *   （可被伪造，适合本地/测试）。
     * - `mode: 'specify'`：按 `header` / `hops` 严格取值（生产推荐）。
     *
     * ```ts
     * proxyIP: { mode: 'detect' }
     * proxyIP: { mode: 'specify', header: 'x-forwarded-for', hops: 1 }
     * ```
     */
    proxyIP: ProxyIPOption;
  }

  export type LanguageOption =
    | {
        mode: 'fixed';
        /** 固定使用的语言。 */
        language: I18nLanguage;
      }
    | {
        mode: 'dynamic';
        /**
         * 读取的请求头。默认 `accept-language`。
         * `accept-language` 按 q 值排序；其它头按逗号分隔、忽略 q。
         */
        header?: string;
        /** 请求头缺失或无法匹配时的语言。 */
        fallback: I18nLanguage;
      };

  export type ProxyIPOption =
    | {
        /** 探测常见代理头（可被伪造）。 */
        mode: 'detect';
      }
    | {
        /** 按指定头与代理层数严格解析。 */
        mode: 'specify';
        /**
         * 读取的代理 IP 头。
         */
        header:
          | 'x-forwarded-for'
          | 'x-real-ip'
          | 'forwarded'
          | 'cf-connecting-ip'
          | 'fastly-client-ip'
          | 'true-client-ip'
          | 'x-cluster-client-ip'
          | 'x-appengine-user-ip'
          | (string & {});
        /**
         * 前置反向代理层数。
         * - `=0`：忽略代理头，`request.ip` 等于 `socket.remoteAddress`
         *   （直连客户端；若经反向代理则多为代理本机 IP）
         * - `>0`：从代理头右侧截取 n 段，再取其中最左的合法 IP（防 `X-Forwarded-For` 左侧伪造）
         *
         * 场景举例：
         * - `0`：本机直连 / 强制不信代理头
         * - `1`：单层 Nginx/Caddy（`proxy_add_x_forwarded_for` 追加）
         * - `2`：Cloudflare + Nginx 两层追加（CF 先写，Nginx 再 `proxy_add_x_forwarded_for`）
         * - `1` + `header: 'cf-connecting-ip'`：Cloudflare + Nginx，且 Nginx 透传
         *   `CF-Connecting-IP`（只信任该头，避免读到节点 IP）
         * - `1` + `header: 'x-real-ip'`：反向代理覆盖写入
         *   （如 `proxy_set_header X-Real-IP $remote_addr`）
         */
        hops: number;
      };

  export type Infer<T> =
    T extends WebApp<infer U>
      ? U extends any[]
        ? Union2Intersection<Middleware.CollectArrayType<U[number]>>
        : unknown
      : unknown;

  export interface Props {}
}

export class WebApp<
  T extends WebMiddlewareToken[] | [] = any[],
> extends stream.EventEmitter<{
  error: [err: HttpError, ctx: WebContext & WebApp.Props];
}> {
  protected readonly middlewareList: WebMiddlewareToken[];
  protected readonly logger: WebApp.Logger;

  constructor(protected readonly options: WebApp.Option<T>) {
    super();
    this.middlewareList = [];
    this.middlewareList = options.mount || [];
    this.logger = options.logger;
  }

  /**
   * `fixed` 直接返回配置语言；`dynamic` 从请求头协商。
   */
  protected resolveLanguage(ctx: WebContext): string {
    const option = this.options.language;
    if (option.mode === 'fixed') return option.language;

    const headerName = (option.header ?? 'accept-language').toLowerCase();
    const accepted =
      headerName === 'accept-language'
        ? ctx.request.accept.languages()
        : this.readLanguageHeader(ctx, headerName);
    const tags = Array.isArray(accepted) ? accepted : [];

    for (const tag of tags) {
      if (!tag || tag === '*') continue;
      const resolved = resolveI18nLanguage(tag);
      if (resolved) return resolved;
    }
    return option.fallback;
  }

  protected readLanguageHeader(ctx: WebContext, name: string): string[] {
    const raw = ctx.request.headers[name];
    if (!raw) return [];
    const value = Array.isArray(raw) ? raw.join(',') : raw;
    return value
      .split(',')
      .map((part) => part.split(';')[0]?.trim() ?? '')
      .filter((tag) => tag.length > 0);
  }

  protected bindServerLifecycle(server: http.Server | https.Server): void {
    const services = toArray(this.options.services);

    // 手动 close：尽量跑完 onDestroy（不 exit）
    server.once('close', () => {
      void internalDestroyServices(services);
    });

    // 信号：先关 server，再 await 销毁，最后 exit，避免异步 onDestroy 被掐断
    const stop = () => {
      void (async () => {
        await new Promise<void>((resolve) => {
          server.close(() => resolve());
        });
        await internalDestroyServices(services);
        process.exit(0);
      })();
    };
    process.once('SIGTERM', stop);
    process.once('SIGINT', stop);
  }

  callback(): http.RequestListener<any, any> {
    const fn = compose([
      middleware.mixin(async (ctx: WebContext, next) => {
        const language = this.resolveLanguage(ctx);
        await ensureI18nLanguage(language);
        return I18n.provider(language, next);
      }),
      parseBody(),
      ...this.middlewareList,
    ]);

    // 至少需要监听一个，否则emit会报错
    if (!this.listenerCount('error')) {
      this.on('error', (err) => {
        if (err.expose) return;
        void this.logger.error(err);
      });
    }

    return (req: WebRequest, res: WebResponse) => {
      return fn(new WebContext(this, req, res))
        .then(res.flush)
        .catch(res.onError);
    };
  }

  /**
   * 监听http服务
   * ```typescript
   * app.listen(3000);
   * ```
   */
  listen: http.Server['listen'] = (...args: any[]) => {
    return this.http({}).listen(...args);
  };

  /**
   * 监听http服务，可定制参数
   * ```typescript
   * app.http({...}).listen(3000);
   * ```
   */
  http(options: Omit<http.ServerOptions, 'IncomingMessage' | 'ServerResponse'>) {
    const server = http.createServer(
      {
        ...options,
        IncomingMessage: WebRequest,
        ServerResponse: WebResponse,
      },
      this.callback(),
    );
    this.bindServerLifecycle(server);
    return { listen: server.listen.bind(server) };
  }

  /**
   * 监听https服务，需提供证书
   * ```typescript
   * app.https({...}).listen(3000);
   * ```
   */
  https(options: Omit<https.ServerOptions, 'IncomingMessage' | 'ServerResponse'>) {
    const server = https.createServer(
      {
        ...options,
        IncomingMessage: WebRequest,
        ServerResponse: WebResponse,
      },
      this.callback(),
    );
    this.bindServerLifecycle(server);
    return { listen: server.listen.bind(server) };
  }
}

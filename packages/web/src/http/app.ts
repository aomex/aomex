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
import { parseBody, type ParseBodyOptions } from '../middleware/parse-body';
import type { EnvelopeOptions } from './envelope';
import { createEnvelopeMiddleware } from '../middleware/envelope';

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
     * 响应体套壳：在 `flush` 写出前包进声明结构，固定 HTTP `200`。
     * 成功与错误（含无 `formatError` 的默认纯文本）都经 `flush` 统一套壳。
     * 单次响应可设 `ctx.response.skipEnvelope = true` 跳过（如文档页、裸 OpenAPI JSON）。
     *
     * ```ts
     * import { envelope } from '@aomex/web';
     *
     * new WebApp({
     *   envelope: {
     *     content: {
     *       success: envelope.success,
     *       data: envelope.payload,
     *       statusCode: envelope.statusCode,
     *     },
     *   },
     *   mount: [formatError({ ... })],
     *   // ...
     * });
     * ```
     */
    envelope?: EnvelopeOptions;
    /**
     * `combineServices` 的返回值（单个或数组）。
     * 关停：SIGINT/SIGTERM → {@link WebApp.onShutdown} 钩子与 `server.close()` 并行 → 再 await 销毁已加载服务。
     */
    services: CombinedServices | readonly CombinedServices[];
    /**
     * 优雅关停：`SIGINT`/`SIGTERM` → {@link WebApp.onShutdown}（与 `close` 并行）→
     * 超时则强制断开 → 服务/`registerLifecycle` 销毁 → 退出。
     * @default { timeout: 5_000 }
     */
    shutdown?: ShutdownOption;
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
    /**
     * 请求体解析限制。
     *
     * - `payload`：json / urlencoded / text（整包进内存）
     * - `formData`：`multipart/form-data`（与路由 `body()` 取更严）
     *
     * ```ts
     * body: {
     *   payload: { maxSize: '2mb' },
     *   formData: {
     *     maxFileSize: '20mb',
     *     maxFiles: 10,
     *     maxFields: 100,
     *   },
     * }
     * ```
     */
    body?: ParseBodyOptions;
  }

  export interface ShutdownOption {
    /**
     * 等待在途请求结束的上限（毫秒）。超时后 `closeAllConnections`。
     * @default 5000
     */
    timeout?: number;
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
  /** 关停前半段钩子（与 `server.close` 并行）；如 `WebsocketApp.attach` 登记的排空 */
  protected readonly shutdownHooks = new Set<() => void | Promise<void>>();
  /** 本应用创建的 HTTP(S) Server；多次 `http()` / `https()` 共用一次信号关停 */
  protected readonly servers = new Set<http.Server | https.Server>();
  protected processSignalsBound = false;
  /** 信号关停进行中：`close` 回调不再销毁服务 */
  protected shuttingDown = false;

  constructor(protected readonly options: WebApp.Option<T>) {
    super();
    // envelope 插在最外层：运行时空转；OpenAPI 靠 postMethod 倒序收口
    this.middlewareList = options.envelope
      ? [createEnvelopeMiddleware(options.envelope), ...(options.mount ?? [])]
      : [...(options.mount ?? [])];
    this.logger = options.logger;
  }

  /**
   * 登记关停前半段钩子：与 `server.close()` 并行，在 `closeAllConnections` 前尽量跑完。
   * 用于 WebSocket 停握手、按协议关连等；不要在此释放在途 HTTP 仍依赖的存储（那是 `registerLifecycle` / services 的 `onDestroy`）。
   *
   * @returns 取消登记
   *
   * ```ts
   * const off = app.onShutdown(async () => {
   *   await drainWebsocket();
   * });
   * ```
   */
  onShutdown(hook: () => void | Promise<void>): () => void {
    this.shutdownHooks.add(hook);
    return () => {
      this.shutdownHooks.delete(hook);
    };
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

  /**
   * 并行执行关停钩子。单个钩子 reject 只记日志，不中断其余钩子，也不阻止后续销毁与退出。
   * @returns 是否有钩子失败
   */
  protected async runShutdownHooks(): Promise<boolean> {
    const results = await Promise.allSettled(
      [...this.shutdownHooks].map((hook) => Promise.resolve().then(hook)),
    );
    let failed = false;
    for (const result of results) {
      if (result.status === 'rejected') {
        failed = true;
        void this.logger.error(result.reason);
      }
    }
    return failed;
  }

  protected bindServerLifecycle(server: http.Server | https.Server): void {
    this.servers.add(server);
    // 手动关掉最后一个 Server 才销毁服务；信号路径由 shutdownServers 统一销毁
    server.once('close', () => {
      this.servers.delete(server);
      if (this.shuttingDown || this.servers.size > 0) return;
      void internalDestroyServices(toArray(this.options.services)).catch((err) => {
        void this.logger.error(err);
      });
    });

    if (this.processSignalsBound) return;
    this.processSignalsBound = true;
    process.once('SIGTERM', this.shutdownServers.bind(this));
    process.once('SIGINT', this.shutdownServers.bind(this));
  }

  /**
   * 信号关停：钩子与全部 Server 的 `close` 并行，全部结束后再销毁服务并退出。
   */
  protected async shutdownServers(): Promise<void> {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    const timeout = Math.max(0, this.options.shutdown?.timeout ?? 5_000);
    const shutdownPromise = this.runShutdownHooks();
    await Promise.all(
      [...this.servers].map(
        (server) =>
          new Promise<void>((resolve) => {
            const forceTimer = setTimeout(() => {
              server.closeAllConnections();
            }, timeout);
            server.close(() => {
              clearTimeout(forceTimer);
              resolve();
            });
          }),
      ),
    );
    try {
      await shutdownPromise;
      await internalDestroyServices(toArray(this.options.services));
    } catch (err) {
      void this.logger.error(err);
    } finally {
      process.exit(0);
    }
  }

  callback(): http.RequestListener<any, any> {
    const fn = compose([
      middleware.web(async (ctx, next) => {
        const language = this.resolveLanguage(ctx);
        await ensureI18nLanguage(language);
        return I18n.provider(language, next);
      }),
      parseBody(this.options.body),
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
   * 创建 HTTP Server（未 listen）。可交给同级应用（如 `WebsocketApp.attach`）再 `server.listen`。
   * ```typescript
   * const server = app.http({});
   * server.listen(3000);
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
    return server;
  }

  /**
   * 创建 HTTPS Server（未 listen），需提供证书。
   * ```typescript
   * const server = app.https({ ...certs });
   * server.listen(3000);
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
    return server;
  }
}

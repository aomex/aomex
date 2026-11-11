import http from 'node:http';
import https from 'node:https';
import stream from 'node:stream';
import { WebRequest } from './request';
import { WebResponse } from './response';
import {
  I18n,
  Middleware,
  compose,
  internalDestroyServices,
  middleware,
  type CombinedServices,
} from '@aomex/common';
import { WebContext } from './context';
import type { HttpError } from 'http-errors';
import { EOL } from 'node:os';
import type { WebMiddlewareToken } from '../override';
import { styleText } from 'node:util';
import { toArray, type Union2Intersection } from '@aomex/internal-tools';
import { parseBody } from '../middleware/parse-body';

export namespace WebApp {
  export interface Option<T extends WebMiddlewareToken[] | []> {
    /**
     * 调试模式。默认值：`process.env.NODE_ENV !== 'production'`
     *
     * 如果开启，则`5xx`异常会响应真实的错误信息。
     */
    debug?: boolean;
    /**
     * 全局中间件
     *
     * ```typescript
     * const app = new WebApp({
     *   mount: [md1, md2]
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
     * `combineServices` 的返回值（单个或数组）。传入后在 HTTP(S) 关停时自动 `onDestroy`：
     * SIGINT/SIGTERM → `server.close()` → 再 await 销毁已加载服务。
     */
    services?: CombinedServices | readonly CombinedServices[];
    language?: 'zh_CN' | 'en_US' | (string & {});
  }

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
  protected readonly point?: string;
  protected readonly middlewareList: WebMiddlewareToken[];

  constructor(protected readonly options: WebApp.Option<T> = {}) {
    super();
    this.middlewareList = [];
    this.middlewareList = options.mount || [];
  }

  protected bindServerLifecycle(server: http.Server | https.Server): void {
    const services = this.options.services ? toArray(this.options.services) : [];
    if (!services.length) return;

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

  get debug(): boolean {
    return this.options.debug ?? process.env['NODE_ENV'] !== 'production';
  }

  callback(): http.RequestListener<any, any> {
    const fn = compose([
      middleware.mixin((_, next) => {
        return this.options.language
          ? I18n.provider(this.options.language, next)
          : next();
      }),
      parseBody(),
      ...this.middlewareList,
    ]);

    // 至少需要监听一个，否则emit会报错
    if (!this.listenerCount('error')) {
      this.on('error', this.log.bind(this));
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

  log(err: HttpError, ctx: WebContext) {
    if (ctx.response.statusCode === 404 || err.expose) return;
    const msgs = (err.stack || err.toString()).split(EOL);
    console.error(['', styleText('bgRed', msgs.shift()!), msgs.join(EOL), ''].join(EOL));
  }
}

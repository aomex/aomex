import http from 'node:http';
import https from 'node:https';
import stream from 'node:stream';
import { WebRequest } from './request';
import { WebResponse } from './response';
import { I18n, Middleware, compose, i18n } from '@aomex/core';
import { WebContext } from './context';
import type { HttpError } from 'http-errors';
import { EOL } from 'node:os';
import type { WebMiddlewareToken } from '../override';
import { styleText } from 'node:util';
import type { Union2Intersection } from '@aomex/internal-tools';
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
    locale?: I18n.LocaleName;
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
    i18n.setLocale(options.locale || 'zh_CN');
    this.middlewareList = options.mount || [];
  }

  get debug(): boolean {
    return this.options.debug ?? process.env['NODE_ENV'] !== 'production';
  }

  callback(): http.RequestListener<any, any> {
    const fn = compose([parseBody(), ...this.middlewareList]);

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

    return { listen: server.listen.bind(server) };
  }

  log(err: HttpError, ctx: WebContext) {
    if (ctx.response.statusCode === 404 || err.expose) return;
    const msgs = (err.stack || err.toString()).split(EOL, 2);
    console.error(['', styleText('bgRed', msgs.shift()!), msgs.join(EOL), ''].join(EOL));
  }
}

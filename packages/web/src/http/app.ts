import http from 'node:http';
import https from 'node:https';
import stream from 'node:stream';
import { WebRequest } from './request';
import { WebResponse } from './response';
import {
  I18n,
  Middleware,
  MixinMiddlewareChain,
  compose,
  flattenMiddlewareToken,
  i18n,
} from '@aomex/core';
import { WebContext } from './context';
import type { HttpError } from 'http-errors';
import { EOL } from 'node:os';
import type { WebMiddlewareChain } from '../override';
import { styleText } from 'node:util';

export interface WebAppOption {
  /**
   * 调试模式。默认值：`process.env.NODE_ENV !== 'production'`
   */
  debug?: boolean;
  /**
   * 全局中间件组，挂载后该组会被打上标记。
   * ```typescript
   * const appChain = mdchain.web.mount(md1).mount(md2);
   * const chain1 = appChain.mount(md3);
   * const chain2 = chain1.mount(md4);
   *
   * const app = new WebApp({ box: appChain });
   * ```
   */
  mount?: WebMiddlewareChain | MixinMiddlewareChain;
  locale?: I18n.LocaleName;
}

export class WebApp extends stream.EventEmitter<{
  error: [err: HttpError, ctx: WebContext];
}> {
  protected readonly point?: string;
  protected readonly middlewareList: Middleware[];

  constructor(protected readonly options: WebAppOption = {}) {
    super();
    this.middlewareList = [];
    if (options.locale) {
      i18n.setLocale(options.locale);
    }
    if (options.mount) {
      this.point = options.mount['createPoint']();
      this.middlewareList = flattenMiddlewareToken(options.mount);
    }
  }

  get debug(): boolean {
    return this.options.debug ?? process.env['NODE_ENV'] !== 'production';
  }

  callback(): http.RequestListener<any, any> {
    const fn = compose(this.middlewareList);

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

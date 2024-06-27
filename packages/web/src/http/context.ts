import createHttpError from 'http-errors';
import type { WebApp } from './app';
import type { WebRequest } from './request';
import type { Body, WebResponse } from './response';

export class WebContext {
  readonly redirect: WebResponse['redirect'];
  readonly download: WebResponse['download'];

  constructor(
    readonly app: WebApp,
    readonly request: WebRequest,
    readonly response: WebResponse,
  ) {
    request.app = response.app = app;
    request.res = response.res = response;
    request.req = response.req = request;
    request.ctx = response.ctx = this;

    this.redirect = response.redirect.bind(response);
    this.download = response.download.bind(response);
  }

  /**
   * 发送响应内容和状态，包含字符串，对象，数据流，缓冲区等。
   * ```typescript
   * ctx.send(200, 'hello aomex');
   * ctx.send({ count: 1 });
   * ```
   */
  send(statusCode: number, body?: Body): void;
  send(body: Body): void;
  send(statusOrBody: number | Body, body?: Body) {
    if (typeof statusOrBody === 'number') {
      this.response.statusCode = statusOrBody;
    } else {
      body = statusOrBody;
    }

    if (body !== void 0) {
      this.response.body = body;
    }
  }

  /**
   * 抛出Http请求异常
   *
   * ```typescript
   *    ctx.throw(403);
   *    ctx.throw(400, 'name required');
   *    ctx.throw(400, new Error('invalid'));
   *    ctx.throw(500, new Error('server error'), { expose: true });
   * ```
   * @link https://github.com/jshttp/http-errors
   * @throws {HttpError}
   * @see createHttpError.HttpError
   *
   */
  throw(
    statusCode: number,
    message?: string | Error,
    properties?: HttpErrorProperties,
  ): never;
  throw(err: Error, properties?: HttpErrorProperties): never;
  throw(statusCode: number, properties?: HttpErrorProperties): never;
  throw(arg: any, ...args: any[]) {
    throw createHttpError(arg, ...args);
  }
}

export interface HttpErrorProperties {
  expose?: boolean;
  statusCode?: number;
  code?: string;
  headers?: Record<string, any>;
  cause?: any;
  [key: string]: any;
}

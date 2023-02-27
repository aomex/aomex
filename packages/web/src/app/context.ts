import createHttpError from 'http-errors';
import type { WebApp } from './app';
import type { WebRequest } from './request';
import type { Body, WebResponse } from './response';

export class WebContext {
  constructor(
    readonly app: WebApp,
    readonly request: WebRequest,
    readonly response: WebResponse,
  ) {
    request.app = response.app = app;
    request.res = response;
    request.ctx = response.ctx = this;
  }

  send(statusCode: number, body?: Body): this;
  send(body: Body): this;
  send(statusOrBody: number | Body, body?: Body): this {
    if (typeof statusOrBody === 'number') {
      this.response.statusCode = statusOrBody;
    } else {
      body = statusOrBody;
    }

    if (body !== void 0) {
      this.response.body = body;
    }

    return this;
  }

  /**
   * Throw a http error
   *
   * ```typescript
   *    ctx.throw(403)
   *    ctx.throw('name required', 400)
   *    ctx.throw(400, 'name required')
   *    ctx.throw('something exploded')
   *    ctx.throw(new Error('invalid'), 400);
   *    ctx.throw(400, new Error('invalid'));
   * ```
   * @link https://github.com/jshttp/http-errors
   * @throws {HttpError}
   * @see createHttpError.HttpError
   *
   */
  throw(statusCode: number, message?: string | Error, properties?: {}): never;
  throw(message: string | Error, statusCode?: number, properties?: {}): never;
  throw(arg: any, ...properties: Array<number | string | {}>): never;
  throw(arg: any, ...args: any[]): never {
    throw createHttpError(arg, ...args);
  }
}

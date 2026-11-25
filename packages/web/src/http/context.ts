import type { Logger } from '@aomex/logger';
import type { WebApp } from './app';
import type { WebRequest } from './request';
import type { Body, WebResponse } from './response';
import { HttpError, type HttpErrorProperties } from '../utils';
import type { HttpErrorStatus } from '../middleware/response-media';

export class WebContext {
  readonly redirect: WebResponse['redirect'];
  readonly download: WebResponse['download'];
  readonly sse: WebResponse['sse'];

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
    this.sse = response.sse.bind(response);
  }

  /** 与构造时传入的 `logger` 相同，取自 app */
  get logger(): Logger {
    return this.app['logger'];
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
   * 抛出 HTTP 请求异常（必须指定 4xx/5xx 状态码）
   *
   * ```typescript
   *    ctx.throw(403);
   *    ctx.throw(400, 'name required');
   *    ctx.throw(400, new Error('invalid'));
   *    ctx.throw(500, 'server error', { expose: true });
   *    ctx.throw(404, { code: 'USER_NOT_FOUND' });
   * ```
   * @throws {HttpError}
   */
  throw(statusCode: HttpErrorStatus): never;
  throw(
    statusCode: HttpErrorStatus,
    message?: string | Error,
    properties?: HttpErrorProperties,
  ): never;
  throw(statusCode: HttpErrorStatus, properties: HttpErrorProperties): never;
  throw(
    statusCode: HttpErrorStatus,
    messageOrProperties?: string | Error | HttpErrorProperties,
    properties?: HttpErrorProperties,
  ): never {
    if (messageOrProperties instanceof Error) {
      const foreign = Object.assign(new Error(messageOrProperties.message), {
        statusCode,
        status: statusCode,
        name: messageOrProperties.name,
        stack: messageOrProperties.stack,
        cause: properties?.cause ?? messageOrProperties,
        ...properties,
      });
      throw HttpError.from(foreign);
    }
    if (messageOrProperties !== undefined && typeof messageOrProperties === 'object') {
      throw new HttpError(statusCode, undefined, messageOrProperties);
    }
    throw new HttpError(statusCode, messageOrProperties, properties);
  }
}

import { ServerResponse, type IncomingMessage } from 'node:http';
import type { WebApp } from './app';
import assert from 'node:assert';
import statuses from 'statuses';
import { Stream } from 'node:stream';
import { getMimeType } from '../utils/get-mime-type';
import type {
  UpperStringHeaderKeys,
  UpperArrayHeaderKeys,
  UpperHeaderKeys,
} from './header';
import stream from 'stream';
import destroy from 'destroy';
import createHttpError, { type HttpError, isHttpError } from 'http-errors';
import type { WebContext } from './context';
import type { WebRequest } from './request';
import contentDisposition from 'content-disposition';
import { extname } from 'node:path';
import { createReadStream } from 'node:fs';
import vary from 'vary';
import typeIs from 'type-is';
import type { OutgoingHttpHeaders } from 'node:http';
import cookie, { type CookieSerializeOptions } from 'cookie';
import { MIMEType } from 'node:util';
import { i18n } from '@aomex/core';

export type Body = string | object | Stream | Buffer | null;
export type BodyType = 'string' | 'json' | 'stream' | 'buffer' | 'null';

export class WebResponse extends ServerResponse {
  app!: WebApp;
  res!: ServerResponse;
  ctx!: WebContext;

  declare req: WebRequest;
  declare statusCode: number;
  declare statusMessage: string;

  private _body: Body = null;
  private _bodyType: BodyType = 'null';
  private _jsonString: string = '';
  /**
   * 是否明确设置过内容
   */
  private _explicitBody: boolean = false;
  /**
   * 是否明确设置过状态码
   */
  private _explicitStatus = false;
  private _statusCode: number = 404;
  private _updatingContentType: boolean = false;

  constructor(req: IncomingMessage) {
    super(req);

    // 父类的statusCode无法覆盖，只能用这种方式hack
    Object.defineProperty(this, 'statusCode', {
      get: (): number => {
        return this._statusCode;
      },
      set: (code: number) => {
        this.setStatus(code);
      },
    });

    this.onError = this.onError.bind(this);
    this.flush = this.flush.bind(this);
  }

  get contentLength(): number {
    const length = this.getHeader('Content-Length');
    return length ? Number(length) : 0;
  }

  set contentLength(length: number) {
    if (!this.hasHeader('Transfer-Encoding')) {
      this.setHeader('Content-Length', length);
    }
  }

  get contentType(): string {
    try {
      const contentType = this.getHeader('Content-Type');
      if (!contentType) return '';
      const mime = new MIMEType(contentType);
      return mime.essence;
    } catch {
      return '';
    }
  }

  set contentType(typeOrFilenameOrExt: string) {
    const mimeType = getMimeType(typeOrFilenameOrExt);
    const msg = `不合法的类型：'${typeOrFilenameOrExt}'`;
    if (!mimeType) throw new TypeError(msg);
    this.setHeader('Content-Type', mimeType);
    this.updateContentType();
  }

  get body(): Body {
    return this._body;
  }

  set body(val: Body) {
    val = this._body = val == null ? null : val;
    this._explicitBody = true;
    this._bodyType = this.getBodyType(val);
    if (this._bodyType === 'json') {
      this._jsonString = JSON.stringify(val);
    }

    // 未设置状态码时，需要自动设置（默认状态为404）
    if (!this._explicitStatus) {
      this.statusCode = 200;
    }
    this.updateContentType();
  }

  download(filePath: string, options: contentDisposition.Options = {}): void {
    this.contentType = extname(filePath);
    this.setHeader('content-disposition', contentDisposition(filePath, options));
    this.body = createReadStream(filePath);
  }

  declare getHeader: {
    (name: UpperStringHeaderKeys): string | undefined;
    (name: UpperArrayHeaderKeys): string[] | undefined;
    (name: string): string | string[] | undefined;
  };

  declare getHeaderNames: () => (
    | UpperStringHeaderKeys
    | UpperArrayHeaderKeys
    | (string & {})
  )[];

  declare getHeaders: () => OutgoingHttpHeaders;

  flush(): void {
    if (!this.writable || this.headersSent) return;

    // null需要转换成字符串
    if (this.body === null) {
      if (this.contentType === 'application/json') {
        this.body = String(null);
      } else if (this._explicitBody) {
        this.body = '';
      } else {
        // 如果用户没有设置过status，则设置body的时候会修改为200。默认status == 404
        this.statusCode = this.statusCode;
        this.body = String(this.statusMessage || statuses.message[this.statusCode]);
      }
    }

    const { _bodyType } = this;

    if (statuses.empty[this.statusCode]) return void this.end();
    if (this.req.method === 'HEAD') return void this.end();
    if (_bodyType === 'json') return void this.end(this._jsonString);
    if (_bodyType === 'string') return void this.end(this.body);
    if (_bodyType === 'buffer') return void this.end(this.body);
    if (_bodyType === 'stream') {
      const output = this.body as stream;
      if (!output.listenerCount('error')) {
        output.once('error', this.onError);
      }
      stream.finished(this, () => {
        destroy(output);
      });
      return void output.pipe(this);
    }
  }

  declare hasHeader: (
    name: UpperStringHeaderKeys | UpperArrayHeaderKeys | (string & {}),
  ) => boolean;

  isJSON(value: Body): value is object {
    return value === this.body
      ? this._bodyType === 'json'
      : this.getBodyType(value) === 'json';
  }

  matchContentType(type: string, ...types: string[]): string | null {
    const result = typeIs.is(this.contentType, type, ...types);
    return result === false ? null : result;
  }

  onError(error?: Error | HttpError | null) {
    if (error == null) return;

    const err = isHttpError(error) ? error : createHttpError(error);
    this.removeHeaders(...this.getHeaderNames());
    err.headers && this.setHeaders(err.headers);

    const code = err.status || err.statusCode;
    if (err['code'] === 'ENOENT') {
      this.statusCode = 404;
    } else if (typeof code !== 'number' || !statuses.message[code]) {
      this.statusCode = 500;
    } else {
      this.statusCode = code;
    }

    this.body = err.expose ? err.message : statuses.message[this.statusCode]!;
    this.app.emit('error', err, this.ctx);
    this.flush();
  }

  redirect(url: string): void;
  redirect(statusCode: 300 | 301 | 302 | 303 | 305 | 307 | 308, url: string): void;
  redirect(status: number | string, url?: string): void {
    url = typeof url === 'string' ? url : status.toString();
    this.statusCode = typeof status === 'string' ? 302 : status;
    const href = new URL(url).href;
    this.setHeader('location', href);

    if (this.req.accept.types('text/html')) {
      this.contentType = 'text/html';
      this.body = i18n.t('web.response.redirect', {
        url: `<a href="${href}">${url
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;')}</a>`,
      });
    } else {
      this.contentType = 'text/plain';
      this.body = i18n.t('web.response.redirect', { url });
    }
  }

  removeCookie(name: string, options?: Pick<CookieSerializeOptions, 'path'>) {
    return this.setCookie(name, '', {
      ...options,
      maxAge: undefined,
      expires: new Date(0),
    });
  }

  declare removeHeader: (
    name: UpperStringHeaderKeys | UpperArrayHeaderKeys | (string & {}),
  ) => void;

  removeHeaders(
    ...headers: ((string & {}) | UpperStringHeaderKeys | UpperArrayHeaderKeys)[]
  ): void {
    headers.forEach(this.removeHeader.bind(this));
  }

  setCookie(name: string, value: string, options?: CookieSerializeOptions) {
    const cookies = this.getHeader('Set-Cookie') || [];
    cookies.push(
      cookie.serialize(name, value, {
        path: '/',
        sameSite: true,
        httpOnly: true,
        secure: this.req.secure,
        ...options,
      }),
    );
    this.setHeader('Set-Cookie', cookies);
  }

  declare setHeader: {
    <T extends WebResponse>(name: UpperStringHeaderKeys, value: number | string): T;
    <T extends WebResponse>(name: UpperArrayHeaderKeys, value: readonly string[]): T;
    <T extends WebResponse>(name: string, value: number | string | readonly string[]): T;
  };

  setHeaders(
    headers: {
      [K: string]: string | number | readonly string[];
    } & { [K in UpperStringHeaderKeys]?: string | number } & {
      [K in UpperArrayHeaderKeys]?: readonly string[];
    },
  ): void {
    for (const [key, value] of Object.entries(headers)) {
      value !== void 0 && this.setHeader(key, value);
    }
  }

  vary(
    field: UpperHeaderKeys | UpperHeaderKeys[] | (string & {}) | (string & {})[],
  ): string {
    vary(this, field);
    return this.getHeader('Vary')!;
  }

  protected setStatus(code: number) {
    assert(code >= 100 && code <= 999);
    this._statusCode = code;
    this._explicitStatus = true;
    this.statusMessage = String(statuses.message[code] || code);
    if (statuses.empty[code]) {
      this.body = null;
    } else {
      // 如果先设置body再设置的status，则header可能不准确，需要重新设置
      this.updateContentType();
    }
  }

  protected updateContentType(): void {
    if (this._updatingContentType) return;
    this._updatingContentType = true;

    const { _bodyType } = this;
    const missType = !this.hasHeader('Content-Type');

    if (_bodyType === 'json') {
      this.contentLength = Buffer.byteLength(this._jsonString);
      if (missType) {
        this.contentType = 'application/json';
      }
    } else if (_bodyType === 'string') {
      const body = this.body as string;
      this.contentLength = Buffer.byteLength(body);
      if (missType) {
        this.contentType = /^\s*</.test(body) ? 'text/html' : 'text/plain';
      }
    } else if (_bodyType === 'null') {
      if (statuses.empty[this.statusCode]) {
        // 设置空状态码
        this.removeHeaders('Content-Type', 'Content-Length', 'Transfer-Encoding');
      } else if (this.contentType === 'application/json') {
        this.contentLength = Buffer.byteLength(String(null));
      } else {
        // 业务未处理完，不能改变body的值，等 flush() 响应时处理
      }
    } else if (_bodyType === 'buffer') {
      const body = this.body as Buffer;
      this.contentLength = body.length;
      if (missType) {
        this.contentType = 'application/octet-stream';
      }
    } else if (_bodyType === 'stream') {
      if (missType) {
        this.contentType = 'application/octet-stream';
      }
    }

    this._updatingContentType = false;
  }

  protected getBodyType(body: Body): BodyType {
    if (body == null) return 'null';
    if (typeof body === 'string') return 'string';
    if (Buffer.isBuffer(body)) return 'buffer';
    if (body instanceof Stream) return 'stream';
    return 'json';
  }
}

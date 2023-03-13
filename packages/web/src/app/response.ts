import { ServerResponse } from 'node:http';
import stream, { Stream } from 'node:stream';
import assert from 'node:assert';
import statuses from 'statuses';
import escapeHtml from 'escape-html';
import encodeUrl from 'encodeurl';
import destroy from 'destroy';
import contentDisposition from 'content-disposition';
import createHttpError, { type HttpError, isHttpError } from 'http-errors';
import type { WebApp } from './app';
import type { WebContext } from './context';
import type {
  UpperHeaderKeys,
  UpperStringHeaderKeys,
  UpperArrayHeaderKeys,
} from './header';
import type { WebRequest } from '../app/request';
import { extname } from 'node:path';
import { createReadStream } from 'node:fs';
import { getMimeType } from '../util';
import typeIs from 'type-is';
import vary from 'vary';
import cookie, { type CookieSerializeOptions } from 'cookie';

export type Body = string | object | Stream | Buffer | null;

interface CookieCache {
  set(name: string, value: string, options?: CookieSerializeOptions): void;
  remove(
    name: string,
    options?: Omit<CookieSerializeOptions, 'maxAge' | 'expires'>,
  ): void;
}

export class WebResponse<
  Request extends WebRequest = WebRequest,
> extends ServerResponse<Request> {
  app!: WebApp;
  ctx!: WebContext;
  private _body: Body = null;
  private _explicitBody: boolean = false;
  private _explicitStatus = false;
  private _statusCode: number;
  private _determineHeaders: boolean = false;
  private _determineNullBody: boolean = false;
  private _cookie: CookieCache | null = null;

  constructor(req: Request) {
    super(req);
    this._statusCode = 404;
    Object.defineProperty(this, 'statusCode', {
      get: (): number => {
        return this._statusCode;
      },
      set: (code: number) => {
        this.setStatus(code);
      },
    });

    this.onError = this.onError.bind(this);
  }

  declare readonly setHeader: {
    <T extends WebResponse>(
      name: UpperStringHeaderKeys,
      value: number | string,
    ): T;
    <T extends WebResponse>(
      name: UpperArrayHeaderKeys,
      value: readonly string[],
    ): T;
    <T extends WebResponse>(
      name: string,
      value: number | string | readonly string[],
    ): T;
  };

  declare readonly getHeader: {
    (name: UpperStringHeaderKeys): string | undefined;
    (name: UpperArrayHeaderKeys): string[] | undefined;
    (name: string): string | string[] | undefined;
  };

  declare readonly hasHeader: {
    (name: UpperStringHeaderKeys): boolean;
    (name: UpperArrayHeaderKeys): boolean;
    (name: string): boolean;
  };

  declare readonly removeHeader: {
    (name: UpperStringHeaderKeys): void;
    (name: UpperArrayHeaderKeys): void;
    (name: string): void;
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

  protected removeHeaders(
    ...headers: Array<UpperStringHeaderKeys | UpperArrayHeaderKeys>
  ): void;
  protected removeHeaders(...headers: Array<string>): void;
  protected removeHeaders(
    ...headers: Array<string | UpperStringHeaderKeys | UpperArrayHeaderKeys>
  ): void {
    headers.forEach(this.removeHeader.bind(this));
  }

  redirect(url: string): void;
  redirect(
    statusCode: 300 | 301 | 302 | 303 | 305 | 307 | 308,
    url: string,
  ): void;
  redirect(status: number | string, url?: string): void {
    url = typeof url === 'string' ? url : status.toString();
    this.statusCode = typeof status === 'string' ? 302 : status;
    this.setHeader('location', encodeUrl(url));

    if (this.req.accept.types('html')) {
      url = escapeHtml(url);
      this.contentType = 'html';
      this.body = `Redirecting to <a href="${url}">${url}</a>.`;
    } else {
      this.contentType = 'text';
      this.body = `Redirecting to ${url}.`;
    }
  }

  public download(
    filePath: string,
    options: contentDisposition.Options = {},
  ): void {
    this.contentType = extname(filePath);
    this.setHeader(
      'content-disposition',
      contentDisposition(filePath, options),
    );
    this.body = createReadStream(filePath);
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
    let type = this.getHeader('Content-Type');
    type &&= type.split(';', 1)[0];
    return type || '';
  }

  set contentType(typeOrFilenameOrExt: string) {
    const mimeType = getMimeType(typeOrFilenameOrExt);
    if (mimeType === false) {
      throw new Error(`无法根据参数"${typeOrFilenameOrExt}"设置Content-Type`);
    }

    this.setHeader('Content-Type', mimeType);
    this.determineNullBody();
  }

  get body(): Body {
    return this._body;
  }

  set body(val: Body) {
    this._body = val;
    this._explicitBody = true;
    if (!this._explicitStatus) {
      this.statusCode = 200;
    }
    this.determineHeaders();
  }

  public isJSON(body: Body): body is object {
    return !(
      !body ||
      typeof body === 'string' ||
      body instanceof Stream ||
      Buffer.isBuffer(body)
    );
  }

  flush(): any {
    if (!this.writable || this.headersSent) return;
    this.determineHeaders();
    let output = this.body;

    if (statuses.empty[this.statusCode]) return this.end();

    if (output === null) {
      if (this._explicitBody) {
        this._body = this.findContentType('json') ? String(null) : '';
      } else {
        // Don't use `this.body=` to against `_explicitBody`
        this._body = String(this.statusMessage || this.statusCode);
      }
      this.determineHeaders();
      output = this.body;
    }

    if (this.req.method === 'HEAD') return this.end();
    if (typeof output === 'string') return this.end(output);
    if (Buffer.isBuffer(output)) return this.end(output);

    if (output instanceof Stream) {
      stream.finished(this, () => {
        destroy(output as Stream);
      });
      if (!output.listenerCount('error')) {
        output.once('error', this.onError);
      }
      return output.pipe(this);
    }

    return this.end(JSON.stringify(output));
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

  public findContentType(type: string, ...types: string[]): string | null {
    const result = typeIs.is(this.contentType, type, ...types);
    return result === false ? null : result;
  }

  public vary(field: UpperHeaderKeys | UpperHeaderKeys[]): void;
  public vary(field: string | string[]): void;
  public vary(
    field: UpperHeaderKeys | UpperHeaderKeys[] | string | string[],
  ): void {
    return vary(this, field);
  }

  public varyAppend(
    header: UpperHeaderKeys,
    field: UpperHeaderKeys | UpperHeaderKeys[],
  ): string;
  public varyAppend(header: UpperHeaderKeys, field: string | string[]): string;
  public varyAppend(
    header: string,
    field: UpperHeaderKeys | UpperHeaderKeys[],
  ): string;
  public varyAppend(header: string, field: string | string[]): string;
  public varyAppend(
    header: UpperHeaderKeys | string,
    field: string | string[],
  ): string {
    return vary.append(header, field);
  }

  get cookie() {
    if (this._cookie) return this._cookie;
    const defaultSerializeOptions: CookieSerializeOptions = {
      path: '/',
      sameSite: false,
      secure: this.req.secure,
      httpOnly: true,
      ...this.app.options.cookie?.set,
    };
    this._cookie = {
      set: (name, value, options) => {
        const setCookie = this.getHeader('Set-Cookie') || [];
        setCookie.push(
          cookie.serialize(name, value, {
            ...defaultSerializeOptions,
            ...options,
          }),
        );
        this.setHeader('Set-Cookie', setCookie);
      },
      remove: (name, options) => {
        this.cookie.set(name, '', {
          ...defaultSerializeOptions,
          ...options,
          maxAge: undefined,
          expires: new Date(0),
        });
      },
    };
    return this._cookie;
  }

  protected setStatus(code: number) {
    assert(code >= 100 && code <= 999, `无效的状态码：${code}`);

    this._statusCode = code;
    this._explicitStatus = true;
    // https://www.rfc-editor.org/rfc/rfc7540
    if (this.req.httpVersionMajor < 2) {
      this.statusMessage = String(statuses.message[code]);
    }
    if (statuses.empty[code]) {
      this.body = null;
    } else {
      this.determineNullBody();
    }
  }

  protected determineHeaders(): void {
    if (this._determineHeaders) return;
    this._determineHeaders = true;

    const { body } = this;
    const missType = !this.hasHeader('Content-Type');

    if (body === null) {
      this.determineNullBody();
    } else if (typeof body === 'string') {
      this.contentLength = Buffer.byteLength(body);
      if (missType) {
        this.contentType = /^\s*</.test(body) ? 'html' : 'text';
      }
    } else if (Buffer.isBuffer(body)) {
      this.contentLength = body.length;
      if (missType) {
        this.contentType = 'bin';
      }
    } else if (body instanceof Stream) {
      if (missType) {
        this.contentType = 'bin';
      }
    } else {
      this.contentType = 'json';
      this.contentLength = Buffer.byteLength(JSON.stringify(body));
    }

    this._determineHeaders = false;
  }

  protected determineNullBody() {
    if (this._determineNullBody || this.body !== null) return;
    this._determineNullBody = true;

    if (statuses.empty[this.statusCode]) {
      // status=204 ===> body=null
      this.removeHeaders('Content-Type', 'Content-Length', 'Transfer-Encoding');
    } else if (this.contentType === 'application/json') {
      // contentType=json ===> body=null
      this.contentLength = Buffer.byteLength(String(null));
    } else if (this._explicitBody) {
      // body=null ===> **
      this.contentLength = 0;
      if (!this.hasHeader('Content-Type')) {
        this.contentType = 'text';
      }
    } else {
      // Output status message at flush()
    }

    this._determineNullBody = false;
  }
}

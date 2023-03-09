import { IncomingMessage } from 'node:http';
import type { TLSSocket } from 'node:tls';
import parseurl from 'parseurl';
import qs from 'qs';
import cookie from 'cookie';
import coBody from 'co-body';
import formidable from 'formidable';
import accepts, { Accepts } from 'accepts';
import typeIs from 'type-is';
import contentType from 'content-type';
import requestIP from 'request-ip';
import fresh from 'fresh';
import type { WebApp } from './app';
import type { WebContext } from './context';
import type { WebResponse } from './response';
import type { LowerExternalStringHeaderKeys } from './header';

export class WebRequest extends IncomingMessage {
  app!: WebApp;
  res!: WebResponse;
  ctx!: WebContext;

  declare readonly method: string;
  declare readonly url: string;

  public params: Record<string, unknown> = {};
  protected _query?: any;
  protected _body?: any;
  protected _accept?: Accepts;
  protected _cookie?: { readonly [key: string]: string | undefined };

  get path(): string {
    return parseurl(this)!.pathname!;
  }

  get querystring(): string {
    return parseurl(this)!.query as string;
  }

  public get query(): Record<string, unknown> {
    return (this._query ||= qs.parse(this.querystring, {
      comma: true,
      ...this.app.options.query,
    }));
  }

  public get body(): Promise<unknown> {
    if (this._body) return Promise.resolve(this._body);

    if (this.findContentType('multipart/*') !== null) {
      const form = formidable({
        hashAlgorithm: 'md5',
        keepExtensions: true,
        maxFileSize: 1000 * 1024 * 1024,
        allowEmptyFiles: true,
      });

      return (this._body = new Promise((resolve, reject) => {
        form.parse(this, (err, fields, files) => {
          if (err) return reject(err);

          resolve({
            ...fields,
            ...files,
          });
        });
      }));
    }

    return (this._body = coBody(this, {
      returnRawBody: false,
    }));
  }

  get contentType(): string {
    try {
      return contentType.parse(this).type;
    } catch {
      return '';
    }
  }

  public findContentType(type: string, ...types: string[]): string | null {
    const result = typeIs(this, type, ...types);
    return result === false ? null : result;
  }

  get accept(): Accepts {
    return this._accept || (this._accept = accepts(this));
  }

  get ip(): string {
    return requestIP.getClientIp(this) || '';
  }

  get protocol(): string {
    if ((this.socket as TLSSocket).encrypted) return 'https';
    const proto = this.headers['x-forwarded-proto'];
    return (proto && proto.split(/\s*,\s*/, 1)[0]) || 'http';
  }

  get secure(): boolean {
    return this.protocol === 'https';
  }

  get fresh(): boolean {
    const method = this.method;
    const status = this.res.statusCode;

    if (method !== 'GET' && method !== 'HEAD') return false;
    if (status < 200) return false;
    if (status > 299 && status !== 304) return false;

    return fresh(this.headers, this.res.getHeaders());
  }

  /**
   * A short hand for request header `Cookie`
   */
  get cookie() {
    return (this._cookie ||= cookie.parse(
      this.headers['cookie'] || '',
      this.app.options.cookie?.get,
    ));
  }
}

declare module 'node:http' {
  type ExternalHeaders = {
    [K in LowerExternalStringHeaderKeys]?: string;
  };

  interface IncomingHttpHeaders extends ExternalHeaders {}
}

import { IncomingMessage } from 'node:http';
import parseurl from 'parseurl';
import qs from 'qs';
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

  get path(): string {
    return parseurl(this)!.pathname!;
  }

  get querystring(): string {
    return parseurl(this)!.query as string;
  }

  public get query(): Record<string, unknown> {
    return (this._query ||= qs.parse(this.querystring, {
      comma: true,
      ...this.app.options.queryParser,
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

  get fresh(): boolean {
    const method = this.method;
    const status = this.res.statusCode;

    if (method !== 'GET' && method !== 'HEAD') return false;
    if (status < 200) return false;
    if (status > 299 && status !== 304) return false;

    return fresh(this.headers, this.res.getHeaders());
  }
}

declare module 'node:http' {
  type ExternalHeaders = {
    [K in LowerExternalStringHeaderKeys]?: string;
  };

  interface IncomingHttpHeaders extends ExternalHeaders {}
}

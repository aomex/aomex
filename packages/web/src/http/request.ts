import { IncomingMessage } from 'node:http';
import type { TLSSocket } from 'node:tls';
import type { LowerExternalStringHeaderKeys } from './header';
import qs from 'node:querystring';
import type { WebApp } from './app';
import typeIs from 'type-is';
import requestIP from 'request-ip';
import fresh from 'fresh';
import type { ServerResponse } from 'node:http';
import accepts, { type Accepts } from 'accepts';
import type { WebContext } from './context';
import cookie from 'cookie';
import { MIMEType } from 'node:util';

export class WebRequest extends IncomingMessage {
  app!: WebApp;
  req!: IncomingMessage;
  res!: ServerResponse;
  ctx!: WebContext;

  declare url: string;
  declare method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';
  declare headers: IncomingMessage['headers'];
  declare rawHeaders: IncomingMessage['rawHeaders'];

  params: Record<string, unknown> = {};

  private _accept?: Accepts;
  private _cookies?: { readonly [key: string]: string | undefined };
  private _body?: any;
  private _rawBody?: any;
  private _parsedUrl: URL | null = null;
  private _query?: any;

  get accept(): Accepts {
    return this._accept || (this._accept = accepts(this));
  }

  get contentType(): string {
    try {
      const contentType = this.headers['content-type'];
      if (!contentType) return '';
      const mime = new MIMEType(contentType);
      return mime.essence;
    } catch {
      return '';
    }
  }

  /**
   * 返回从`headers['cookie']`解析后的cookie列表
   */
  get cookies() {
    return (this._cookies ||= cookie.parse(this.headers['cookie'] || ''));
  }

  get body(): Record<string, unknown> {
    return this._body || {};
  }

  get fresh(): boolean {
    if (this.method !== 'GET' && this.method !== 'HEAD') return false;
    const status = this.res.statusCode;
    if (status < 200) return false;
    if (status >= 300 && status !== 304) return false;
    return fresh(this.headers, this.res.getHeaders());
  }

  get host(): string {
    let host = this.headers['x-forwarded-host'];
    if (!host) {
      if (this.httpVersionMajor >= 2) {
        host = this.headers[':authority'];
      }
      host ||= this.headers['host'];
    }
    return (host && host.split(/\s*,\s*/, 1)[0]) || '';
  }

  /**
   * 包括了协议，域名，端口和路径的完整链接
   */
  get href(): string {
    return this.origin + this.url;
  }

  get ip(): string {
    return requestIP.getClientIp(this) || '';
  }

  get origin(): string {
    return `${this.protocol}://${this.host}`;
  }

  get pathname(): string {
    return this.URL.pathname;
  }

  get protocol(): string {
    if ((this.socket as TLSSocket).encrypted) return 'https';
    const proto = this.headers['x-forwarded-proto'];
    return (proto && proto.split(/\s*,\s*/, 1)[0]) || 'http';
  }

  /**
   * 查询字符串对象
   */
  get query(): Record<string, unknown> {
    return (this._query ||= qs.parse(this.querystring));
  }

  /**
   * 查询字符串
   */
  get querystring(): string {
    return this.URL.search.slice(1);
  }

  get rawBody(): string {
    return this._rawBody || '';
  }

  /**
   * 搜索字符串，比查询字符串多了一个开头问号(?)
   */
  get search(): string {
    return this.URL.search;
  }

  get secure(): boolean {
    return this.protocol === 'https';
  }

  protected get URL(): URL {
    return (this._parsedUrl ||= new URL(this.href));
  }

  matchContentType(type: string, ...types: string[]): string | null {
    const result = typeIs(this, type, ...types);
    return result === false ? null : result;
  }
}

declare module 'node:http' {
  type ExternalHeaders = {
    [K in LowerExternalStringHeaderKeys]?: string;
  };

  interface IncomingHttpHeaders extends ExternalHeaders {}
}

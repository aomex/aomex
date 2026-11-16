import { IncomingMessage, type ServerResponse } from 'node:http';
import type { TLSSocket } from 'node:tls';
import { isIP } from 'node:net';
import type { LowerExternalStringHeaderKeys } from './header';
import qs from 'qs';
import type { WebApp } from './app';
import typeIs from 'type-is';
import fresh from 'fresh';
import accepts, { type Accepts } from 'accepts';
import type { WebContext } from './context';
import { parseCookie } from 'cookie';
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
  private _ip?: string;

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
  get cookies(): { readonly [key: string]: string | undefined } {
    return (this._cookies ||= parseCookie(this.headers['cookie'] || ''));
  }

  /**
   * 解析后的请求体。若需要原始报文请用 `rawBody`
   */
  get body(): unknown {
    return this._body === undefined ? {} : this._body;
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

  /**
   * 客户端 IP。
   * - `proxyIP.mode: 'detect'`：探测常见代理头（可被伪造）
   * - `proxyIP.mode: 'specify'`：按 `hops` / `header` 严格解析
   */
  get ip(): string {
    if (this._ip !== undefined) return this._ip;

    // 拆分代理头中的 IP 列表；`a.b.c.d:port` 去端口，IPv6 整段保留
    const splitProxyIps = (value: string): string[] => {
      return value.split(',').map((part) => {
        let ip = part.trim();
        if (ip.includes(':')) {
          const splitted = ip.split(':');
          if (splitted.length === 2) ip = splitted[0]!;
        }
        return ip;
      });
    };

    const proxyIP = this.app['options'].proxyIP;
    if (proxyIP.mode === 'specify') {
      const { hops, header } = proxyIP;
      if (hops > 0) {
        const raw = this.headers[header.toLowerCase()];
        const value = Array.isArray(raw) ? raw.join(',') : raw;
        if (typeof value === 'string') {
          // 从右截取 hops 段，再从左取第一个合法 IP
          for (const ip of splitProxyIps(value).slice(-hops)) {
            if (isIP(ip) !== 0) return (this._ip = ip);
          }
        }
      }
    } else {
      const { headers } = this;
      // X-Forwarded-For: 取第一个合法 IP；`a.b.c.d:port` 去端口，IPv6 整段校验
      const forwardedFor = headers['x-forwarded-for'];
      if (typeof forwardedFor === 'string') {
        for (const ip of splitProxyIps(forwardedFor)) {
          if (isIP(ip) !== 0) return (this._ip = ip);
        }
      }

      // 未校验代理可信度；无对应前置时客户端可伪造
      for (const key of [
        'x-real-ip', // Nginx 等反向代理常用，单 IP
        'forwarded', // RFC 7239；此处仅当整段值为裸 IP 时命中
        'cf-connecting-ip', // Cloudflare
        'fastly-client-ip', // Fastly
        'true-client-ip', // Akamai；部分 Cloudflare 企业配置也会用
        'x-cluster-client-ip', // 部分集群 / 负载均衡
        'x-appengine-user-ip', // Google App Engine
      ] as const) {
        const value = headers[key];
        if (typeof value === 'string' && isIP(value) !== 0) return (this._ip = value);
      }
    }

    // 无可用代理头时回退到直连地址（常见为反向代理本机 IP，如 ::ffff:127.0.0.1）
    const { remoteAddress } = this.socket;
    if (typeof remoteAddress === 'string' && isIP(remoteAddress) !== 0) {
      return (this._ip = remoteAddress);
    }

    return (this._ip = '');
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

  /**
   * 原始请求体字符串。解析后的结构化数据请用 `body`
   */
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

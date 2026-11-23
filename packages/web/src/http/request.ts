import type { ServerResponse } from 'node:http';
import fresh from 'fresh';
import type { WebContext } from './context';
import { BaseWebRequest } from './base-web-request';

/**
 * HTTP 完整请求：继承抽象 {@link BaseWebRequest}，增加 body、缓存协商、与 `res`/`ctx` 互挂。
 */
export class WebRequest extends BaseWebRequest {
  res!: ServerResponse;
  ctx!: WebContext;

  params: Record<string, unknown> = {};

  private _body?: any;
  private _rawBody?: any;

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

  /**
   * 原始请求体字符串。解析后的结构化数据请用 `body`
   */
  get rawBody(): string {
    return this._rawBody || '';
  }
}

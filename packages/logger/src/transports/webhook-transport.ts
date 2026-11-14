import { Transport, type TransportFormat } from './transport';
import type { LogRecord } from '../types';
import { i18n } from '../i18n';

type FetchHeaders = NonNullable<RequestInit['headers']>;
type FetchBody = NonNullable<RequestInit['body']>;

/**
 * 通过 HTTP 将日志推送到 Webhook 地址
 *
 * ```typescript
 * new WebhookTransport({
 *   url: process.env.ALERT_WEBHOOK_URL!,
 * });
 *
 * new WebhookTransport({
 *   url: 'https://example.com/hook',
 *   headers: { Authorization: 'Bearer xxx' },
 *   format: (log) => JSON.stringify({ text: log.message }),
 * });
 * ```
 */
export class WebhookTransport extends Transport {
  protected readonly url: string;
  protected readonly method: string;
  protected readonly headers?: FetchHeaders;
  protected readonly format:
    TransportFormat | ((log: LogRecord) => FetchBody | Promise<FetchBody>);
  protected readonly timeoutMs: number;

  constructor(opts: {
    /**
     * Webhook 地址。
     */
    url: string | URL;
    /**
     * HTTP 方法。默认 `POST`。
     */
    method?: string;
    /**
     * 额外请求头。未指定 `Content-Type` 时，`json` / `text` 格式会自动补上。
     */
    headers?: FetchHeaders;
    /**
     * 请求体。默认 `json`（`formatLog` 的 JSON 字符串）。
     * 传入函数时可按对端协议自行组装 body。
     */
    format?: TransportFormat | ((log: LogRecord) => FetchBody | Promise<FetchBody>);
    /**
     * 请求超时（毫秒）。默认 `30_000`。
     */
    timeoutMs?: number;
  }) {
    super();
    this.url = String(opts.url);
    this.method = opts.method ?? 'POST';
    this.headers = opts.headers;
    this.format = opts.format ?? 'json';
    this.timeoutMs = opts.timeoutMs ?? 30_000;
  }

  override async consume(log: LogRecord): Promise<void> {
    const { body, contentType } = await this.buildBody(log);
    const headers = new Headers(this.headers);
    if (contentType && !headers.has('Content-Type')) {
      headers.set('Content-Type', contentType);
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const res = await fetch(this.url, {
        method: this.method,
        headers,
        body,
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(
          i18n.t('webhook_request_failed', {
            status: String(res.status),
            statusText: res.statusText,
          }),
        );
      }
    } catch (err) {
      if (Error.isError(err) && err.name === 'AbortError') {
        throw new Error(i18n.t('webhook_request_timed_out'));
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }

  protected async buildBody(
    log: LogRecord,
  ): Promise<{ body: FetchBody; contentType?: string }> {
    if (typeof this.format === 'function') {
      return { body: await this.format(log) };
    }
    if (this.format === 'json') {
      return {
        body: this.formatLog(log, 'json'),
        contentType: 'application/json',
      };
    }
    return {
      body: this.formatLog(log, 'text'),
      contentType: 'text/plain;charset=utf-8',
    };
  }
}

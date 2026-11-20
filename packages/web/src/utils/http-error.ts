import statuses from 'statuses';
import type { HttpErrorStatus } from '../middleware/response-media';

/**
 * 错误响应可附带的报头值。
 * 仅 `Set-Cookie` 可为 `string[]`（Fetch / Node 均不可合并）；其它头为标量。
 */
export type HttpErrorHeaderValue = string | number | readonly string[];

export interface HttpErrorProperties {
  /**
   * 是否向客户端暴露 `message`。
   * 默认：4xx 为 `true`，5xx 为 `false`。
   */
  expose?: boolean;
  /** 业务/系统错误码，如 `ENOENT` */
  code?: string;
  /**
   * 写入响应的额外头。
   * 仅 `Set-Cookie` 可用 `string[]`；其它头请用 `string` / `number`。
   */
  headers?: Record<string, HttpErrorHeaderValue>;
  cause?: unknown;
}

/** 第三方类 http-errors 实例上可能出现的字段 */
type ForeignHttpErrorFields = {
  status?: unknown;
  statusCode?: unknown;
  expose?: unknown;
  headers?: unknown;
  code?: unknown;
};

/**
 * HTTP 请求异常。`app.on('error')` 收到的均为本类实例。
 *
 * 业务侧用 `new HttpError` / `ctx.throw` 创建；第三方错误经 {@link HttpError.from} 转换。
 */
export class HttpError extends Error {
  readonly statusCode: HttpErrorStatus;
  expose: boolean;
  code?: string;
  headers?: Record<string, HttpErrorHeaderValue>;

  constructor(
    statusCode: HttpErrorStatus,
    message?: string,
    properties?: HttpErrorProperties,
  ) {
    const props = properties ? { ...properties } : undefined;
    const cause = props?.cause;
    if (props && 'cause' in props) {
      delete props.cause;
    }

    // ENOENT（如静态文件不存在）统一为 404
    const resolved: HttpErrorStatus = props?.code === 'ENOENT' ? 404 : statusCode;

    super(
      message ?? statuses.message[resolved] ?? String(resolved),
      cause !== undefined ? { cause } : undefined,
    );
    this.name = 'HttpError';
    this.statusCode = resolved;
    this.expose = props?.expose ?? resolved < 500;

    if (props?.code !== undefined) this.code = props.code;
    if (props?.headers !== undefined) {
      this.headers = HttpError.pickHeaders(props.headers);
    }

    Error.captureStackTrace?.(this, new.target);
  }

  /** 是否为自制 {@link HttpError}（覆盖 `Error.isError`，类型收窄为本类） */
  static override isError(value: unknown): value is HttpError {
    return value instanceof HttpError;
  }

  /**
   * 将任意错误转为自制 {@link HttpError}。
   *
   * - 已是本类实例：原样返回
   * - 其余：只迁移有效字段（`statusCode`/`status`、`expose`、`headers`、`code`、`message`、`cause`、`stack`）
   */
  static from(error: unknown): HttpError {
    if (HttpError.isError(error)) return error;

    if (error == null) {
      return new HttpError(500);
    }

    if (typeof error === 'string') {
      return new HttpError(500, error);
    }

    if (Error.isError(error)) {
      return HttpError.fromForeign(error);
    }

    if (typeof error === 'object') {
      return HttpError.fromForeign(Object.assign(new Error(), error));
    }

    return new HttpError(500);
  }

  /**
   * 从第三方 Error（含类 http-errors 形态）提取字段并生成自制实例。
   */
  protected static fromForeign(error: Error): HttpError {
    const raw = error as Error & ForeignHttpErrorFields;
    const code = typeof raw.code === 'string' ? raw.code : undefined;
    const statusCode = HttpError.normalizeStatus(
      code === 'ENOENT' ? 404 : HttpError.pickStatus(raw),
    );
    const props: HttpErrorProperties = {};

    if (typeof raw.expose === 'boolean') {
      props.expose = raw.expose;
    }
    if (code !== undefined) {
      props.code = code;
    }
    const headers = HttpError.pickHeaders(raw.headers);
    if (headers) {
      props.headers = headers;
    }
    if (error.cause !== undefined) {
      props.cause = error.cause;
    }

    const err = new HttpError(
      statusCode,
      error.message ? error.message : undefined,
      props,
    );
    if (error.name && error.name !== 'Error') {
      err.name = error.name;
    }
    if (error.stack) {
      err.stack = error.stack;
    }
    return err;
  }

  protected static pickStatus(raw: ForeignHttpErrorFields): number {
    if (typeof raw.statusCode === 'number') return raw.statusCode;
    if (typeof raw.status === 'number') return raw.status;
    return 500;
  }

  protected static pickHeaders(
    headers: unknown,
  ): Record<string, HttpErrorHeaderValue> | undefined {
    if (headers === null || typeof headers !== 'object' || Array.isArray(headers)) {
      return undefined;
    }
    const out: Record<string, HttpErrorHeaderValue> = {};
    for (const [key, value] of Object.entries(headers)) {
      if (typeof value === 'string' || typeof value === 'number') {
        out[key] = value;
        continue;
      }
      // 仅 Set-Cookie 保留数组（Fetch / Node 均不可合并）；其它多值头忽略
      if (
        key.toLowerCase() === 'set-cookie' &&
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((item) => typeof item === 'string')
      ) {
        out[key] = value;
      }
    }
    return Object.keys(out).length ? out : undefined;
  }

  protected static normalizeStatus(status: number): HttpErrorStatus {
    if (status >= 400 && status < 600 && statuses.message[status]) {
      return status as HttpErrorStatus;
    }
    return 500;
  }
}

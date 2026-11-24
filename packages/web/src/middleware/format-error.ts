import { Validator, type ValidatorToken, type OpenAPI, toDocument } from '@aomex/common';
import type { Exact } from '@aomex/internal-tools';
import statuses from 'statuses';
import type { Body } from '../http';
import { HttpError } from '../utils';
import { WebMiddleware, type OpenApiInjector } from '../override';
import {
  resolveResponseContentType,
  type HttpErrorStatus,
  type WebResponseMediaOptions,
} from './response-media';

/**
 * OpenAPI 临时约定键前缀。具体键：
 * - `x-response-format-default`：未指定 `statusCodes`（接管全部）
 * - `x-response-format-400` 等：每个声明的状态码各一个
 * 值为完整 `ResponseObject`，供无 `content` 的 `response` 整份借用后单点覆盖；
 * `postMethod` 清理。
 */
export const X_RESPONSE_FORMAT_PREFIX = 'x-response-format-';
export const X_RESPONSE_FORMAT_DEFAULT = `${X_RESPONSE_FORMAT_PREFIX}default`;

export const responseFormatKey = (statusCode: number | 'default') =>
  `${X_RESPONSE_FORMAT_PREFIX}${statusCode}`;

/**
 * 交给 `formatError.handler` 的公开错误视图。
 * 写响应请用 `message` / `code` 等顶层字段（已净化）。
 */
export interface FormatErrorPublic {
  statusCode: HttpErrorStatus;
  /** 业务/系统错误码 */
  code?: string;
  /**
   * 已净化文案：
   * - `expose` → 原始 `HttpError.message`
   * - 否则 → statuses 标准文案
   */
  message: string;
  /** 原始 `HttpError.expose` */
  expose: boolean;
  /**
   * 未净化的完整 {@link HttpError}（特殊旁路）。
   *
   * @deprecated 警告：切勿把 `raw.message` / `raw.stack` / `raw.cause` 写入响应；
   * 响应文案用顶层 `message`。常规日志请用 `app.on('error')`。
   */
  raw: HttpError;
}

/** `handler` 返回值：有 `content` 时必须对齐推断；无 `content` 时可任意 Body 或省略 */
export type FormatErrorHandlerResult<Content extends ValidatorToken> =
  unknown extends Validator.Infer<Content> ? Body | void : Validator.Infer<Content>;

export type FormatErrorOptions<
  Content extends ValidatorToken = ValidatorToken,
  R extends FormatErrorHandlerResult<Content> = FormatErrorHandlerResult<Content>,
> = WebResponseMediaOptions<Content> & {
  /**
   * 仅处理这些状态码（运行时 + OpenAPI）。
   * - 省略：接管全部错误，写 `responses.default` + `x-response-format-default`
   * - 指定：只有列表内状态进入；每个 code 写 `responses[code]` + `x-response-format-{code}`
   */
  statusCodes?: readonly HttpErrorStatus[];
  /**
   * 返回响应体；status / `err.headers` 已由中间件写好。
   * 有 `content` 时返回值须精确匹配 `Infer`（封闭对象禁止多余键，含嵌套）。
   * 写响应请用已净化字段；`err.raw` 见 {@link FormatErrorPublic.raw} 警告。
   */
  handler: (
    err: FormatErrorPublic,
  ) => unknown extends Validator.Infer<Content>
    ? FormatErrorHandlerResult<Content> | Promise<FormatErrorHandlerResult<Content>>
    : Exact<Validator.Infer<Content>, R> | Promise<Exact<Validator.Infer<Content>, R>>;
};

export class FormatErrorMiddleware<Content extends ValidatorToken> extends WebMiddleware {
  constructor(protected readonly options: FormatErrorOptions<Content>) {
    super(async (ctx, next) => {
      try {
        await next();
      } catch (e) {
        const res = ctx.response;
        if (res['_errorHandled']) throw e;

        const err = HttpError.from(e);
        const { statusCodes } = options;
        if (statusCodes && !(statusCodes as readonly number[]).includes(err.statusCode)) {
          throw err;
        }

        res.removeHeaders(...res.getHeaderNames());
        err.headers && res.setHeaders(err.headers);
        res.statusCode = err.statusCode;
        res['_errorHandled'] = true;

        const body = await options.handler(this.toPublic(err));
        if (body !== undefined) {
          ctx.send(body as Body);
        }
        throw err;
      }
    });
  }

  /** 生成可安全导出的公开视图（与默认 `onError` 同一套 expose 规则） */
  protected toPublic(err: HttpError): FormatErrorPublic {
    return {
      statusCode: err.statusCode,
      code: err.code,
      message: err.expose ? err.message : (statuses.message[err.statusCode] ?? 'Error'),
      expose: err.expose,
      raw: err,
    };
  }

  protected override openapi(): OpenApiInjector {
    return {
      onMethod: (methodItem) => {
        methodItem.responses ||= {};
        const { content, headers, example, description = '', statusCodes } = this.options;

        // 显式空列表：不接管任何状态，也不写文档槽
        if (statusCodes && statusCodes.length === 0) return;

        const keys = statusCodes?.length
          ? statusCodes.map(String)
          : (['default'] as const);

        let contentMap: OpenAPI.ResponseObject['content'];
        if (content) {
          contentMap = {
            [resolveResponseContentType(this.options)]: {
              schema: toDocument(content).schema,
              example,
            },
          };
        }

        const ext = methodItem as Record<string, unknown>;
        for (const key of keys) {
          const resItem: OpenAPI.ResponseObject = {
            description,
          };

          if (contentMap) {
            resItem.content = structuredClone(contentMap);
          }

          if (headers) {
            resItem.headers = Object.fromEntries(
              Object.entries(headers).map(([name, header]) => [name, toDocument(header)]),
            );
          }

          methodItem.responses[key] = resItem;
          ext[
            key === 'default' ? X_RESPONSE_FORMAT_DEFAULT : responseFormatKey(Number(key))
          ] = structuredClone(resItem);
        }
      },
      postMethod: (methodItem) => {
        const ext = methodItem as Record<string, unknown>;
        for (const key of Object.keys(ext)) {
          if (key.startsWith(X_RESPONSE_FORMAT_PREFIX)) {
            delete ext[key];
          }
        }
      },
    };
  }

  protected getContentType(): string {
    return resolveResponseContentType(this.options);
  }
}

/**
 * 错误响应格式化：`handler` 返回 body 后重新抛出，
 * 外侧中间件的 `catch` 仍可执行；已格式化则跳过默认纯文本兜底。
 *
 * `statusCodes` 有运行时语义：指定后只有这些状态会进入本中间件。
 *
 * ```ts
 * formatError({
 *   statusCodes: [400, 422],
 *   content: { code: rule.string(), message: rule.string() },
 *   handler(err) {
 *     // 用 err.message（已净化）；不要把 err.raw.message / stack 写入响应
 *     return { code: err.code ?? 'HTTP_ERROR', message: err.message };
 *   },
 * });
 * ```
 */
export const formatError = <
  Content extends ValidatorToken = ValidatorToken,
  R extends FormatErrorHandlerResult<Content> = FormatErrorHandlerResult<Content>,
>(
  options: FormatErrorOptions<Content, R>,
) => {
  // R 仅用于调用处收紧多余字段；运行时与默认 R 无关
  return new FormatErrorMiddleware<Content>(options as FormatErrorOptions<Content>);
};

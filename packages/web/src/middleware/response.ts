import { Validator, type ValidatorToken, type OpenAPI, toDocument } from '@aomex/common';
import { WebMiddleware, type OpenApiInjector } from '../override';
import type { Body } from '../http';
import type { HttpErrorProperties } from '../utils';
import {
  resolveResponseContentType,
  type EmptyStatus,
  type HttpStatus,
  type OKStatus,
  type RedirectStatus,
  type WebResponseMediaOptions,
} from './response-media';
import { responseFormatKey, X_RESPONSE_FORMAT_DEFAULT } from './format-error';

export type {
  ClientErrorStatus,
  EmptyStatus,
  HttpErrorStatus,
  HttpStatus,
  OKStatus,
  RedirectStatus,
  ServerErrorStatus,
  WebResponseMediaOptions,
} from './response-media';

export interface WebResponseOptions<
  Code extends HttpStatus,
  Content extends ValidatorToken,
> extends WebResponseMediaOptions<Content> {
  statusCode: Code;
}

export class WebResponseMiddleware<
  Code extends HttpStatus,
  Content extends ValidatorToken,
> extends WebMiddleware<
  Code extends 200
    ? unknown extends Validator.Infer<Content>
      ? {
          /**
           * 来自response中间件定制的send()方法。200状态码可以忽略不写
           */
          send(statusCode: Code): void;
          send(): void;
        }
      : {
          /**
           * 来自response中间件定制的send()方法。200状态码可以忽略不写
           */
          send(statusCode: Code, body: Extract<Validator.Infer<Content>, Body>): void;
          send(body: Extract<Validator.Infer<Content>, Body>): void;
        }
    : Code extends OKStatus
      ? unknown extends Validator.Infer<Content>
        ? {
            /**
             * 来自response中间件定制的send()方法
             */
            send(statusCode: Code): void;
          }
        : {
            /**
             * 来自response中间件定制的send()方法
             */
            send(statusCode: Code, body: Extract<Validator.Infer<Content>, Body>): void;
          }
      : Code extends EmptyStatus
        ? {
            /**
             * 来自response中间件定制的send()方法。空状态码无需响应数据
             */
            send(statusCode: Code): void;
            send(statusCode: Code, body: null): void;
          }
        : Code extends RedirectStatus
          ? {
              /**
               * 来自response中间件定制的redirect()方法
               */
              redirect(statusCode: Code, url: string): void;
            }
          : {
              /**
               * 来自response中间件定制的throw()方法
               */
              throw(
                statusCode: Code,
                message?: string | Error,
                properties?: HttpErrorProperties,
              ): never;
              throw(statusCode: Code, properties?: HttpErrorProperties): never;
            }
> {
  constructor(protected readonly options: WebResponseOptions<Code, Content>) {
    super(async (_, next) => next());
  }

  protected override openapi(): OpenApiInjector {
    return {
      onMethod: (methodItem) => {
        methodItem.responses ||= {};
        const { statusCode, content, headers, example } = this.options;
        const prev = methodItem.responses[statusCode];

        // 无 content：整份借用 formatError 槽，再单点覆盖显式字段
        if (!content) {
          const borrowed = this.peekResponseFormat(methodItem, statusCode);
          const resItem: OpenAPI.ResponseObject =
            prev && !('$ref' in prev)
              ? prev
              : borrowed
                ? structuredClone(borrowed)
                : { description: '' };

          if (this.options.description !== undefined) {
            resItem.description = this.options.description;
          } else if (!resItem.description) {
            resItem.description = '';
          }

          if (headers) {
            resItem.headers = Object.fromEntries(
              Object.entries(headers).map(([key, header]) => [key, toDocument(header)]),
            );
          }

          methodItem.responses[statusCode] = resItem;
          return;
        }

        const resItem: OpenAPI.ResponseObject = (methodItem.responses[statusCode] = {
          description: this.options.description ?? '',
        });

        resItem.content = {
          [resolveResponseContentType(this.options)]: {
            schema: toDocument(content).schema,
            example,
          },
        };

        if (headers) {
          resItem.headers = Object.fromEntries(
            Object.entries(headers).map(([key, header]) => [key, toDocument(header)]),
          );
        }
      },
    };
  }

  protected getContentType(): string {
    return resolveResponseContentType(this.options);
  }

  /** 优先读对应状态键，再回退 `x-response-format-default` */
  protected peekResponseFormat(
    methodItem: OpenAPI.OperationObject,
    statusCode: number,
  ): OpenAPI.ResponseObject | undefined {
    const ext = methodItem as Record<string, unknown>;
    const specific = ext[responseFormatKey(statusCode)];
    if (specific) return specific as OpenAPI.ResponseObject;
    return ext[X_RESPONSE_FORMAT_DEFAULT] as OpenAPI.ResponseObject | undefined;
  }
}

/**
 * 响应数据声明。多个状态码时请多次调用函数。
 * - 生成openapi文档
 * - 静态类型约束，以保证运行时和文档一致
 *
 * 错误状态若只声明 `statusCode`、不写 `content`：整份借用
 * `x-response-format-{code}` / `default`（含 description、content、headers），
 * 再按本中间件显式字段单点覆盖。
 */
export const response = <Code extends HttpStatus, Content extends ValidatorToken>(
  options: WebResponseOptions<Code, Content>,
) => {
  return new WebResponseMiddleware<Code, Content>(options);
};

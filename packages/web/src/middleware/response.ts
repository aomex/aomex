import { type ValidatorToken, toValidator, type OpenAPI, Validator } from '@aomex/common';
import { WebMiddleware, type OpenApiInjector } from '../override';
import { getMimeType } from '../utils';
import type { Body, HttpErrorProperties } from '../http';

type OKStatus = 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226;
type EmptyStatus = 204 | 205 | 304;
type RedirectStatus = 300 | 301 | 302 | 303 | 305 | 307 | 308;
type ClientErrorStatus =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 427
  | 428
  | 429
  | 431
  | 451;
type ServerErrorStatus =
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511;
type HttpStatus =
  | OKStatus
  | EmptyStatus
  | RedirectStatus
  | ClientErrorStatus
  | ServerErrorStatus;

export interface WebResponseOptions<
  Code extends HttpStatus,
  Content extends ValidatorToken,
> extends Pick<OpenAPI.MediaTypeObject, 'example'> {
  statusCode: Code;
  /**
   * 响应格式，支持简写和完整写法。如果不填，则根据content的结构判断
   *
   * 包括但不限于如下类型：
   * - application/json
   * - application/*
   * - json
   * - text
   * - binary
   * - html
   * - stream
   */
  contentType?: string;
  /**
   * 响应内容结构
   */
  content?: Content;
  /**
   * 报文结构
   */
  headers?: { [key: string]: Validator };
  description?: string;
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
        const { statusCode, content, headers, example, description = '' } = this.options;
        const resItem: OpenAPI.ResponseObject = (methodItem.responses[statusCode] = {
          description,
        });

        if (content) {
          resItem.content = {
            [this.getContentType()]: {
              schema: Validator.toDocument(toValidator(content)).schema,
              example,
            },
          };
        }

        if (headers) {
          resItem.headers = Object.fromEntries(
            Object.entries(headers).map(([key, header]) => [
              key,
              Validator.toDocument(header),
            ]),
          );
        }
      },
    };
  }

  protected getContentType(): string {
    let { contentType, content } = this.options;

    if (!contentType) {
      const validator = toValidator(content!);
      const docs = validator['toDocument']();
      switch (docs.type) {
        case 'array':
        case 'object':
          contentType = getMimeType('json');
          break;
        case 'boolean':
        case 'integer':
        case 'number':
          contentType = getMimeType('text');
          break;
        case 'string':
          if (docs.format === 'binary') {
            contentType = getMimeType('bin');
          } else {
            contentType = getMimeType('text');
          }
          break;
        default:
          contentType = '*/*';
      }
    } else if (!contentType.includes('*')) {
      contentType = getMimeType(contentType);
    }

    return contentType.split(';')[0]!;
  }
}

/**
 * 响应数据声明。多个状态码时请多次调用函数。
 * - 生成openapi文档
 * - 静态类型约束，以保证运行时和文档一致
 */
export const response = <Code extends HttpStatus, Content extends ValidatorToken>(
  options: WebResponseOptions<Code, Content>,
) => {
  return new WebResponseMiddleware<Code, Content>(options);
};

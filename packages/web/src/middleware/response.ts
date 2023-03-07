import { OpenAPI, rule, Validator } from '@aomex/core';
import { WebMiddleware, WebMiddlewareToDocument } from '../override';
import { getMimeType } from '../util';

export interface WebResponseOptions
  extends Pick<OpenAPI.MediaTypeObject, 'example'> {
  /**
   * Examples:
   * - 200
   * - 201
   * - 2xx
   * - 3xx
   * - default (handle unknown response)
   */
  statusCode: number | string;
  /**
   * - json
   * - application/json
   * - text
   * - binary
   * - html
   * - stream
   * - \*\/\* (any type)
   */
  contentType?: string;
  /**
   * Final data schema
   */
  schema: Validator | { [key: string]: Validator };
  headers?: { [key: string]: Validator };
  description?: string;
}

/**
 * web响应中间件，帮助openapi生成最合适的文档
 */
export const response = (options: WebResponseOptions) =>
  new WebResponseMiddleware(options);

export class WebResponseMiddleware extends WebMiddleware<object> {
  constructor(protected readonly options: WebResponseOptions) {
    super((_, next) => next());
  }

  public override toDocument({ methodItem }: WebMiddlewareToDocument): void {
    if (!methodItem) return;
    methodItem.responses ||= {};
    const {
      statusCode,
      contentType = '*/*',
      schema,
      headers = {},
      example,
      description = '',
    } = this.options;
    const type = contentType.includes('*')
      ? contentType
      : getMimeType(contentType) || '*/*';
    methodItem.responses[statusCode] = {
      description,
      content: {
        [type.split(';', 1)[0]!]: {
          schema: Validator.toDocument(
            schema instanceof Validator ? schema : rule.object(schema),
          ).schema,
          example,
        },
      },
      headers: Object.fromEntries(
        Object.entries(headers).map(([key, header]) => [
          key,
          Validator.toDocument(header),
        ]),
      ),
    };
  }
}

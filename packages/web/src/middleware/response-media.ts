import { type ValidatorToken, toValidator, type OpenAPI } from '@aomex/common';
import { getMimeType } from '../utils/get-mime-type';

export type OKStatus = 200 | 201 | 202 | 203 | 206 | 207 | 208 | 226;
export type EmptyStatus = 204 | 205 | 304;
export type RedirectStatus = 300 | 301 | 302 | 303 | 305 | 307 | 308;

export type ClientErrorStatus =
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
  | 411
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
  | 428
  | 429
  | 431
  | 451;

export type ServerErrorStatus =
  500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511;

/** 可作为 `HttpError` / `ctx.throw` / `formatError.statusCodes` 的状态码（仅 4xx / 5xx） */
export type HttpErrorStatus = ClientErrorStatus | ServerErrorStatus;

export type HttpStatus =
  OKStatus | EmptyStatus | RedirectStatus | ClientErrorStatus | ServerErrorStatus;

/**
 * `response` / `formatError` 共享的响应媒体声明（写入 OpenAPI ResponseObject）。
 */
export interface WebResponseMediaOptions<
  Content extends ValidatorToken = ValidatorToken,
> extends Pick<OpenAPI.MediaTypeObject, 'example'> {
  /**
   * 响应格式，支持简写和完整写法。如果不填，则根据 content 的结构判断
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
  headers?: { [key: string]: ValidatorToken };
  description?: string;
}

/** 由 `content` / `contentType` 解析 OpenAPI media type */
export const resolveResponseContentType = (
  options: Pick<WebResponseMediaOptions, 'content' | 'contentType'>,
): string => {
  let { contentType, content } = options;

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
};

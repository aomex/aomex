import zlib from 'node:zlib';
import Stream, { Transform } from 'node:stream';
import compressible from 'compressible';
import { bytes } from '@aomex/helper';
import { middleware } from '@aomex/core';
import Negotiator from 'negotiator';
import { statuses, type WebMiddleware } from '@aomex/web';

type AcceptEncodingMethods =
  | 'gzip'
  | 'deflate'
  | 'br'
  | 'identity'
  | 'compress'
  | '*';

export interface CompressOptions {
  /**
   * Filter compressible response by content-type. Notice that this option will be ignored when exists `ctx.needCompress=true`. Defaults `compressible`
   * @see compressible
   */
  filter?: (mimeType: string) => boolean;

  /**
   * Minimum compressible size, defaults `1024`(unit: byte). For convenience, you can input string includes unit, (e.g. 10kb, 1024mb)
   */
  threshold?: number | string;

  /**
   * brotli compression options
   */
  br?: zlib.BrotliOptions | false;

  /**
   * gzip compression options
   */
  gzip?: zlib.ZlibOptions | false;

  /**
   * deflate compression options
   */
  deflate?: zlib.ZlibOptions | false;
}

const NO_TRANSFORM_REGEX = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;
const ENCODING_METHODS: {
  [K in AcceptEncodingMethods]?: (...args: any[]) => Transform;
} = {
  br: zlib.createBrotliCompress,
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate,
};
const PREFERRED_ENCODINGS = <const>['br', 'gzip', 'deflate'];
const ENCODING_METHOD_OPTIONS: {
  [K in AcceptEncodingMethods]?: object;
} = {
  br: { [zlib.constants.BROTLI_PARAM_QUALITY]: 4 },
  gzip: {},
  deflate: {},
};

export const compress = (
  options: CompressOptions = {},
): WebMiddleware<{ needCompress?: boolean }> => {
  let { filter = compressible, threshold = 1024 } = options;
  if (typeof threshold === 'string') {
    threshold = bytes(threshold);
  }

  const preferredEncodings = PREFERRED_ENCODINGS.filter(
    (encoding) => options[encoding] !== false,
  );
  const encodingOptions: {
    [K in AcceptEncodingMethods]?: object;
  } = {};
  preferredEncodings.forEach((encoding) => {
    encodingOptions[encoding] = {
      ...ENCODING_METHOD_OPTIONS[encoding],
      ...(options[encoding] || {}),
    };
  });

  return middleware.web(async (ctx, next) => {
    const { response, request } = ctx;
    response.vary('Accept-Encoding');
    await next();
    const { body } = response;

    if (!body) return;
    if (response.headersSent || !response.writable) return;
    if (ctx.needCompress === false) return;
    if (request.method === 'HEAD') return;
    if (response.hasHeader('Content-Encoding')) return;
    if (statuses.empty[+response.statusCode]) return;
    if (!(body instanceof Stream) && response.contentLength < threshold) return;
    if (ctx.needCompress === void 0 && !filter(response.contentType)) return;

    const cacheControl = response.getHeader('Cache-Control');
    // https://tools.ietf.org/html/rfc7234#section-5.2.1.6
    if (cacheControl && NO_TRANSFORM_REGEX.test(cacheControl)) return;

    const negotiator = new Negotiator(request);
    const encoding = negotiator.encoding(preferredEncodings) as
      | AcceptEncodingMethods
      | undefined;
    if (!encoding || encoding === 'identity') return;

    const compress = ENCODING_METHODS[encoding];
    const transform = compress?.(encodingOptions[encoding]);
    if (!transform) return;

    response
      .setHeader('Content-Encoding', encoding)
      .removeHeader('Content-Length');

    if (body instanceof Stream) {
      response.body = body.pipe(transform);
    } else {
      response.body = transform.end(
        response.isJSON(body) ? JSON.stringify(body) : body,
      );
    }
  });
};

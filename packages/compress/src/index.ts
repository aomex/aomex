import zlib from 'node:zlib';
import Stream, { Transform } from 'node:stream';
import compressible from 'compressible';
import { middleware } from '@aomex/common';
import { bytes } from '@aomex/internal-tools';
import { statuses, type WebMiddleware } from '@aomex/web';

type AcceptEncodingMethods =
  | 'zstd'
  | 'gzip'
  | 'br'
  | 'deflate'
  | 'identity'
  | 'compress'
  | '*';

export interface CompressOptions {
  /**
   * 根据响应的`content-type`确定是否需要压缩。默认值：[compressible](https://www.npmjs.com/package/compressible)<br>
   * 如果存在`ctx.needCompress=true`，则该属性会被直接忽略。
   */
  filter?: (contentType: string) => boolean;

  /**
   * 最低要求的压缩体积。数字或者不带单位时，单位为byte。也可以传入带单位的字符。默认值：`1024`
   *
   * - 1259
   * - '1024'
   * - 100byte
   * - 23kb
   * - 1024mb
   * - 3gb
   */
  threshold?: number | string;

  /**
   * `zstd`压缩配置。设置false则代表禁止使用zstd压缩算法
   */
  zstd?: zlib.ZstdOptions | false;

  /**
   * `brotli`压缩配置。设置false则代表禁止使用br压缩算法
   */
  br?: zlib.BrotliOptions | false;

  /**
   * `gzip`压缩配置。设置false则代表禁止使用gzip压缩算法
   */
  gzip?: zlib.ZlibOptions | false;

  /**
   * `deflate`压缩配置。设置false则代表禁止使用deflate压缩算法
   */
  deflate?: zlib.ZlibOptions | false;
}

const NO_TRANSFORM_REGEX = /(?:^|,)\s*?no-transform\s*?(?:,|$)/;
const ENCODING_METHODS = {
  br: zlib.createBrotliCompress,
  gzip: zlib.createGzip,
  deflate: zlib.createDeflate,
  zstd: zlib.createZstdCompress,
} satisfies {
  [K in AcceptEncodingMethods]?: (...args: any[]) => Transform;
};
const PREFERRED_ENCODINGS = <const>['zstd', 'br', 'gzip', 'deflate'];
const ENCODING_METHOD_OPTIONS = {
  zstd: {},
  br: {
    params: {
      [zlib.constants.BROTLI_PARAM_QUALITY]: 4,
    },
  },
  gzip: {},
  deflate: {},
} satisfies {
  [K in AcceptEncodingMethods]?: object;
};

export interface CompressProps {
  /**
   * 允许响应`强制开启`压缩功能。默认值：`false`
   */
  needCompress?: boolean;
}

/**
 * Web请求响应体积太大时，会消耗额外的服务器带宽以及花费更多时间用于内容的下载，甚至影响到用户的访问体验。
 *
 * 因此我们希望压缩响应内容的体积。
 */
export const compress = (options: CompressOptions = {}): WebMiddleware<CompressProps> => {
  let { filter = compressible, threshold = 1024 } = options;
  threshold = typeof threshold === 'string' ? bytes(threshold) : threshold;

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
    if (ctx.needCompress === false) return;
    if (response.headersSent || !response.writable) return;
    if (request.method === 'HEAD') return;
    if (response.hasHeader('Content-Encoding')) return;
    if (statuses.empty[+response.statusCode]) return;
    if (ctx.needCompress === void 0) {
      if (!(body instanceof Stream) && response.contentLength < threshold) return;
      if (!filter(response.contentType)) return;
    }

    const cacheControl = response.getHeader('Cache-Control');
    // https://tools.ietf.org/html/rfc7234#section-5.2.1.6
    if (cacheControl && NO_TRANSFORM_REGEX.test(cacheControl)) return;

    const encoding = request.accept.encoding(preferredEncodings) as
      | keyof typeof ENCODING_METHODS
      | false;
    if (
      !encoding ||
      !Object.hasOwn(ENCODING_METHODS, encoding) ||
      typeof ENCODING_METHODS[encoding] !== 'function'
    ) {
      return;
    }

    const transform = ENCODING_METHODS[encoding](encodingOptions[encoding]);

    response.setHeader('Content-Encoding', encoding);
    response.removeHeader('Content-Length');

    if (body instanceof Stream) {
      response.body = body.pipe(transform);
    } else {
      response.body = transform.end(response.isJSON(body) ? JSON.stringify(body) : body);
    }
  });
};

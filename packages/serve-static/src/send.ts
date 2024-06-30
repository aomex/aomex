import { stat } from 'node:fs/promises';
import path from 'node:path';
import type { WebContext } from '@aomex/web';
import { createReadStream, type Stats } from 'node:fs';

export interface SendOptions {
  /**
   * 服务的根目录，请勿设置成根目录，否则源码可能被访问。
   */
  root: string;
  /**
   * 没有指定文件名时，自动访问这个文件。默认值：`index.html`
   */
  indexFile?: string | false;
  /**
   * 使用压缩过后的文件，如果未找到则继续使用源文件。支持后缀：
   * - .gz
   * - .br
   *
   * 默认值：`true`
   *
   */
  useCompressedFile?: boolean;
  /**
   * 设置 Cache-Control 报文
   *
   * @link https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control
   */
  cacheControl?: {
    /**
     * 是否共享缓存。默认值：`public`
     *
     * - `public` 表明响应可以被任何对象（包括：发送请求的客户端，代理服务器，等等）缓存，即使是通常不可缓存的内容。（例如：1.该响应没有max-age指令或Expires消息头；2. 该响应对应的请求方法是 POST 。）
     * - `private` 表明响应只能被单个用户缓存，不能作为共享缓存（即代理服务器不能缓存它）。私有缓存可以缓存响应内容，比如：对应用户的本地浏览器。
     *
     */
    publicOrPrivate?: 'public' | 'private';
    /**
     * 缓存的内容将在N毫秒后失效, 这个选项只在HTTP 1.1可用, 并如果和Last-Modified一起使用时, 优先级较高
     *
     * 默认值：`0`
     *
     */
    maxAge?: number;
    /**
     * 表示响应正文不会随时间而改变。资源（如果未过期）在服务器上不发生改变，因此客户端不应发送重新验证请求头（例如If-None-Match或 If-Modified-Since）来检查更新，即使用户显式地刷新页面。
     *
     * 默认值：`false`
     */
    immutable?: boolean;
    /**
     * 在发布缓存副本之前，强制要求缓存把请求提交给原始服务器进行验证 (协商缓存验证)。
     *
     * 默认值：`false`
     */
    noCache?: boolean;
    /**
     * 缓存不应存储有关客户端请求或服务器响应的任何内容，即不使用任何缓存。
     *
     * 默认值：`false`
     */
    noStore?: boolean;
  };
}

const DOT_FILE_PATTERN = /(?:^\.|[\\/]\.)/;

export const send = async (ctx: WebContext, options: SendOptions): Promise<boolean> => {
  const { request, response } = ctx;
  const {
    cacheControl: {
      maxAge = 0,
      immutable = false,
      publicOrPrivate = 'public',
      noCache = false,
      noStore = false,
    } = {},
    indexFile = 'index.html',
    useCompressedFile = true,
  } = options;
  const root = path.normalize(path.resolve(options.root ?? ''));

  let { pathname: staticPath } = request;
  try {
    staticPath = decodeURIComponent(staticPath);
  } catch {
    return false;
  }
  // 去掉 .. 路径再和根目录合并，防止非法访问
  staticPath = path.normalize(staticPath.slice(path.parse(staticPath).root.length));
  staticPath = path.join(root, staticPath);

  if (DOT_FILE_PATTERN.test(staticPath.substring(root.length))) return false;

  let stats: Stats;
  try {
    stats = await stat(staticPath);
    if (stats.isDirectory()) {
      if (!indexFile) return false;
      staticPath = path.join(staticPath, indexFile);
      stats = await stat(staticPath);
    }
  } catch {
    return false;
  }

  if (stats.isDirectory()) return false;

  let compressExt: string = '';
  if (useCompressedFile) {
    if (
      request.accept.encodings('br', 'identity') === 'br' &&
      (await isFileExists(staticPath + '.br'))
    ) {
      compressExt = '.br';
      response.setHeader('Content-Encoding', 'br');
    } else if (
      request.accept.encodings('gzip', 'identity') === 'gzip' &&
      (await isFileExists(staticPath + '.gz'))
    ) {
      compressExt = '.gz';
      response.setHeader('Content-Encoding', 'gz');
    }
  }

  if (!compressExt) {
    response.setHeader('Content-Length', stats.size);
  }
  if (!response.hasHeader('Last-Modified')) {
    response.setHeader('Last-Modified', stats.mtime.toUTCString());
  }
  if (!response.hasHeader('Cache-Control')) {
    const directives: string[] = [];
    directives.push(publicOrPrivate);
    noCache && directives.push('no-cache');
    noStore && directives.push('no-store');
    directives.push(`max-age=${(maxAge / 1000) | 0}`);
    immutable && directives.push('immutable');
    response.setHeader('Cache-Control', directives.join(', '));
  }

  response.contentType = path.extname(staticPath) || 'text';
  ctx.send(createReadStream(staticPath + compressExt));
  return true;
};

const isFileExists = async (file: string) => {
  try {
    const stats = await stat(file);
    if (stats.isFile()) return true;
    return false;
  } catch {
    return false;
  }
};

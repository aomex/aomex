import { stat } from 'node:fs/promises';
import path from 'node:path';
import type { WebContext } from '@aomex/web';
import { createReadStream, Stats } from 'node:fs';

export interface SendOptions {
  /**
   * Serve files relative to path.
   *
   * Defaults `process.cwd()`
   */
  root?: string;
  /**
   * Defaults `index.html`
   */
  index?: string | false;
  /**
   * Set headers when matched static files.
   */
  headers?: {
    /**
     * Defaults `true`
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Last-Modified
     */
    lastModified?: boolean;
    /**
     * Defaults `true`
     * @link https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
     */
    cacheControl?:
      | boolean
      | {
          /**
           * If set `false`, the response can be stored only in a private cache (e.g. local caches in browsers).
           *
           * If set `true`, the response can be stored in a shared cache.
           * Responses for requests with `Authorization` header fields must not be stored in a shared cache
           *
           * Defaults `true`
           */
          share?: boolean;
          /**
           * Remains fresh until N milliseconds after the response is generated.
           *
           * Defaults `0`
           *
           */
          maxAge?: number;
          /**
           * immutable tells a cache that the response is immutable while it's fresh,
           * and avoids those kinds of unnecessary conditional requests to the server
           *
           * Defaults `false`
           */
          immutable?: boolean;
        };
  };
  /**
   * Set how "dotfiles" are treated when encountered.
   * A dotfile is a file or directory that begins with a dot (".").
   *
   * - allow - No special treatment for dotfiles.
   * - deny - Send a 403 for any request for a dotfile.
   * - ignore - Pretend like the dotfile does not exist and 404.
   *
   * Defaults `ignore`
   */
  dotFiles?: 'allow' | 'deny' | 'ignore';
}

const UP_PATH_PATTERN = /(?:^|[\\/])\.\.(?:[\\/]|$)/;
const DOT_FILE_PATTERN = /(?:^\.|[\\/]\.)/;
const FILE_NOT_FOUND = ['ENOENT', 'ENAMETOOLONG', 'ENOTDIR'];

export const send = async (
  ctx: WebContext,
  options: SendOptions,
): Promise<void> => {
  const { request, response } = ctx;
  const {
    headers: { cacheControl = true, lastModified: setLastModified = true } = {},
    index = 'index.html',
    dotFiles = 'ignore',
  } = options;

  const root = path.normalize(path.resolve(options.root ?? ''));

  let pathname = request.path;
  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    ctx.throw(400);
  }
  pathname = pathname.slice(path.parse(pathname).root.length);
  if (UP_PATH_PATTERN.test(pathname)) {
    ctx.throw(403);
  }
  pathname = path.normalize(path.join(root, pathname));

  if (
    dotFiles !== 'allow' &&
    DOT_FILE_PATTERN.test(pathname.substring(root.length))
  ) {
    ctx.throw(dotFiles === 'deny' ? 403 : 404);
  }

  let stats: Stats;
  try {
    stats = await stat(pathname);
    if (stats.isDirectory()) {
      if (index) {
        pathname = path.join(pathname, index);
        stats = await stat(pathname);
      } else {
        ctx.throw(404);
      }
    }
  } catch (err) {
    const error = err as Error & { code: string };
    ctx.throw(FILE_NOT_FOUND.includes(error.code) ? 404 : 500, error);
  }

  response.setHeader('Content-Length', stats.size);

  if (setLastModified && !response.hasHeader('Last-Modified')) {
    response.setHeader('Last-Modified', stats.mtime.toUTCString());
  }

  if (cacheControl !== false && !response.hasHeader('Cache-Control')) {
    const {
      maxAge = 0,
      immutable = false,
      share = true,
    } = cacheControl === true ? {} : cacheControl;
    const directives: string[] = [];
    directives.push(share ? 'public' : 'private');
    directives.push(`max-age=${(maxAge / 1000) | 0}`);
    immutable && directives.push('immutable');
    response.setHeader('Cache-Control', directives.join(', '));
  }

  response.contentType = path.extname(pathname) || 'text';
  ctx.send(200, createReadStream(pathname));
};

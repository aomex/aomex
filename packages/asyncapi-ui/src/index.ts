import { compose, createI18n, middleware, type AsyncAPI } from '@aomex/common';
import { serveStatic } from '@aomex/serve-static';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export interface AsyncapiUIOptions {
  /**
   * 文档内容，有三种方式可以提供 AsyncAPI 文档：
   * 1. 文件路径，支持 json 和 yaml 格式
   * 2. 传入函数直接生成
   * 3. 利用 `@aomex/asyncapi-generator` 动态生成
   *
   * ```typescript
   * import { generateAsyncapi } from '@aomex/asyncapi-generator';
   *
   * asyncapiUI({ asyncapi: './asyncapi.json' });
   * asyncapiUI({ asyncapi: './asyncapi.yaml' });
   * asyncapiUI({
   *   asyncapi: () => {
   *     return {
   *       asyncapi: '3.1.0',
   *       info: { title: 'aomex', version: '1.0.1' },
   *       channels: {},
   *       operations: {},
   *     };
   *   },
   * });
   * asyncapiUI({
   *   asyncapi: async () => {
   *     return generateAsyncapi({
   *       channels: './src/channels',
   *       docs: { asyncapi: '3.1.0' },
   *     });
   *   },
   * });
   * ```
   */
  asyncapi: string | (() => Promise<AsyncAPI.Document> | AsyncAPI.Document);
  /**
   * 为了更好地区分常规接口和 AsyncAPI 文档，建议设置一个请求路径前缀。默认值：`'/asyncapi'`
   */
  uriPrefix?: string;
  /**
   * 是否允许访问文档服务，每次请求都会询问
   */
  enable?: (ctx?: WebContext) => boolean | Promise<boolean>;
  /**
   * 放在 `<head></head>` 内的标签集合
   *
   * ```javascript
   * [{
   *   tag: 'link',
   *   props: {
   *     rel: 'shortcut icon',
   *     type: 'image/x-icon',
   *     href: 'http://host/favicon.ico',
   *   },
   * }]
   * ```
   */
  headTags?: {
    /**
     * 标签名，如：meta, link
     */
    tag: string;
    /**
     * 标签内属性
     */
    props: Record<string, any>;
    /**
     * 是否自闭合标签，类似 `<br />`。默认值：`true`
     */
    selfClosing?: boolean;
  }[];
}

/**
 * 基于官方 `@asyncapi/react-component` standalone 包的 AsyncAPI 文档 UI。
 */
export const asyncapiUI = (opts: AsyncapiUIOptions): WebMiddleware => {
  let { uriPrefix = '/asyncapi', asyncapi, enable, headTags = [] } = opts;
  uriPrefix = uriPrefix.split('/').map(encodeURIComponent).join('/');
  if (!uriPrefix.startsWith('/')) uriPrefix = '/' + uriPrefix;

  const htmlPath = path.posix.join(uriPrefix, 'index.html');
  const asyncapiJsonPath = path.posix.join(uriPrefix, 'asyncapi.json');
  const publicDir = path.join(import.meta.dirname, '..', 'public');
  const htmlFile = path.join(publicDir, 'index.html');

  const i18n = createI18n({ zh: {}, en: {} });

  const staticFn = compose([
    serveStatic({
      root: publicDir,
      useCompressedFile: false,
      indexFile: false,
      formatPath(pathname) {
        return pathname.slice(uriPrefix.length);
      },
      cacheControl: {
        maxAge: 3600_000,
      },
    }),
  ]);

  let html = '';
  let specs: string;
  let promise: Promise<any>;

  const loading = () => {
    if (promise) return promise;

    promise = new Promise(async (resolve) => {
      let docs: AsyncAPI.Document;
      if (typeof asyncapi === 'function') {
        docs = await asyncapi();
        specs = JSON.stringify(docs);
      } else {
        const content = await readFile(path.resolve(asyncapi), 'utf8');
        if (asyncapi.endsWith('.yaml') || asyncapi.endsWith('.yml')) {
          docs = YAML.parse(content);
          specs = JSON.stringify(docs);
        } else {
          docs = JSON.parse(content);
          specs = JSON.stringify(docs);
        }
      }

      html = await readFile(htmlFile, 'utf8');
      html = html
        .replaceAll('#title#', docs.info.title)
        .replaceAll('#prefix#', '.' + uriPrefix)
        .replaceAll('#lang#', i18n.language)
        .replaceAll(
          '#headTags#',
          headTags
            .map(({ tag, props, selfClosing = true }) => {
              return `<${tag} ${Object.entries(props)
                .map(([key, value]) => `${key}="${value}"`)
                .join(' ')} ${selfClosing ? '/>' : `></${tag}>`}`;
            })
            .join('\n'),
        );
      resolve(undefined);
    });
    return promise;
  };

  return middleware.web(async (ctx, next) => {
    const { pathname, method } = ctx.request;
    if (method !== 'GET' && method !== 'HEAD') return next();
    // 必须精确匹配前缀或前缀+/，避免 /asyncapi../ 这类路径穿越
    if (pathname !== uriPrefix && !pathname.startsWith(uriPrefix + '/')) return next();
    if (enable && !(await enable(ctx))) return next();

    if (pathname === uriPrefix || pathname === htmlPath) {
      await loading();
      ctx.response.skipEnvelope = true;
      ctx.send(html);
      return;
    }

    if (pathname === asyncapiJsonPath) {
      await loading();
      ctx.response.skipEnvelope = true;
      ctx.send(specs);
      ctx.response.contentType = 'json';
      return;
    }

    return staticFn(ctx, next);
  });
};

import { compose, I18n, middleware, OpenAPI } from '@aomex/common';
import { serveStatic } from '@aomex/serve-static';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export interface RedocUIOptions {
  /**
   * 文档内容，有三种方式可以提供openapi文档：
   * 1. 文件路径，支持json和yaml格式
   * 2. 传入函数直接生成
   * 3. 利用`@aomex/openapi`动态生成
   *
   * ```typescript
   * import { generateOpenapi } from '@aomex/openapi';
   *
   * redocUI({ openapi: './openapi.json' });
   * redocUI({ openapi: './openapi.yaml' });
   * redocUI({
   *   openapi: () => {
   *     return {
   *       version: '3.0.0',
   *       info: { title: 'aomex', version: '1.0.1' },
   *       paths: {}
   *     };
   *   }
   * });
   * redocUI({
   *   openapi: async () => {
   *     return generateOpenapi({ routers: './src/routers' });
   *   }
   * });
   * ```
   */
  openapi: string | (() => Promise<OpenAPI.Document> | OpenAPI.Document);
  /**
   * 为了更好地区分常规接口和redoc文档，建议设置一个请求路径前缀。默认值：`'/redoc'`
   *
   */
  uriPrefix?: string;
  /**
   * 是否允许访问文档服务，每次请求都会询问
   */
  enable?: (ctx?: WebContext) => boolean | Promise<boolean>;
  /**
   * 放在<head></head>内的标签集合
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
     * 是否自闭合标签，类似 <br />。默认值：`true`
     */
    selfClosing?: boolean;
  }[];
}

export const redocUI = (opts: RedocUIOptions): WebMiddleware => {
  let { uriPrefix = '/redoc', openapi, enable, headTags = [] } = opts;
  uriPrefix = uriPrefix.split('/').map(encodeURIComponent).join('/');
  if (!uriPrefix.startsWith('/')) uriPrefix = '/' + uriPrefix;

  const htmlPath = path.posix.join(uriPrefix, 'index.html');
  const openapiPath = path.posix.join(uriPrefix, 'openapi.json');
  const publicDir = path.join(import.meta.dirname, '..', 'public');
  const htmlFile = path.join(publicDir, 'index.html');

  const i18n = new I18n({
    resources: { zh_CN: {}, en_US: {} },
    defaultLanguage: 'zh_CN',
  });

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
      let docs: OpenAPI.Document;
      if (typeof openapi === 'function') {
        docs = await openapi();
        specs = JSON.stringify(docs);
      } else {
        const content = await readFile(path.resolve(openapi), 'utf8');
        if (openapi.endsWith('.yaml') || openapi.endsWith('.yml')) {
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
    if (!pathname.startsWith(uriPrefix)) return next();
    if (enable && !(await enable(ctx))) return next();

    if (pathname === uriPrefix || pathname === htmlPath) {
      await loading();
      ctx.send(html);
      return;
    }

    if (pathname === openapiPath) {
      await loading();
      ctx.send(specs);
      ctx.response.contentType = 'json';
      return;
    }

    return staticFn(ctx, next);
  });
};

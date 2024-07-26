import { compose, i18n, middleware, OpenAPI } from '@aomex/core';
import { serveStatic } from '@aomex/serve-static';
import type { WebContext, WebMiddleware } from '@aomex/web';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';

export interface SwaggerUIOptions {
  /**
   * 文档内容，有三种方式可以提供openapi文档：
   * 1. 文件路径，支持json和yaml格式
   * 2. 传入函数直接生成
   * 3. 利用`@aomex/openapi`动态生成
   *
   * ```typescript
   * import { generateOpenapi } from '@aomex/openapi';
   *
   * swaggerUI({ openapi: './openapi.json' });
   * swaggerUI({ openapi: './openapi.yaml' });
   * swaggerUI({
   *   openapi: () => {
   *     return {
   *       version: '3.0.0',
   *       info: { title: 'aomex', version: '1.0.1' },
   *       paths: {}
   *     };
   *   }
   * });
   * swaggerUI({
   *   openapi: async () => {
   *     return generateOpenapi({ routers: './src/routers' });
   *   }
   * });
   * ```
   */
  openapi: string | (() => Promise<OpenAPI.Document> | OpenAPI.Document);
  /**
   * 为了更好地区分常规接口和swagger文档，建议设置一个请求路径前缀。默认值：`'/swagger'`
   *
   */
  uriPrefix?: string;
  /**
   * 是否允许访问文档服务，每次请求都会询问
   */
  enable?: (ctx?: WebContext) => boolean | Promise<boolean>;
}

export const swaggerUI = (opts: SwaggerUIOptions): WebMiddleware => {
  let { uriPrefix = '/swagger', openapi, enable } = opts;
  uriPrefix = uriPrefix.split('/').map(encodeURIComponent).join('/');
  if (!uriPrefix.startsWith('/')) uriPrefix = '/' + uriPrefix;

  const htmlPath = path.posix.join(uriPrefix, 'index.html');
  const openapiPath = path.posix.join(uriPrefix, 'openapi.json');
  const publicDir = path.join(import.meta.dirname, '..', 'public');
  const htmlFile = path.join(publicDir, 'index.html');

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
        .replaceAll('#prefix#', uriPrefix)
        .replaceAll('#lang#', i18n.getLocale());
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

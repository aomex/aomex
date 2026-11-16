import type { OpenAPI } from '@aomex/common';
import { getFileValues } from '@aomex/internal-file-import';
import {
  Router,
  WebMiddleware,
  WebRequest,
  createEnvelopeOpenApiInjector,
  type EnvelopeOptions,
  type OpenApiInjector,
  type WebMiddlewareToken,
} from '@aomex/web';
import path from 'node:path';
import { methodToVerb } from './method-to-verb';
import snakeCase from 'lodash.snakecase';

export interface ParseFilesOptions {
  /** 全局中间件（与 `WebApp` 的 `mount` 对应） */
  mount?: WebMiddlewareToken[];
  /** 响应体套壳（与 `WebApp.envelope` 对应）；在全部中间件 `postMethod` 之后收口 */
  envelope?: EnvelopeOptions;
}

export const parseFiles = async (
  document: OpenAPI.Document,
  files: string[],
  options: ParseFilesOptions = {},
) => {
  const mount = options.mount ?? [];
  const envelopeInjector = options.envelope
    ? createEnvelopeOpenApiInjector(options.envelope)
    : undefined;
  const usedTags: string[] = [];

  const data: {
    pathName: string;
    pathItem: OpenAPI.PathItemObject;
    methodName: `${Lowercase<WebRequest['method']>}`;
    methodItem: OpenAPI.OperationObject;
    injector: OpenApiInjector;
    file: string;
    uri: string;
  }[] = [];

  /** 每个 operation 只出现一次，供 envelope 收口与标签补齐 */
  const operations: {
    pathName: string;
    pathItem: OpenAPI.PathItemObject;
    methodName: `${Lowercase<WebRequest['method']>}`;
    methodItem: OpenAPI.OperationObject;
    file: string;
    uri: string;
  }[] = [];

  for (const file of files) {
    const routers = await getFileValues<Router>(
      [file],
      (item) => !!item && item instanceof Router,
    );

    for (const router of routers) {
      const groupMiddlewareList = router['middlewareList'];
      const builders = router['builders'];

      for (const builder of builders) {
        if (builder.docs.showInOpenapi === false) continue;
        delete builder.docs.showInOpenapi;

        // 顺序与运行时一致：全局 mount → 路由组 → 接口级
        const builderMiddlewareList = mount
          .concat(groupMiddlewareList)
          .concat(builder['middlewareList'])
          .filter((middleware) => middleware instanceof WebMiddleware) as WebMiddleware[];

        const uri = builder['uri'];
        const pathName = normalizePath(uri);
        const pathItem: OpenAPI.PathItemObject = (document.paths[pathName] ||= {});

        for (const method of builder['methods']) {
          const methodName = method.toLowerCase() as `${Lowercase<WebRequest['method']>}`;
          const methodItem: OpenAPI.OperationObject = (pathItem[methodName] = {
            ...builder.docs,
            responses: {},
          });

          operations.push({
            pathItem,
            pathName,
            methodItem,
            methodName,
            file,
            uri,
          });

          data.push(
            ...builderMiddlewareList.map((item) => {
              return {
                injector: item['openapi'](),
                pathItem,
                pathName,
                methodItem,
                methodName,
                file,
                uri,
              };
            }),
          );
        }
      }
    }
  }

  for (const { injector } of data) {
    injector.onDocument?.(document);
  }
  for (const { injector, pathItem, pathName } of data) {
    injector.onPath?.(pathItem, { document, pathName });
  }
  for (const { injector, pathItem, pathName, methodItem, methodName } of data) {
    injector.onMethod?.(methodItem, {
      document,
      pathItem,
      pathName,
      methodName,
    });
  }
  for (const { injector, pathItem, pathName, methodItem, methodName } of data) {
    injector.postMethod?.(methodItem, {
      document,
      pathItem,
      pathName,
      methodName,
    });
  }
  // envelope 不在 mount 里，等价于最外层：全部中间件 postMethod 之后再收成 200
  if (envelopeInjector?.postMethod) {
    for (const { pathItem, pathName, methodItem, methodName } of operations) {
      envelopeInjector.postMethod(methodItem, {
        document,
        pathItem,
        pathName,
        methodName,
      });
    }
  }
  for (const { injector, pathItem, pathName } of data) {
    injector.postPath?.(pathItem, { document, pathName });
  }
  for (const { injector } of data) {
    injector.postDocument?.(document);
  }

  for (const { methodItem, methodName, file, uri } of operations) {
    methodItem.tags ||= [getTagByFilename(file)];
    methodItem.operationId ||= snakeCase(
      methodToVerb(methodName, uri) + ' ' + uri.replaceAll(':', '_by_'),
    );

    if (methodName === 'post') {
      // @ts-expect-error 防止验证警告
      methodItem['x-codegen-request-body-name'] = 'body';
    }

    if (!Object.keys(methodItem.responses).length) {
      methodItem.responses = { default: { description: '' } };
    }

    usedTags.push(...methodItem.tags!);
  }

  return [...new Set(usedTags)];
};

const normalizePath = (uri: string) => {
  return uri.replace(/:([a-z0-9_?]+)/gi, (_, $1) => {
    return `{${$1.replace(/[?]/g, '')}}`;
  });
};

const getTagByFilename = (file: string) => {
  return path.basename(file).replace(/\..+$/, '');
};

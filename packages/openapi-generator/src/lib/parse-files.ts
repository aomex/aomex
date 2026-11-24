import type { OpenAPI } from '@aomex/common';
import { getFileValues } from '@aomex/internal-file-import';
import {
  Router,
  WebMiddleware,
  WebRequest,
  X_SKIP_ENVELOPE,
  type OpenApiInjector,
  type WebMiddlewareToken,
} from '@aomex/web';
import path from 'node:path';
import { methodToVerb } from './method-to-verb';
import snakeCase from 'lodash.snakecase';

export interface ParseFilesOptions {
  /** 全局中间件（与 `WebApp` 的 `mount` / 自动插入的 envelope 对应） */
  mount?: WebMiddlewareToken[];
}

export const parseFiles = async (
  document: OpenAPI.Document,
  files: string[],
  options: ParseFilesOptions = {},
) => {
  const mount = options.mount ?? [];
  const usedTags: string[] = [];

  /** 每个 operation 及其中间件 injector（顺序与运行时一致：全局 → 组 → 接口） */
  const operations: {
    pathName: string;
    pathItem: OpenAPI.PathItemObject;
    methodName: `${Lowercase<WebRequest['method']>}`;
    methodItem: OpenAPI.OperationObject;
    injectors: OpenApiInjector[];
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
            injectors: builderMiddlewareList.map((item) => item['openapi']()),
            file,
            uri,
          });
        }
      }
    }
  }

  // on*：由外到内（与 mount 顺序一致）
  for (const { injectors } of operations) {
    for (const injector of injectors) {
      injector.onDocument?.(document);
    }
  }
  for (const { injectors, pathItem, pathName } of operations) {
    for (const injector of injectors) {
      injector.onPath?.(pathItem, { document, pathName });
    }
  }
  for (const { injectors, pathItem, pathName, methodItem, methodName } of operations) {
    for (const injector of injectors) {
      injector.onMethod?.(methodItem, {
        document,
        pathItem,
        pathName,
        methodName,
      });
    }
  }

  // post*：由内到外（倒序），保证最外层（如 envelope）最后收口
  for (const { injectors, pathItem, pathName, methodItem, methodName } of operations) {
    for (let i = injectors.length - 1; i >= 0; i--) {
      injectors[i]!.postMethod?.(methodItem, {
        document,
        pathItem,
        pathName,
        methodName,
      });
    }
  }
  // 清理 response({ skipEnvelope }) 写入的临时键（无论是否配置 envelope）
  for (const { methodItem } of operations) {
    delete (methodItem as Record<string, unknown>)[X_SKIP_ENVELOPE];
  }
  for (const { injectors, pathItem, pathName } of operations) {
    for (let i = injectors.length - 1; i >= 0; i--) {
      injectors[i]!.postPath?.(pathItem, { document, pathName });
    }
  }
  for (const { injectors } of operations) {
    for (let i = injectors.length - 1; i >= 0; i--) {
      injectors[i]!.postDocument?.(document);
    }
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

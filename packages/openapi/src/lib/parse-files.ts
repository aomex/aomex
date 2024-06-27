import { flattenMiddlewareToken, type OpenAPI } from '@aomex/core';
import { getFileValues } from '@aomex/internal-file-import';
import { Router } from '@aomex/router';
import { WebMiddleware, WebRequest, type OpenApiInjector } from '@aomex/web';
import path from 'node:path';
import { methodToVerb } from './method-to-verb';
import snakeCase from 'lodash.snakecase';

export const parseFiles = async (document: OpenAPI.Document, files: string[]) => {
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

  for (const file of files) {
    const routers = await getFileValues<Router>(
      [file],
      (item) => !!item && item instanceof Router,
    );

    for (const router of routers) {
      const groupMiddlewareList = flattenMiddlewareToken(router['middlewareChain']);
      const builders = router['builders'];

      for (const builder of builders) {
        const builderMiddlewareList = groupMiddlewareList
          .concat(builder['middlewareList'])
          .filter((middleware) => middleware instanceof WebMiddleware) as WebMiddleware[];

        for (const uri of builder['uris']) {
          const pathName = normalizePath(uri);
          const pathItem: OpenAPI.PathItemObject = (document.paths[pathName] ||= {});

          for (const method of builder['methods']) {
            const methodName =
              method.toLowerCase() as `${Lowercase<WebRequest['method']>}`;
            const methodItem: OpenAPI.OperationObject = (pathItem[methodName] = {
              ...builder.docs,
              responses: {},
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
  for (const { injector, pathItem, pathName } of data) {
    injector.postPath?.(pathItem, { document, pathName });
  }
  for (const { injector } of data) {
    injector.postDocument?.(document);
  }

  for (const { methodItem, methodName, file, uri } of data) {
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

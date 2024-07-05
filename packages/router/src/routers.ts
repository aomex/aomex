import { type ComposeFn, middleware } from '@aomex/core';
import {
  pathToFiles,
  type GlobPathOptions,
  getFileValues,
} from '@aomex/internal-file-import';
import type { WebRequest, WebMiddleware } from '@aomex/web';
import { Router } from './router';
import type { Builder } from './builder';

export const routers = (options: GlobPathOptions | Router[]): WebMiddleware => {
  let initialized: boolean = false;
  const staticCollections: Record<WebRequest['method'], Record<string, ComposeFn>> = {
    GET: {},
    POST: {},
    PUT: {},
    PATCH: {},
    DELETE: {},
    OPTIONS: {},
    HEAD: {},
  };
  const dynamicCollections: Record<
    WebRequest['method'],
    { match: Builder['match']; route: ComposeFn }[]
  > = {
    GET: [],
    POST: [],
    PUT: [],
    PATCH: [],
    DELETE: [],
    OPTIONS: [],
    HEAD: [],
  };
  staticCollections.HEAD = staticCollections.GET;
  dynamicCollections.HEAD = dynamicCollections.GET;

  let routers: Router[];
  let promise: Promise<void> = Promise.resolve();

  if (isRouters(options)) {
    routers = options;
  } else {
    promise = pathToFiles(options).then(async (files) => {
      routers = await getFileValues<Router>(
        files,
        (item) => !!item && item instanceof Router,
      );
    });
  }

  const initialize = () => {
    for (let i = 0; i < routers.length; ++i) {
      const router = routers[i]!;
      const subCollections = router['collect']();
      const methods = Object.keys(
        subCollections,
      ) as unknown as (typeof Builder)['METHODS'];
      methods.forEach((method) => {
        subCollections[method].forEach((item) => {
          if (item.isPureUri) {
            if (!Object.hasOwn(staticCollections[method], item.uri)) {
              staticCollections[method][item.uri] = item.route;
            }
          } else {
            dynamicCollections[method].push({ match: item.match, route: item.route });
          }
        });
      });
    }
    initialized = true;
  };

  return middleware.web(async (ctx, next) => {
    if (!routers) await promise;
    if (!initialized) initialize();

    const { method, pathname } = ctx.request;

    const staticCollection = staticCollections[method] || {};
    if (Object.hasOwn(staticCollection, pathname)) {
      return staticCollection[pathname]!(ctx, next);
    }

    const dynamicCollection = dynamicCollections[method] || [];
    for (let i = 0, len = dynamicCollection.length; i < len; ++i) {
      const params = dynamicCollection[i]!.match(pathname);
      if (params) {
        ctx.request.params = params;
        return dynamicCollection[i]!.route(ctx, next);
      }
    }

    return next();
  });
};

const isRouters = (options: GlobPathOptions | Router[]): options is Router[] => {
  return Array.isArray(options) && options.some((item) => item instanceof Router);
};

import { type ComposeFn, middleware } from '@aomex/core';
import {
  pathToFiles,
  type GlobPathOptions,
  getFileValues,
} from '@aomex/internal-file-import';
import { WebRequest, type WebMiddleware } from '@aomex/web';
import { Router } from './router';
import type { Builder } from './builder';

export const routers = (options: GlobPathOptions | Router[]): WebMiddleware => {
  let initialized: boolean = false;
  const collections: Record<
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
  collections.HEAD = collections.GET;

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
        collections[method].push(...subCollections[method]);
      });
    }
    initialized = true;
  };

  return middleware.web(async (ctx, next) => {
    if (!routers) await promise;
    if (!initialized) initialize();

    const { method, pathname } = ctx.request;
    const collection = collections[method];

    for (let i = 0; i < collection.length; ++i) {
      const { match, route } = collection[i]!;
      const params = match(pathname);
      if (params) {
        ctx.request.params = params;
        return route(ctx, next);
      }
    }

    return next();
  });
};

const isRouters = (options: GlobPathOptions | Router[]): options is Router[] => {
  return Array.isArray(options) && options.some((item) => item instanceof Router);
};

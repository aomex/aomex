import { type Compose, compose, middleware } from '@aomex/core';
import {
  fileToModules,
  pathToFiles,
  type PathToFileOptions,
} from '@aomex/utility';
import type { WebMiddleware } from '@aomex/web';
import { Router } from './router';

export interface RoutersOptions {
  path: PathToFileOptions;
}

export const routers = (
  options: string | RoutersOptions | Router[],
): WebMiddleware => {
  let composeFn: Compose | null = null;
  let promise: Promise<void> | null = null;

  if (Array.isArray(options)) {
    composeFn = compose(options.map(Router.toMiddleware));
  } else {
    options = typeof options === 'string' ? { path: options } : options;
    promise = (async () => {
      const files = await pathToFiles(options.path);
      const routers = await fileToModules<Router>(
        files,
        (item) => !!item && item instanceof Router,
      );
      composeFn = compose(routers.map(Router.toMiddleware));
    })();
  }

  return middleware.web(async (ctx, next) => {
    if (!composeFn) await promise;
    return composeFn!(ctx, next);
  });
};

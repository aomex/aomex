import { Cache, middleware } from '@aomex/core';
import { FileCache } from '@aomex/file-cache';

const fileCache = new FileCache();

export const cache = middleware.console<{ cache: Cache }>((ctx, next) => {
  ctx.cache = fileCache;
  return next();
});

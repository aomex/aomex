import { Cache, MemoryCache, middleware } from '@aomex/core';

const fileCache = new MemoryCache();

export const cache = middleware.console<{ cache: Cache }>((ctx, next) => {
  ctx.cache = fileCache;
  return next();
});

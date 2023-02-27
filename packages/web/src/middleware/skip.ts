import { extname } from 'node:path';
import { compose, Middleware, middleware } from '@aomex/core';
import { toArray } from '@aomex/helper';
import type { WebContext } from '../app';
import type { WebMiddleware, WebMiddlewareToken } from '../override';

export interface WebMiddlewareSkipOptions {
  custom?: (ctx: WebContext) => boolean | Promise<boolean>;
  path?: string | RegExp | (string | RegExp)[];
  ext?: string | string[];
  method?: string | string[];
}

/**
 * Skip specific middleware or chain
 * - by condition: options=`object|function`
 * - never skip  : options=`false`
 * - always skip : options=`true`
 */
export function skip<
  Props extends object,
  T extends
    | WebMiddlewareSkipOptions
    | NonNullable<WebMiddlewareSkipOptions['custom']>
    | boolean,
>(
  token: WebMiddlewareToken<Props>,
  options: T,
): WebMiddleware<
  T extends false ? Props : T extends true ? object : Partial<Props>
>;
export function skip<Props extends object = object>(
  token: WebMiddlewareToken<Props>,
  options:
    | WebMiddlewareSkipOptions
    | NonNullable<WebMiddlewareSkipOptions['custom']>
    | boolean,
): WebMiddleware<Props> {
  if (options === true) {
    return middleware.web((_, next) => next());
  }

  const originFn: Middleware.Fn<Props> =
    token instanceof Middleware ? token.fn : compose(toArray(token));

  if (options === false) {
    return middleware.web(originFn);
  }

  const opts = typeof options === 'function' ? { custom: options } : options;

  return middleware.web<Props>(async (ctx, next) => {
    const skipped = await shouldSkip(ctx, opts);
    return skipped ? next() : originFn(ctx, next);
  });
}

const shouldSkip = async (
  ctx: WebContext,
  options: WebMiddlewareSkipOptions,
): Promise<boolean> => {
  if (await options.custom?.(ctx)) return true;

  if (options.path) {
    const { path: pathname } = ctx.request;
    return toArray(options.path).some((path) =>
      typeof path === 'string'
        ? path === pathname
        : path.exec(pathname) !== null,
    );
  }

  if (options.ext) {
    const currentExt = extname(ctx.request.path);
    if (currentExt === '') return false;
    return toArray(options.ext).some((ext) => {
      return currentExt === (ext.startsWith('.') ? ext : `.${ext}`);
    });
  }

  if (options.method) {
    return toArray(options.method).includes(ctx.request.method);
  }

  return false;
};

import assert from 'node:assert';
import { Middleware, type Next, type OpenAPI } from '@aomex/core';
import type { NonReadonly } from '@aomex/utility';
import type { WebContext } from '../app/context';
// NOTICE: Do not import skip function from `../middleware/index`
import { skip, type WebMiddlewareSkipOptions } from '../middleware/skip';

declare module '@aomex/core' {
  export interface MiddlewarePlatform {
    readonly web: <Props extends object = object>(
      fn: (ctx: NonReadonly<Props> & WebContext, next: Next) => any,
    ) => WebMiddleware<Props>;
  }
}

export interface WebMiddlewareToDocument {
  document: OpenAPI.Document;
  pathItem?: OpenAPI.PathItemObject;
  methodItem?: OpenAPI.OperationObject;
}

export class WebMiddleware<
  Props extends object = object,
> extends Middleware<Props> {
  protected declare _web_middleware_: 'web-middleware';

  constructor(fn: (ctx: NonReadonly<Props> & WebContext, next: Next) => any) {
    super(fn);
  }

  public skipIf(
    options:
      | WebMiddlewareSkipOptions
      | NonNullable<WebMiddlewareSkipOptions['custom']>,
  ): WebMiddleware<Partial<Props>> {
    return skip(this, options);
  }

  public toDocument(options: WebMiddlewareToDocument) {
    assert(options);
  }
}

Middleware.register('web', WebMiddleware);

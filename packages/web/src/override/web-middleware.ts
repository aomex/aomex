import { Middleware, type Next, type OpenAPI } from '@aomex/core';
import type { NonReadonly } from '@aomex/internal-tools';
import type { WebContext, WebRequest } from '../http';

declare module '@aomex/core' {
  export interface MiddlewarePlatform {
    readonly web: <Props extends object = object>(
      fn: WebMiddlewareArguments<Props>['fn'] | WebMiddlewareArguments<Props>,
    ) => WebMiddleware<Props>;
  }
}

export interface OpenApiInjector {
  onDocument?: (document: OpenAPI.Document) => void;
  postDocument?: OpenApiInjector['onDocument'];

  onPath?: (
    pathItem: OpenAPI.PathItemObject,
    opts: { document: OpenAPI.Document; pathName: string },
  ) => void;
  postPath?: OpenApiInjector['onPath'];

  onMethod?: (
    methodItem: OpenAPI.OperationObject,
    opts: {
      document: OpenAPI.Document;
      pathName: string;
      pathItem: OpenAPI.PathItemObject;
      methodName: `${Lowercase<WebRequest['method']>}`;
    },
  ) => void;
  postMethod?: OpenApiInjector['onMethod'];
}

interface WebMiddlewareArguments<T extends object> {
  fn: (ctx: NonReadonly<T> & WebContext, next: Next) => any;
  openapi?: OpenApiInjector;
}

export class WebMiddleware<Props extends object = object> extends Middleware<Props> {
  public declare _contextType: WebContext;
  protected declare _web_middleware_: 'web-middleware';
  private readonly openapiInjector: OpenApiInjector;

  constructor(args: WebMiddlewareArguments<Props>['fn'] | WebMiddlewareArguments<Props>) {
    const { fn: fn, openapi = {} } =
      typeof args === 'function'
        ? ({ fn: args } satisfies WebMiddlewareArguments<Props>)
        : args;
    super(fn);
    this.openapiInjector = openapi;
  }

  protected openapi(): OpenApiInjector {
    return this.openapiInjector;
  }
}

Middleware.register('web', WebMiddleware);

import { mdchain, compose, flattenMiddlewareToken, type ComposeFn } from '@aomex/core';
import { toArray } from '@aomex/internal-tools';
import { WebApp, WebMiddlewareChain, type WebMiddlewareToken } from '@aomex/web';
import { Builder, type BuilderOptions } from './builder';

export interface RouterOptions<Props extends object = object> {
  prefix?: string;
  mount?: WebMiddlewareChain<Props>;
}

export class Router<Props extends object = object> {
  protected readonly middlewareChain: WebMiddlewareChain;
  protected readonly prefix: string;
  protected readonly builders: Builder[] = [];

  constructor(protected readonly opts: RouterOptions<Props> = {}) {
    this.prefix = opts.prefix || '';
    this.middlewareChain = opts.mount || mdchain.web;
  }

  public get<T extends WebMiddlewareToken[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['GET'], options);
  }

  public post<T extends WebMiddlewareToken[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['POST'], options);
  }

  public put<T extends WebMiddlewareToken[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['PUT'], options);
  }

  public patch<T extends WebMiddlewareToken[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['PATCH'], options);
  }

  public delete<T extends WebMiddlewareToken[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['DELETE'], options);
  }

  public all<T extends WebMiddlewareToken[] | []>(
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, Builder.METHODS, options);
  }

  public customize<T extends WebMiddlewareToken[] | []>(
    methods: (typeof Builder.METHODS)[number][],
    uri: string | string[],
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, methods, options);
  }

  protected create(
    uri: string | string[],
    methods: readonly (typeof Builder.METHODS)[number][],
    options: BuilderOptions<Props, any[]>,
  ): any {
    const builder = new Builder(this.prefix, toArray(uri), methods, options);
    options.disable !== true && this.builders.push(builder);
  }

  protected collect(app: WebApp) {
    const collections: Record<
      (typeof Builder)['METHODS'][number],
      { match: Builder['match']; route: ComposeFn }[]
    > = {
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
    };

    const routerMiddlewares = flattenMiddlewareToken(
      this.middlewareChain['split'](app['point']),
    );

    for (let i = 0; i < this.builders.length; ++i) {
      const builder = this.builders[i]!;
      for (const method of builder['methods']) {
        collections[method].push({
          match: builder.match.bind(builder),
          route: compose(routerMiddlewares.concat(builder['middlewareList'])),
        });
      }
    }

    return collections;
  }
}

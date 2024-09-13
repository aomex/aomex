import { Middleware, OpenAPI, compose, type ComposeFn } from '@aomex/core';
import type { Union2Intersection } from '@aomex/internal-tools';
import type { WebMiddlewareToken } from '../override';
import type { WebApp } from '../http';
import { Builder, type BuilderOptions } from './builder';

export interface RouterOptions<T extends WebMiddlewareToken[] | [] = any[]> {
  prefix?: string;
  mount?: T;
  docs?: Pick<OpenAPI.OperationObject, 'tags' | 'deprecated'>;
}

export class Router<
  T extends WebMiddlewareToken[] | [] = any[],
  Props extends object | unknown = WebApp.Props &
    Union2Intersection<Middleware.CollectArrayType<T[number]>>,
> {
  protected readonly middlewareList: WebMiddlewareToken[];
  protected readonly prefix: string;
  protected readonly builders: Builder[] = [];
  protected readonly docs: RouterOptions['docs'];

  constructor(protected readonly opts: RouterOptions<T> = {}) {
    this.prefix = opts.prefix || '';
    this.middlewareList = opts.mount || [];
    this.docs = opts.docs || {};
  }

  /**
   * 接收Get和Head请求，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public get<T extends WebMiddlewareToken[] | []>(
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['GET'], options);
  }

  /**
   * 接收Post请求，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public post<T extends WebMiddlewareToken[] | []>(
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['POST'], options);
  }

  /**
   * 接收Put请求，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public put<T extends WebMiddlewareToken[] | []>(
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['PUT'], options);
  }

  /**
   * 接收Patch请求，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public patch<T extends WebMiddlewareToken[] | []>(
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['PATCH'], options);
  }

  /**
   * 接收Delete请求，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public delete<T extends WebMiddlewareToken[] | []>(
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, ['DELETE'], options);
  }

  /**
   * 接收所有请求方法，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public all<T extends WebMiddlewareToken[] | []>(
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, Builder.METHODS, options);
  }

  /**
   * 接收指定的请求方法，路径规则请参考：https://www.npmjs.com/package/path-to-regexp
   */
  public customize<T extends WebMiddlewareToken[] | []>(
    methods: (typeof Builder.METHODS)[number][],
    uri: string,
    options: BuilderOptions<Props, T>,
  ): Builder.DTO<Props, T> {
    return this.create(uri, methods, options);
  }

  protected create(
    uri: string,
    methods: readonly (typeof Builder.METHODS)[number][],
    options: BuilderOptions<Props, any[]>,
  ): any {
    options.docs = { ...this.docs, ...options.docs };
    const builder = new Builder(this.prefix, uri, methods, options);
    options.disable !== true && this.builders.push(builder);
  }

  protected collect() {
    const collections: Record<
      (typeof Builder)['METHODS'][number],
      { uri: string; isPureUri: boolean; match: Builder['match']; route: ComposeFn }[]
    > = {
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: [],
    };

    for (let i = 0; i < this.builders.length; ++i) {
      const builder = this.builders[i]!;
      const handler = {
        uri: builder.uri,
        isPureUri: builder.isPureUri(),
        match: builder.match.bind(builder),
        route: compose(this.middlewareList.concat(builder['middlewareList'])),
      };
      for (const method of builder['methods']) {
        collections[method].push(handler);
      }
    }

    return collections;
  }
}

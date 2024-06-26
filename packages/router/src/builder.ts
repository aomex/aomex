import { Middleware, middleware, type OpenAPI } from '@aomex/core';
import type { Union2Intersection } from '@aomex/internal-tools';
import { WebContext, type WebMiddlewareToken } from '@aomex/web';
import { match } from 'path-to-regexp';

export declare namespace Builder {
  export type DTO<
    Props extends object | unknown,
    T extends WebMiddlewareToken[] | [],
  > = Omit<
    Props & Union2Intersection<Middleware.CollectArrayType<T[number]>>,
    ResponseMethods
  >;

  export type Interface<
    Props extends object | unknown,
    T extends WebMiddlewareToken[] | [],
  > = Props & Union2Intersection<Middleware.CollectArrayType<T[number]>>;

  export type Context<
    Props extends object | unknown,
    T extends WebMiddlewareToken[] | [],
  > = Interface<Props, T> & OverrideWebContext<Interface<Props, T>>;

  type ResponseMethods = 'send' | 'throw' | 'redirect';

  type OverrideWebContext<Props extends object | unknown> = 'send' extends keyof Props
    ? Omit<WebContext, ResponseMethods>
    : 'throw' extends keyof Props
      ? Omit<WebContext, ResponseMethods>
      : 'redirect' extends keyof Props
        ? Omit<WebContext, ResponseMethods>
        : WebContext;

  export type Docs = Omit<
    OpenAPI.OperationObject,
    'parameters' | 'requestBody' | 'responses'
  >;
}

export interface BuilderOptions<
  Props extends object | unknown,
  T extends WebMiddlewareToken[] | [],
> {
  /**
   * 禁用当前路由。默认 `false`
   */
  disable?: boolean;
  mount?: T;
  docs?: Builder.Docs;
  action: (ctx: Builder.Context<Props, T>) => any;
}

type PureUri = string | undefined;
const pureUriPattern = /^[\/a-z0-9-_]+$/i;
const duplicatedSlash = /\/{2,}/g;
const sideSlash = /(^\/|\/$)/g;

export class Builder<
  Props extends object | unknown = object,
  T extends WebMiddlewareToken[] | [] = [],
> {
  static METHODS = <const>['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

  public readonly docs?: Builder.Docs;
  protected readonly middlewareList: WebMiddlewareToken[];
  protected readonly uriPatterns: [ReturnType<typeof match>, PureUri][];

  constructor(
    prefix: string,
    protected readonly uris: string[],
    protected readonly methods: readonly (typeof Builder.METHODS)[number][],
    options: BuilderOptions<Props, T>,
  ) {
    this.docs = options.docs;
    this.middlewareList = [
      ...(options.mount || []),
      middleware.web((ctx, _) => options.action(ctx as any)),
    ];

    const uriPatterns: typeof this.uriPatterns = (this.uriPatterns = []);
    for (let i = uris.length; i-- > 0; ) {
      const uri = (uris[i] =
        '/' +
        (prefix + uris[i]!).replaceAll(duplicatedSlash, '/').replaceAll(sideSlash, ''));
      uriPatterns.push([
        match(uri, { decode: decodeURIComponent }),
        pureUriPattern.test(uri) ? uri : void 0,
      ]);
    }
  }

  public match(pathname: string): Record<string, unknown> | false {
    const patterns = this.uriPatterns;
    for (let i = patterns.length; i-- > 0; ) {
      const [matchFn, pureUri] = patterns[i]!;

      if (pureUri === pathname) return {};

      const matchResult = matchFn(pathname);
      if (matchResult) return matchResult.params;
    }

    return false;
  }
}

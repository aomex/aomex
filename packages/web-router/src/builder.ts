import { Chain, middleware, type OpenAPI } from '@aomex/core';
import type { Union2Intersection } from '@aomex/helper';
import { WebChain, WebContext, WebMiddlewareToken } from '@aomex/web';
import { pathToRegexp, Key } from 'path-to-regexp';

type CollectArrayType<T> = T extends WebMiddlewareToken<infer R> ? R : object;

export type RouterDocs = Omit<
  OpenAPI.OperationObject,
  'parameters' | 'requestBody' | 'responses'
>;

export interface BuilderOptions<
  Props extends object,
  T extends WebMiddlewareToken[] | [],
> {
  mount?: T;
  docs?: RouterDocs;
  action: (
    ctx: Props & Union2Intersection<CollectArrayType<T[number]>> & WebContext,
  ) => any;
}

type PureUri = string | undefined;
const pureUriPattern = /^[\/a-z0-9-_]+$/i;
const duplicateSlash = /\/{2,}/g;
const suffixSlash = /\/+$/;

export class Builder<
  Props extends object = object,
  T extends WebMiddlewareToken[] | [] = [],
> {
  public static METHODS = <const>[
    'GET',
    'POST',
    'PUT',
    'PATCH',
    'DELETE',
    'HEAD',
    'OPTIONS',
  ];

  public readonly chain: WebChain;
  public readonly docs?: RouterDocs;
  protected readonly uriPatterns: [RegExp, Key[], PureUri][];

  constructor(
    prefix: string,
    public readonly uris: string[],
    public readonly methods: (typeof Builder)['METHODS'][number][],
    options: BuilderOptions<Props, T>,
  ) {
    const middlewareList = Chain.flatten(options.mount);
    middlewareList.push(
      middleware.web((ctx, _) => options.action!(ctx as any)),
    );

    this.chain = new WebChain(middlewareList);
    this.docs = options.docs;

    const uriPatterns: typeof this.uriPatterns = (this.uriPatterns = []);
    for (let i = uris.length; i-- > 0; ) {
      const uri = (uris[i] = ('/' + prefix + uris[i]!)
        .replace(suffixSlash, '')
        .replaceAll(duplicateSlash, '/'));
      const keysRef: Key[] = [];
      uriPatterns.push([
        pathToRegexp(uri, keysRef),
        keysRef,
        pureUriPattern.test(uri) ? uri : void 0,
      ]);
    }
  }

  public match(
    pathname: string,
    method: string,
  ): Record<string, unknown> | boolean {
    if (!this.isMethodAllowed(method)) return false;

    const patterns = this.uriPatterns;
    for (let i = patterns.length; i-- > 0; ) {
      const [regexp, keys, pureUri] = patterns[i]!;

      if (pureUri === pathname) return true;

      const matched = pathname.match(regexp);
      if (!matched) continue;
      if (matched.length <= 1) return true;

      const params: Record<string, any> = {};
      for (let keyIndex = matched.length; keyIndex-- > 1; ) {
        params[keys[keyIndex - 1]!.name] = Builder.decodeURIComponent(
          matched[keyIndex]!,
        );
      }
      return params;
    }

    return false;
  }

  public isMethodMismatch(pathname: string, method: string): boolean {
    if (this.isMethodAllowed(method)) return false;

    const patterns = this.uriPatterns;
    for (let i = patterns.length; i-- > 0; ) {
      const [regexp, , pureUri] = patterns[i]!;
      if (pureUri === pathname || regexp.test(pathname)) return true;
    }

    return false;
  }

  protected isMethodAllowed(method: string): boolean {
    return this.methods.includes(method as any);
  }

  protected static decodeURIComponent(text: string): any {
    try {
      return decodeURIComponent(text);
    } catch {
      return text;
    }
  }
}

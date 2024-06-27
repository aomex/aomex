import { toArray } from '@aomex/internal-tools';
import type { Middleware } from './middleware';
import { flattenMiddlewareToken } from './flatten-middleware-token';

export type MiddleWareToken<P extends object = object> =
  | MiddlewareChain<P>
  | Middleware<P>;

export interface MiddlewareChainPlatform {}

export declare namespace MiddlewareChain {
  export type Infer<T> = T extends MiddlewareChain<infer R> ? R : never;
}

export abstract class MiddlewareChain<Props extends object = object> {
  protected _!: Props;
  protected static autoIncrementID = 0;

  /**
   * 注册链条
   */
  public static register(
    platform: keyof MiddlewareChainPlatform,
    SubClass: new (...args: any[]) => MiddlewareChain,
  ) {
    Object.defineProperty(mdchain, platform, {
      get() {
        return new SubClass();
      },
    });
  }

  protected createPoint() {
    const point = 'point_' + ++MiddlewareChain.autoIncrementID;
    this.points[point] = this.middlewareList.length;
    return point;
  }

  /**
   * 分割链条成两段，并返回后面那一段
   */
  protected split(point: string | string[] = []): this {
    const longestLengthOfPoint = toArray(point)
      .map((p) => this.points[p]!)
      .filter(Boolean)
      .sort((a, b) => b - a)[0];
    if (!longestLengthOfPoint) return this;
    const middlewareList = this.middlewareList.slice(longestLengthOfPoint);
    // @ts-expect-error
    return new this.SubClass(middlewareList);
  }

  protected readonly SubClass: new (middlewareList?: Middleware[]) => MiddlewareChain;
  protected points: Record<string, number> = {};

  constructor(protected readonly middlewareList: Middleware[] = []) {
    // @ts-expect-error
    this.SubClass = new.target;
  }

  /**
   * 挂载中间件和链条，支持传入`null`
   */
  protected mount<P extends object>(
    token: MiddleWareToken<P> | null,
  ): MiddlewareChain<Props & P> {
    const chain = new this.SubClass(
      this.middlewareList.concat(flattenMiddlewareToken(token)),
    );
    chain.points = this.points;
    return chain as any;
  }
}

export const mdchain: MiddlewareChainPlatform = {} as any;

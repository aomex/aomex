import { toArray } from '@aomex/helper';
import type { Middleware } from './middleware';
import type { PureChain } from './pure-chain';

export type MiddleWareToken<P extends object = object> =
  | Chain<P>
  | Middleware<P>;

export interface ChainPlatform {
  /**
   * pure middleware manager without context
   */
  readonly pure: PureChain;
}

export abstract class Chain<Props extends object = object> {
  protected static autoIncrementID = 0;

  /**
   * Register chain creator
   */
  public static register(
    platform: keyof ChainPlatform,
    SubChain: new (...args: any[]) => Chain,
  ) {
    Object.defineProperty(chain, platform, {
      get() {
        return new SubChain();
      },
    });
  }

  /**
   * Flatten mixed middleware and chain
   */
  public static flatten(
    middleware?: MiddleWareToken | null | Array<MiddleWareToken | null>,
  ): Middleware[] {
    if (Array.isArray(middleware)) {
      return middleware.reduce(
        (carry, item) => carry.concat(Chain.flatten(item)),
        <Middleware[]>[],
      );
    }

    return middleware == null
      ? []
      : middleware instanceof Chain
      ? middleware.middlewareList.slice()
      : [middleware];
  }

  public static createSplitPoint(chain: Chain) {
    const point = 'point_' + ++this.autoIncrementID;
    chain.points[point] = chain.middlewareList.length;
    return point;
  }

  /**
   * Split one chain to two chains, and returning last one
   */
  public static split(chain: Chain, point: string | string[] = []) {
    const longestLengthOfPoint = toArray(point)
      .map((p) => chain.points[p]!)
      .filter(Boolean)
      .sort((a, b) => b - a)[0];
    if (!longestLengthOfPoint) return chain;
    const middlewareList = chain.middlewareList.slice(longestLengthOfPoint);
    return new chain.SubClass(middlewareList);
  }

  protected readonly SubClass: new (middlewareList?: Middleware[]) => Chain;
  protected points: Record<string, number> = {};

  constructor(protected readonly middlewareList: Middleware[] = []) {
    // @ts-expect-error
    this.SubClass = new.target;
  }

  /**
   * Mount a middleware or chain, input `null` for condition statement
   */
  protected mount<P extends object>(
    middleware: MiddleWareToken<P> | null,
  ): Chain<Props & P> {
    const chain = new this.SubClass(
      this.middlewareList.concat(Chain.flatten(middleware)),
    );
    chain.points = this.points;
    return chain;
  }
}

export const chain: ChainPlatform = {} as any;

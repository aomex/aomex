export type NonReadonly<T extends object> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * 是否为「封闭」普通对象（可对多余键做精确约束）。
 * 排除：原始类型、函数、数组、带 string/number 索引签名的开放对象。
 */
type IsClosedObject<T> = [T] extends [object]
  ? [T] extends [Function]
    ? false
    : [T] extends [readonly any[]]
      ? false
      : string extends keyof T
        ? false
        : number extends keyof T
          ? false
          : true
  : false;

/** 去掉 `null` / `undefined`，便于对 `T | null` 等联合里的对象分支做多余键检查 */
type StripNullish<T> = Exclude<T, null | undefined>;

/** 判断 `T` 是否为联合类型 */
export type IsUnion<T, U = T> = T extends any ? ([U] extends [T] ? false : true) : never;

/** 按联合成员分别精确匹配，再交回调用处做可赋值判断 */
type ExactDistribute<Expected, Actual> = Expected extends any
  ? Exact<Expected, Actual>
  : never;

/** 数组 / 元组：逐元素精确匹配，保留元组长度 */
type ExactItems<Item, Actual> = {
  [I in keyof Actual]: Exact<Item, Actual[I]>;
};

/**
 * 将 `Actual` 约束为不得含有 `Expected` 之外的键（递归到嵌套对象与数组元素）。
 *
 * 典型用法：回调返回值须精确匹配 `Validator.Infer<Schema>`（如 `envelope.slot` /
 * `response` / `emit` / `formatError`），新鲜字面量或多余字段的变量都能在类型上报错。
 * 原始类型、函数、索引签名对象不做多余键拦截。
 * 对象联合按每个成员分别匹配（避免 `keyof` 交集为 `never`）。
 * `T | null` / `T | undefined`：`Actual` 为 nullish 时原样保留；为对象时对去掉 nullish 后的 `T` 精确匹配。
 *
 * ```ts
 * declare function f<S, R extends Validator.Infer<S>>(
 *   schema: S,
 *   get: () => Exact<Validator.Infer<S>, R>,
 * ): void;
 * f({ id: rule.number() }, () => ({ id: 1 }));
 * // @ts-expect-error 多余字段
 * f({ id: rule.number() }, () => ({ id: 1, extra: true }));
 * ```
 */
export type Exact<Expected, Actual> =
  // Actual 已是 null/undefined：原样保留（是否合法由 `R extends Expected` 约束）
  [Actual] extends [null | undefined]
    ? Actual
    : IsUnion<StripNullish<Expected>> extends true
      ? ExactDistribute<StripNullish<Expected>, Actual>
      : StripNullish<Expected> extends readonly (infer Item)[]
        ? ExactItems<Item, Actual>
        : IsClosedObject<StripNullish<Expected>> extends true
          ? {
              [K in keyof Actual]: K extends keyof StripNullish<Expected>
                ? Exact<StripNullish<Expected>[K], Actual[K]>
                : never;
            }
          : Actual;

export type Union2Intersection<T> = (T extends any ? (arg: T) => void : never) extends (
  arg: infer P,
) => void
  ? P
  : never;

export type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>;
} & {};

/**
 * 抽出全部调用签名（含重载）。利用「infer 只看到最后一个签名 + 交叉可改对齐」逐个剥离。
 * @see https://github.com/microsoft/TypeScript/issues/29732
 */
export type CallSignatures<T, Acc = unknown> = T extends (...args: any) => any
  ? Acc extends T
    ? never
    : | ((...args: Parameters<T>) => ReturnType<T>)
      | CallSignatures<Acc & T, Acc & ((...args: Parameters<T>) => ReturnType<T>)>
  : never;

type PromisifySignature<T> = T extends (...args: infer A) => infer R
  ? (...args: A) => Promise<Awaited<R>>
  : never;

/**
 * 将函数（含重载）的返回值 Promise 化；各重载签名分别保留。
 * 非函数类型原样返回。
 *
 * 若签名本身已返回 `Promise`（含方法级泛型如 `withBindings`），则原样保留：
 * 再走 `CallSignatures` 展开会丢失泛型推断，并可能触发 TS2589。
 */
export type PromisifyFunction<T> = T extends (...args: any) => Promise<any>
  ? T
  : [CallSignatures<T>] extends [never]
    ? T
    : Union2Intersection<PromisifySignature<CallSignatures<T>>>;

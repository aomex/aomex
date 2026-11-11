export type NonReadonly<T extends object> = {
  -readonly [K in keyof T]: T[K];
};

export type Union2Intersection<T> = (T extends any ? (arg: T) => void : never) extends (
  arg: infer P,
) => void
  ? P
  : never;

export type Prettify<T> = {
  [K in keyof T]: Prettify<T[K]>;
} & {};

/** 判断 `T` 是否为联合类型 */
export type IsUnion<T, U = T> = T extends any ? ([U] extends [T] ? false : true) : never;

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
 */
export type PromisifyFunction<T> = [CallSignatures<T>] extends [never]
  ? T
  : Union2Intersection<PromisifySignature<CallSignatures<T>>>;

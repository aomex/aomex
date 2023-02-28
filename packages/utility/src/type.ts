export type NonReadonly<T extends object> = {
  -readonly [K in keyof T]: T[K];
};

export type Union2Intersection<T> = (
  T extends any ? (arg: T) => void : never
) extends (arg: infer P) => void
  ? P
  : never;

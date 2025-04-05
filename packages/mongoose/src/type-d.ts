import type { Model, SchemaOptions } from 'mongoose';

export type ModelInfer<M extends Model<any>> = M extends Model<infer R> ? R : never;

export type TimestampSetting<TS extends SchemaOptions['timestamps']> =
  undefined extends TS
    ? {}
    : TS extends false
      ? {}
      : TS extends true
        ? DefaultTimestamp
        : TimestampCreatedAt<TS> & TimestampUpdatedAt<TS>;

type TimestampCreatedAt<T> = T extends { createdAt: true }
  ? { createdAt: Date }
  : T extends { createdAt: false }
    ? {}
    : T extends { createdAt: infer Name extends string }
      ? { [K in Name]: Date }
      : { createdAt: Date };

type TimestampUpdatedAt<T> = T extends { updatedAt: true }
  ? { updatedAt: Date }
  : T extends { updatedAt: false }
    ? {}
    : T extends { updatedAt: infer Name extends string }
      ? { [K in Name]: Date }
      : { updatedAt: Date };

interface DefaultTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

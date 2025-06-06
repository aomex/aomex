import type { Validator } from '@aomex/common';
import type { Model, mongo, SchemaOptions } from 'mongoose';

export type ModelInput<M extends Model<any, any, any, any, any, any>> =
  M extends Model<any, any, any, any, any, infer T extends Record<string, Validator>>
    ? {
        -readonly [K in keyof T as true extends IsInputRequired<T[K]>
          ? K
          : never]: T[K] extends Validator<infer U>
          ? U extends null | Validator.TDefault | Validator.TOptional
            ? never
            : U
          : never;
      } & {
        -readonly [K in keyof T as true extends IsInputRequired<T[K]>
          ? never
          : K]?: T[K] extends Validator<infer U>
          ? U extends null
            ? null | undefined
            : U extends Validator.TDefault | Validator.TOptional
              ? undefined
              : U
          : never;
      }
    : never;

type IsInputRequired<T> =
  true extends Validator.HasUndefined<T>
    ? false
    : true extends Validator.HasNull<T>
      ? false
      : true extends Validator.HasDefault<T>
        ? false
        : true;

export type ModelOutput<M extends Model<any, any, any, any, any, any>> = {
  _id: mongo.ObjectId;
} & (M extends Model<infer R, any, any, any, any, any> ? R : never);

export type VersionKeySetting<Ver extends SchemaOptions['versionKey']> =
  undefined extends Ver
    ? { __v: number }
    : Ver extends true
      ? { __v: number }
      : Ver extends false
        ? {}
        : Ver extends infer R extends string
          ? { [K in R]: number }
          : {};

export type TimestampSetting<Time extends SchemaOptions['timestamps']> =
  undefined extends Time
    ? {}
    : Time extends false
      ? {}
      : Time extends true
        ? DefaultTimestamp
        : TimestampCreatedAt<Time> & TimestampUpdatedAt<Time>;

type TimestampCreatedAt<Time> = Time extends { createdAt: true }
  ? { createdAt: Date }
  : Time extends { createdAt: false }
    ? {}
    : Time extends { createdAt: infer Name extends string }
      ? { [K in Name]: Date }
      : { createdAt: Date };

type TimestampUpdatedAt<Time> = Time extends { updatedAt: true }
  ? { updatedAt: Date }
  : Time extends { updatedAt: false }
    ? {}
    : Time extends { updatedAt: infer Name extends string }
      ? { [K in Name]: Date }
      : { updatedAt: Date };

export interface DefaultTimestamp {
  createdAt: Date;
  updatedAt: Date;
}

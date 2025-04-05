import {
  Document,
  mongo,
  type Default__v,
  type FlattenMaps,
  type Require_id,
} from 'mongoose';

export type MongoResult<T> = {
  [K in keyof T as K extends
    | '__v'
    | 'created_at'
    | 'createdAt'
    | 'updated_at'
    | 'updatedAt'
    ? never
    : K extends '_id'
      ? 'id'
      : K]: T[K] extends mongo.Decimal128 | mongo.ObjectId ? string : T[K];
};

const excludedFields = ['created_at', 'createdAt', 'updated_at', 'updatedAt', '__v'];

/**
 * 格式化mongo查询结果：
 * - 字段 _id 转为 id
 * - decimal128类型 转为 字符串
 * - objectId类型 转为 字符串
 * - 去掉 createdAt/created_at 字段
 * - 去掉 updatedAt/updated_at 字段
 */
export function formatMongoResult<T extends Document>(
  data: T[],
): MongoResult<
  T extends Document<any, any, infer R> ? FlattenMaps<Default__v<Require_id<R>>> : never
>[];
export function formatMongoResult<T extends Record<string, any>>(
  data: T[],
): MongoResult<T>[];
export function formatMongoResult<T extends Document | null>(
  data: T,
): T extends Document
  ? MongoResult<
      T extends Document<any, any, infer R>
        ? FlattenMaps<Default__v<Require_id<R>>>
        : never
    >
  : null;
export function formatMongoResult<T extends Record<string, any> | null>(
  data: T,
): T extends Record<string, any> ? MongoResult<T> : null;
export function formatMongoResult<T extends Record<string, any>>(data: T | T[] | null) {
  if (data == null) return null;

  const newDate = (Array.isArray(data) ? data : [data]).map((item) => {
    if (item instanceof Document) {
      item = item.toJSON({ flattenMaps: true });
    }

    const newItem: Record<string, any> = {};
    for (let [key, value] of Object.entries(item)) {
      if (excludedFields.includes(key)) continue;
      if (key === '_id') key = 'id';

      if (value instanceof mongo.Decimal128) {
        newItem[key] = value.toString();
      } else if (value instanceof mongo.ObjectId) {
        newItem[key] = value.toHexString();
      } else {
        newItem[key] = value;
      }
    }
    return newItem;
  });
  return Array.isArray(data) ? newDate : newDate[0];
}

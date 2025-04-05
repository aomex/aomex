import {
  Document,
  mongo,
  type Default__v,
  type FlattenMaps,
  type Require_id,
} from 'mongoose';

export type MongoResult<T, Remove extends boolean> = {
  [K in keyof T as K extends '__v'
    ? never
    : Remove extends true
      ? K extends (typeof excludedFields)[number]
        ? never
        : K
      : K extends '_id'
        ? 'id'
        : K]: T[K] extends mongo.Decimal128 | mongo.ObjectId ? string : T[K];
};

const excludedFields = <const>[
  'created_at',
  'createdAt',
  'updated_at',
  'updatedAt',
  '_id',
];

export function formatMongoResult<T extends Document, Remove extends boolean>(
  data: T[],
  removeColumns?: Remove,
): MongoResult<
  T extends Document<any, any, infer R> ? FlattenMaps<Default__v<Require_id<R>>> : never,
  Remove
>[];
export function formatMongoResult<T extends Record<string, any>, Remove extends boolean>(
  data: T[],
  removeColumns?: Remove,
): MongoResult<T, Remove>[];
export function formatMongoResult<T extends Document | null, Remove extends boolean>(
  data: T,
  removeColumns?: Remove,
): T extends Document
  ? MongoResult<
      T extends Document<any, any, infer R>
        ? FlattenMaps<Default__v<Require_id<R>>>
        : never,
      Remove
    >
  : null;
export function formatMongoResult<
  T extends Record<string, any> | null,
  Remove extends boolean,
>(
  data: T,
  removeColumns?: Remove,
): T extends Record<string, any> ? MongoResult<T, Remove> : null;
/**
 * 格式化mongo查询结果，支持传入 纯JSON 和 Document 两种对象格式，返回结果遵循如下规则：
 * - 去掉 __v 字段
 * - decimal128类型 转为 字符串
 * - objectId类型 转为 字符串
 * - removeColumns=true时，去掉 _id 字段
 * - removeColumns=false时，_id 字段转为 id
 * - removeColumns=true时，去掉 createdAt/created_at 字段
 * - removeColumns=true时，去掉 updatedAt/updated_at 字段
 *
 * @param {Boolean} removeColumns 是否去掉数据库扩展的字段
 */
export function formatMongoResult(
  data: Record<string, any> | Record<string, any>[] | Document | Document[] | null,
  removeColumns: boolean = false,
) {
  if (data == null) return null;

  const newDate = (Array.isArray(data) ? data : [data]).map((item) => {
    if (item instanceof Document) {
      item = item.toJSON({ flattenMaps: true });
    }

    const newItem: Record<string, any> = {};
    for (let [key, value] of Object.entries(item)) {
      if (key === '__v') continue;
      if (removeColumns && excludedFields.includes(key as any)) continue;
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

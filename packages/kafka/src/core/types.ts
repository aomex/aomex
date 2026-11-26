type JsonPrimitive = string | number | boolean | null;

type Blocked =
  | Date
  | RegExp
  | Function
  | Error
  | Map<unknown, unknown>
  | Set<unknown>
  | WeakMap<object, unknown>
  | WeakSet<object>
  | Promise<unknown>
  | ArrayBuffer
  | SharedArrayBuffer
  | DataView
  | bigint
  | symbol
  | undefined
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | BigUint64Array
  | Int8Array
  | Int16Array
  | Int32Array
  | BigInt64Array
  | Float32Array
  | Float64Array;

/**
 * 主题消息体是否为可 JSON 序列化的值。
 * 拒绝 Date、bigint、Buffer、函数、Map/Set 等编码后无法原样还原的类型。
 */
export type IsKafkaValue<T> = T extends unknown
  ? [T] extends [JsonPrimitive]
    ? true
    : [T] extends [Blocked]
      ? false
      : [T] extends [readonly (infer Item)[]]
        ? [IsKafkaValue<Item>] extends [true]
          ? true
          : false
        : [T] extends [object]
          ? keyof T extends never
            ? true
            : [KafkaFieldFlags<T>] extends [true]
              ? true
              : false
          : false
  : false;

type KafkaFieldFlags<T> = {
  [K in keyof T]-?: IsKafkaField<T[K]>;
}[keyof T];

type IsKafkaField<T> = [T] extends [undefined]
  ? false
  : [undefined] extends [T]
    ? IsKafkaValue<Exclude<T, undefined>>
    : IsKafkaValue<T>;

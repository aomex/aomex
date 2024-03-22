/**
 * 返回数组，如果传入非数组，则会包装成只有一个元素的数组
 * @param data 非数组或者数组
 * @param unique 是否需要去重。默认：`false`
 */
export function toArray<T>(data: T | readonly T[], unique?: boolean): T[];
export function toArray<T>(data: T | T[], unique?: boolean): T[];
export function toArray<T>(data: T | T[], unique: boolean = false): T[] {
  return Array.isArray(data) ? (unique ? [...new Set(data)] : data) : [data];
}

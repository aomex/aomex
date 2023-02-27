export function toArray<T>(data: T | readonly T[], unique?: boolean): T[];
export function toArray<T>(data: T | T[], unique?: boolean): T[];
export function toArray<T>(data: T | T[], unique: boolean = false): T[] {
  return Array.isArray(data) ? (unique ? [...new Set(data)] : data) : [data];
}

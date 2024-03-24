export interface Caching {
  /**
   * 查看缓存是否存在
   */
  exists(key: string): Promise<boolean>;

  /**
   *
   * 获取缓存。如果未找到缓存并且未提供默认值，则返回`null`
   * ```typescript
   * await cache.get('key'); // null
   * await cache.get('key', 'my-value'); // my-value
   * ```
   */
  get<T>(key: string, defaultValue: T): Promise<T>;
  get<T extends string | number | object | boolean>(
    key: string,
  ): Promise<T | null>;

  /**
   * 获取缓存后立即将该值从引擎中删除。如果未找到缓存并且未提供默认值，则返回`null`
   *
   * ```typescript
   * await cache.set('key', 'value');
   * await cache.getAndDelete<string>('key'); // 'value'
   * await cache.get('key'); // null
   * ```
   */
  getAndDelete<T>(key: string, defaultValue: T): Promise<T>;
  getAndDelete<T extends string | number | object | boolean>(
    key: string,
  ): Promise<T | null>;

  /**
   * 获取缓存。如果没有值，则设置该缓存
   *
   * ```typescript
   * await cache.get('key'); // null
   * await cache.getOrSet('key', () => 'value'); // 'value'
   * await cache.get('key'); // 'value'
   * ```
   */
  getOrSet<T extends string | number | object | boolean>(
    key: string,
    orSet: () => T,
    durationMs?: number,
  ): Promise<T>;
  getOrSet<T extends string | number | object | boolean>(
    key: string,
    orSet: () => Promise<T>,
    durationMs?: number,
  ): Promise<T>;

  /**
   * 设置缓存。可以指定过期时间（毫秒）
   *
   * ```typescript
   * await cache.set('key', 'value');
   * await cache.set('key', 'value', 3600);
   * ```
   */
  set(
    key: string,
    value: string | number | object | boolean,
    durationMs?: number,
  ): Promise<boolean>;

  /**
   * 设置缓存。如果缓存已经存在，则设置失败，返回`false`
   *
   * ```typescript
   * await cache.exists('key'); // false
   * await cache.add('key', 'value'); // true
   *
   * await cache.exists('key'); // true
   * await cache.add('key', 'value'); // false
   * ```
   */
  add(key: string, value: any, durationMs?: number): Promise<boolean>;

  /**
   * 删除指定缓存
   */
  delete(key: string): Promise<boolean>;

  /**
   * 删除所有缓存。若指定了keyPrefix，则只删除有该前缀的缓存
   */
  deleteAll(): Promise<boolean>;
}

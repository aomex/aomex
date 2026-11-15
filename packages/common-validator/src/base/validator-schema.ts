import type { Validator } from './validator';
import {
  normalizeFieldTable,
  type NormalizeFieldTable,
  type ValidatorToken,
} from '../api/to-validator';

type HasPublicOptional = { optional: () => any };
type HasPublicRequired = { required: () => any };

type PartialBlockedByTransform =
  '部分字段携带了 transform，无法调用 partial()；可改为指定其中不含 transform 的字段';

type RequiredBlockedByTransform =
  '部分字段携带了 transform，无法调用 required()；可改为指定其中不含 transform 的字段';

type PartialRules<T> = {
  [K in keyof T]: T[K] extends { optional: () => infer R }
    ? R extends Validator
      ? R
      : never
    : never;
};

type RequiredRules<T> = {
  [K in keyof T]: T[K] extends { required: () => infer R }
    ? R extends Validator
      ? R
      : never
    : never;
};

type PartialableKey<T> = {
  [P in keyof T]-?: T[P] extends HasPublicOptional ? P & string : never;
}[keyof T];

type RequireableKey<T> = {
  [P in keyof T]-?: T[P] extends HasPublicRequired ? P & string : never;
}[keyof T];

function normalizeKeys<K>(keys: K[] | [readonly K[]]): K[] {
  if (keys.length === 1 && Array.isArray(keys[0])) {
    return [...keys[0]];
  }
  return keys as K[];
}

export class ValidatorSchema<T extends Record<string, Validator<any>>> {
  constructor(
    protected readonly rules: T,
    /**
     * 可选的 OpenAPI 具名组件名；`pick` / `omit` / `extend` / `partial` / `required` 不会带上该名称
     */
    protected readonly name?: string,
  ) {}

  /**
   * 为 schema 指定 OpenAPI 文档中的具名组件名，字段定义不变。
   * 生成文档时会按该名称引用；未指定则不单独抽成组件。
   * 名称不会传到 `pick` / `omit` 等派生结果；经 `rule.object(schema)` / `toValidator` 转换后写入 `refName`。
   *
   * ```typescript
   * const userSchema = schema({ id: rule.int(), name: rule.string() }).asName('User');
   * ```
   */
  asName(name: string): ValidatorSchema<T> {
    return new ValidatorSchema(this.rules, name);
  }

  /**
   * 只保留指定字段，得到新的 schema。
   *
   * ```typescript
   * schema.pick('id', 'name');
   * schema.pick(['id', 'name']);
   * ```
   */
  pick<K extends keyof T>(...keys: K[]): ValidatorSchema<Pick<T, K>>;
  pick<K extends keyof T>(keys: readonly K[]): ValidatorSchema<Pick<T, K>>;
  pick(...keys: string[] | [readonly string[]]): any {
    const next: Record<string, Validator> = {};
    for (const key of normalizeKeys(keys)) {
      const validator = this.rules[key];
      if (validator) next[key] = validator;
    }
    return new ValidatorSchema(next);
  }

  /**
   * 去掉指定字段，得到新的 schema。
   *
   * ```typescript
   * schema.omit('id', 'name');
   * schema.omit(['id', 'name']);
   * ```
   */
  omit<K extends keyof T>(...keys: K[]): ValidatorSchema<Omit<T, K>>;
  omit<K extends keyof T>(keys: readonly K[]): ValidatorSchema<Omit<T, K>>;
  omit(...keys: string[] | [readonly string[]]): any {
    const excluded = new Set(normalizeKeys(keys));
    const next: Record<string, Validator> = {};
    for (const key of Object.keys(this.rules)) {
      if (excluded.has(key)) continue;
      const validator = this.rules[key];
      if (validator) next[key] = validator;
    }
    return new ValidatorSchema(next);
  }

  /**
   * 追加或覆盖字段，同名以传入的为准。
   * 可传入普通字段表，或另一个 schema。
   *
   * ```typescript
   * userSchema.extend({ phone: rule.string() });
   * userSchema.extend(extraSchema);
   * ```
   */
  extend<U extends { [K in keyof U]: ValidatorToken }>(
    fields: U,
  ): ValidatorSchema<Omit<T, keyof U> & NormalizeFieldTable<U>>;
  extend<U extends { [K in keyof U]: Validator }>(
    other: ValidatorSchema<U>,
  ): ValidatorSchema<Omit<T, keyof U> & { [K in keyof U]: U[K] }>;
  extend<U extends { [K in keyof U]: ValidatorToken }>(
    fieldsOrSchema: U | ValidatorSchema<any>,
  ): ValidatorSchema<any> {
    const fields =
      fieldsOrSchema instanceof ValidatorSchema
        ? fieldsOrSchema['rules']
        : normalizeFieldTable(fieldsOrSchema);
    return new ValidatorSchema({
      ...this.rules,
      ...fields,
    });
  }

  /**
   * 把全部字段变成可选。
   * 若有字段使用了 `transform`，不能无参调用；可改成 `partial('字段名')` 只处理没有 `transform` 的字段。
   */
  partial(
    this: [T] extends [{ [K in keyof T]: T[K] extends HasPublicOptional ? T[K] : never }]
      ? this
      : PartialBlockedByTransform,
  ): ValidatorSchema<PartialRules<T>>;
  /**
   * 把指定字段变成可选，只能选没有 `transform` 的字段。
   *
   * ```typescript
   * schema.partial('name', 'email');
   * schema.partial(['name', 'email']);
   * ```
   */
  partial<K extends PartialableKey<T>>(
    ...keys: [K, ...K[]]
  ): ValidatorSchema<Omit<T, K> & PartialRules<Pick<T, K>>>;
  partial<K extends PartialableKey<T>>(
    keys: readonly [K, ...K[]],
  ): ValidatorSchema<Omit<T, K> & PartialRules<Pick<T, K>>>;
  partial(...keys: string[] | [readonly string[]]): any {
    return this.mapSelected(keys, (v) => v['optional']());
  }

  /**
   * 把全部字段变成必填（`partial()` 的反向）。
   * 若有字段使用了 `transform`，不能无参调用；可改成 `required('字段名')` 只处理没有 `transform` 的字段。
   * 已有 `default` 的字段调用时保持不变（缺省仍走默认值）。
   */
  required(
    this: [T] extends [{ [K in keyof T]: T[K] extends HasPublicRequired ? T[K] : never }]
      ? this
      : RequiredBlockedByTransform,
  ): ValidatorSchema<RequiredRules<T>>;
  /**
   * 把指定字段变成必填，只能选没有 `transform` 的字段。
   * 已有 `default` 的字段调用时保持不变。
   *
   * ```typescript
   * schema.required('name', 'email');
   * schema.required(['name', 'email']);
   * ```
   */
  required<K extends RequireableKey<T>>(
    ...keys: [K, ...K[]]
  ): ValidatorSchema<Omit<T, K> & RequiredRules<Pick<T, K>>>;
  required<K extends RequireableKey<T>>(
    keys: readonly [K, ...K[]],
  ): ValidatorSchema<Omit<T, K> & RequiredRules<Pick<T, K>>>;
  required(...keys: string[] | [readonly string[]]): any {
    return this.mapSelected(keys, (v) => v['required']());
  }

  /**
   * 无参（rest 长度为 0）表示全部字段。
   * 必须在 normalizeKeys 之前判断：`fn([])` 的 rest 长度是 1，解包后才变成空数组。
   */
  protected mapSelected(
    keys: string[] | [readonly string[]],
    map: (validator: Validator) => Validator,
  ) {
    const targets = keys.length === 0 ? Object.keys(this.rules) : normalizeKeys(keys);
    const next: Record<string, Validator> = { ...this.rules };
    for (const key of targets) {
      const validator = this.rules[key];
      if (validator) next[key] = map(validator);
    }
    return new ValidatorSchema(next);
  }
}

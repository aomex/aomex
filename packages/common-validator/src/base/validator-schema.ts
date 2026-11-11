import type { Validator } from './validator';
import {
  normalizeFieldTable,
  type NormalizeFieldTable,
  type ValidatorToken,
} from '../api/to-validator';

type HasPublicOptional = { optional: () => any };

type PartialBlockedByTransform =
  '部分字段携带了 transform，无法调用 partial()；可改为指定其中不含 transform 的字段';

type PartialRules<T> = {
  [K in keyof T]: T[K] extends { optional: () => infer R }
    ? R extends Validator
      ? R
      : never
    : never;
};

type PartialableKey<T> = {
  [P in keyof T]-?: T[P] extends HasPublicOptional ? P & string : never;
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
     * 可选的 OpenAPI 具名组件名；`pick` / `omit` / `extend` / `partial` 不会带上该名称
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
  pick<K extends keyof T>(...keys: K[] | [readonly K[]]): ValidatorSchema<Pick<T, K>> {
    const list = normalizeKeys(keys);
    return new ValidatorSchema(
      list.reduce(
        (acc, key) => {
          acc[key] = this.rules[key];
          return acc;
        },
        {} as Pick<T, K>,
      ),
    );
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
  omit<K extends keyof T>(...keys: K[] | [readonly K[]]): ValidatorSchema<Omit<T, K>> {
    const list = normalizeKeys(keys);
    return new ValidatorSchema(
      Object.keys(this.rules)
        .filter((key) => !list.includes(key as K))
        .reduce(
          (acc, key) => {
            acc[key as keyof Omit<T, K>] = this.rules[key as keyof Omit<T, K>];
            return acc;
          },
          {} as Omit<T, K>,
        ),
    );
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
  partial(this: any, ...keys: (keyof T)[] | [readonly (keyof T)[]]): any {
    const self = this as ValidatorSchema<T>;
    const list = normalizeKeys(keys);
    const selected = (
      list.length ? list : (Object.keys(self.rules) as (keyof T)[])
    ) as (keyof T)[];
    const next = { ...self.rules } as Record<string, Validator>;
    for (const key of selected) {
      const validator = self.rules[key] as unknown as { optional: () => Validator };
      next[key as string] = validator.optional();
    }
    return new ValidatorSchema(next);
  }
}

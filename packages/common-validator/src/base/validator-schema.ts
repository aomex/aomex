import type { Validator } from './validator';
import { ObjectValidator } from '../validators/object';

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
     * 可选名称，供 OpenAPI 等场景使用；派生操作不会继承
     */
    protected readonly name?: string,
  ) {}

  /**
   * 设置名称，不改变字段。
   * `toDocument(schema)` 时写入 `x-ref`；未设置则为内容 MD5
   */
  asName(name: string): ValidatorSchema<T> {
    return new ValidatorSchema(this.rules, name);
  }

  /**
   * 转为 object 验证器，便于嵌套或交给 `validate` / `rule.array` 等使用
   *
   * ```typescript
   * rule.array(userSchema.object());
   * rule.object({ user: userSchema.object() });
   * ```
   */
  object(): ObjectValidator<Validator.Infer<T>> {
    return new ObjectValidator(this.rules);
  }

  /**
   * 只保留指定字段
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
   * 排除指定字段
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
   * 合并字段对象，同名键以传入方为准
   */
  extend<U extends { [K in keyof U]: Validator }>(
    fields: U,
  ): ValidatorSchema<Omit<T, keyof U> & { [K in keyof U]: U[K] }> {
    return new ValidatorSchema({
      ...this.rules,
      ...fields,
    }) as unknown as ValidatorSchema<Omit<T, keyof U> & { [K in keyof U]: U[K] }>;
  }

  /**
   * 合并另一个 schema，同名键以传入方为准
   */
  merge<U extends { [K in keyof U]: Validator }>(
    other: ValidatorSchema<U>,
  ): ValidatorSchema<Omit<T, keyof U> & { [K in keyof U]: U[K] }> {
    return new ValidatorSchema({
      ...this.rules,
      ...other.rules,
    }) as unknown as ValidatorSchema<Omit<T, keyof U> & { [K in keyof U]: U[K] }>;
  }

  /**
   * 所有字段变为 optional。
   * 若存在带 `transform` 的字段则无法调用，可改为 `partial('字段名')` 只处理不含 transform 的字段
   */
  partial(
    this: [T] extends [{ [K in keyof T]: T[K] extends HasPublicOptional ? T[K] : never }]
      ? this
      : PartialBlockedByTransform,
  ): ValidatorSchema<PartialRules<T>>;
  /**
   * 指定字段变为 optional。只能选择不含 `transform` 的字段
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

import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

/**
 * TS enum / 枚举风格对象（值仅为 string | number）
 * ```typescript
 * enum Color { Red = 'red', Blue = 'blue' }
 * const Status = { On: 1, Off: 0 } as const;
 * ```
 */
export type EnumLike = {
  readonly [key: string]: string | number;
};

/** 去掉 string/number 索引签名后的具名键，避免 `T[keyof T]` 被冲成 `string | number` */
type EnumLikeKnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: true;
};

/**
 * `EnumLike` 的取值联合（OpenAPI `enum` 可选项）。
 * 传入 TS `enum` 时通常保留枚举品牌类型（如 `Color`），而非裸字面量联合。
 */
export type EnumLikeValues<T extends EnumLike> = T[EnumLikeKnownKeys<T>];

/**
 * 从 TS enum / 枚举对象抽出可选值；数字 enum 会丢掉反向映射键（`"0"` / `"1"`）
 */
export function enumLikeToRanges(source: EnumLike): Array<string | number> {
  return Object.keys(source)
    .filter((key) => Number.isNaN(Number(key)))
    .map((key) => source[key]!);
}

export declare namespace EnumValidator {
  export interface Options<T> extends Validator.Options<T> {
    ranges: T[];
  }

  /** optional / nullable / default 等标志位，pick/omit 时需保留 */
  export type FlagsOf<T> = Extract<T, null | Validator.TOptional | Validator.TDefault>;
  /** 真正的枚举取值（去掉标志位） */
  export type ValueOf<T> = Exclude<T, null | Validator.TOptional | Validator.TDefault>;
}

export class EnumValidator<const T = never> extends Validator<T> {
  declare protected config: EnumValidator.Options<T>;

  constructor(ranges: T[] = []) {
    super();
    this.config.ranges = ranges;
    ranges.forEach((item) => {
      if (this.isEmpty(item)) {
        throw new Error(i18n.t('validator.enum.value_can_not_be_empty', { item }));
      }
      if (
        typeof item !== 'string' &&
        typeof item !== 'number' &&
        typeof item !== 'boolean'
      ) {
        throw new Error(i18n.t('validator.enum.only_support_string_number_boolean'));
      }
    });
  }

  /**
   * 开启/关闭严格模式。开启后有如下限制：
   * - 枚举中包含数字时，如果传递的值为字符串类型，则不再转换为数字后再对比
   * - 枚举中包含布尔值时，如果传递的值为字符串类型，则不再转换为布尔值后再对比
   */
  declare public strict: (is?: boolean) => this;
  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => EnumValidator<T | Validator.TOptional>;
  declare public nullable: () => EnumValidator<T | null>;
  declare public default: (
    value: Validator.ParameterOrFn<T>,
  ) => EnumValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 只保留指定枚举值，得到新的枚举验证器（保留 optional / nullable / default）。
   *
   * ```typescript
   * rule.enum(['a', 'b', 'c']).pick('a', 'b');
   * rule.enum(['a', 'b', 'c']).pick(['a', 'b']);
   * ```
   */
  public pick<K extends EnumValidator.ValueOf<T>>(
    values: readonly K[],
  ): EnumValidator<K | EnumValidator.FlagsOf<T>>;
  public pick<K extends EnumValidator.ValueOf<T>[]>(
    ...values: [...K]
  ): EnumValidator<K[number] | EnumValidator.FlagsOf<T>>;
  public pick(...values: unknown[]): EnumValidator<any> {
    const list = values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
    const set = new Set(list);
    const validator = this.copy();
    validator.config.ranges = this.config.ranges.filter((item) => set.has(item));
    validator.assertConfigHealthy();
    return validator;
  }

  /**
   * 去掉指定枚举值，得到新的枚举验证器（保留 optional / nullable / default）。
   *
   * ```typescript
   * rule.enum(['a', 'b', 'c']).omit('c');
   * rule.enum(['a', 'b', 'c']).omit(['c']);
   * ```
   */
  public omit<K extends EnumValidator.ValueOf<T>>(
    values: readonly K[],
  ): EnumValidator<Exclude<EnumValidator.ValueOf<T>, K> | EnumValidator.FlagsOf<T>>;
  public omit<K extends EnumValidator.ValueOf<T>[]>(
    ...values: [...K]
  ): EnumValidator<
    Exclude<EnumValidator.ValueOf<T>, K[number]> | EnumValidator.FlagsOf<T>
  >;
  public omit(...values: unknown[]): EnumValidator<any> {
    const list = values.length === 1 && Array.isArray(values[0]) ? values[0] : values;
    const set = new Set(list);
    const validator = this.copy();
    validator.config.ranges = this.config.ranges.filter((item) => !set.has(item));
    validator.assertConfigHealthy();
    return validator;
  }

  declare protected copy: () => EnumValidator<T>;

  /** ranges 为空，或 default 不在 ranges 内时抛错 */
  protected assertConfigHealthy(): void {
    const { ranges, defaultValue } = this.config;
    if (ranges.length === 0) {
      throw new Error(i18n.t('validator.enum.ranges_can_not_be_empty'));
    }
    if (defaultValue !== undefined) {
      const resolved = this.getDefaultValue(defaultValue);
      if (!ranges.includes(resolved as T)) {
        throw new Error(
          i18n.t('validator.enum.default_not_in_range', { item: String(resolved) }),
        );
      }
    }
  }

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): ValidateResult.Any<any> {
    const { strict } = this.config;
    const ranges = this.config.ranges as any[];

    if (ranges.includes(value)) return ValidateResult.accept(value);
    if (!strict) {
      if (value === 'true' && ranges.includes(true)) {
        return ValidateResult.accept(true);
      }
      if (value === 'false' && ranges.includes(false)) {
        return ValidateResult.accept(false);
      }
      if (typeof value === 'string') {
        const num = Number(value);
        if (!Number.isNaN(num)) {
          if (ranges.includes(num)) return ValidateResult.accept(num);
        }
      }
    }

    return ValidateResult.deny(i18n.t('validator.enum.not_in_range', { label }));
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { ranges } = this.config;
    const types = ranges.map((value) => typeof value) as Array<
      'string' | 'number' | 'boolean'
    >;

    return {
      type: new Set(types).size === 1 ? types[0] : undefined,
      enum: ranges,
    };
  }
}

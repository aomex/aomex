import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

/** JSON 可序列化的字面量：`string` / `number` / `boolean` / `null`（不含 `NaN` / `Infinity`） */
export type LiteralValue = string | number | boolean | null;

export declare namespace LiteralValidator {
  export interface Options<T> extends Validator.Options<T> {
    value: T;
  }
}

export class LiteralValidator<const T = never> extends Validator<T> {
  declare protected config: LiteralValidator.Options<T>;

  constructor(value?: T & LiteralValue) {
    super();
    // 与 EnumValidator 一样：无参给 copy() 用，真正取值由 copyConfig 灌入
    if (value === undefined) return;
    if (
      (typeof value === 'number' && !Number.isFinite(value)) ||
      (value !== null &&
        typeof value !== 'string' &&
        typeof value !== 'number' &&
        typeof value !== 'boolean')
    ) {
      throw new Error(i18n.t('validator.literal.unsupported_value'));
    }
    this.config.value = value;
    // `null` 字面量需走 nullable 通路，否则基类会把 null 当成空值
    if (value === null) {
      this.config.nullable = true;
    }
  }

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => LiteralValidator<T | Validator.TOptional>;
  declare public nullable: () => LiteralValidator<T | null>;
  declare public default: (
    value: Validator.ParameterOrFn<T>,
  ) => LiteralValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  declare protected copy: () => LiteralValidator<T>;

  /**
   * 字面量为 `''` 时，空字符串是合法取值，不能再被基类当成「空值」吞掉。
   */
  protected override isEmpty(value: any): boolean {
    if (this.config.value === '' && value === '') return false;
    return super.isEmpty(value);
  }

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): ValidateResult.Any<T> {
    if (Object.is(value, this.config.value)) {
      return ValidateResult.accept(value);
    }
    return ValidateResult.deny(i18n.t('validator.literal.not_match', { label }));
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { value } = this.config;
    if (value === null) {
      // OpenAPI 3.0 无 type: null，靠外层 nullable + enum 表达
      return { enum: [null] };
    }
    return {
      type: typeof value as 'string' | 'number' | 'boolean',
      enum: [value],
    };
  }
}

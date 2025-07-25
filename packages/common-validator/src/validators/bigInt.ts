import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace BigIntValidator {
  export interface Options<T = false> extends Validator.Options<T> {
    min?: bigint;
    minInclusive?: boolean;
    max?: bigint;
    maxInclusive?: boolean;
  }
}

export class BigIntValidator<T = bigint> extends Validator<T> {
  declare protected config: BigIntValidator.Options<T>;

  /**
   * 开启严格模式后：
   * - string或者number不再转换为大整数
   */
  declare public strict: (is?: boolean) => this;
  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => BigIntValidator<T | Validator.TOptional>;
  declare public nullable: () => BigIntValidator<T | null>;
  declare public default: (value: bigint) => BigIntValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public min(min: bigint, inclusive: boolean = true): this {
    const validator = this.copy();
    validator.config.min = min;
    validator.config.minInclusive = inclusive;
    return validator as this;
  }

  public max(max: bigint, inclusive: boolean = true): this {
    const validator = this.copy();
    validator.config.max = max;
    validator.config.maxInclusive = inclusive;
    return validator as this;
  }

  protected validateValue(
    value: bigint,
    _key: string,
    label: string,
  ): ValidateResult.Any<bigint> {
    const {
      strict,
      min = -Infinity,
      max = Infinity,
      minInclusive,
      maxInclusive,
    } = this.config;
    const type = typeof value;
    let num: bigint | undefined;

    if (type !== 'bigint') {
      if (!strict && (type === 'number' || type === 'string')) {
        try {
          num = BigInt(value);
        } catch {}
      }

      if (num === undefined) {
        return ValidateResult.deny(i18n.t('validator.number.must_be_bigint', { label }));
      }
    } else {
      num = value;
    }

    if (
      (minInclusive ? num < min : num <= min) ||
      (maxInclusive ? num > max : num >= max)
    ) {
      return ValidateResult.deny(i18n.t('validator.number.not_in_range', { label }));
    }

    return ValidateResult.accept(num);
  }

  declare protected copy: () => BigIntValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const { min, max, minInclusive, maxInclusive } = this.config;
    const defaultValue = this.getDefaultValue<bigint>(this.config.defaultValue);
    return {
      type: 'integer',
      format: 'int64',
      example: '922337203685475807',
      // JSON.stringify 无法处理bigint类型
      default: defaultValue === void 0 ? void 0 : Number(defaultValue),
      minimum: min === void 0 ? void 0 : Number(min),
      maximum: max === void 0 ? void 0 : Number(max),
      exclusiveMinimum: minInclusive === void 0 ? void 0 : !minInclusive,
      exclusiveMaximum: maxInclusive === void 0 ? void 0 : !maxInclusive,
    };
  }
}

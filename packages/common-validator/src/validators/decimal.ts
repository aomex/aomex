import Decimal from 'decimal.js';
import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace DecimalValidator {
  export interface Options<T = false> extends Validator.Options<T> {
    min?: Decimal;
    minInclusive?: boolean;
    max?: Decimal;
    maxInclusive?: boolean;
  }
}

export class DecimalValidator<T = Decimal> extends Validator<T> {
  declare protected config: DecimalValidator.Options<T>;

  /**
   * 开启严格模式后：
   * - string / number 不再转换为 Decimal
   */
  declare public strict: (is?: boolean) => this;
  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => DecimalValidator<T | Validator.TOptional>;
  declare public required: () => DecimalValidator<Exclude<T, Validator.TOptional>>;
  declare public nullable: () => DecimalValidator<T | null>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  override default(
    value: string | number | Decimal,
  ): DecimalValidator<T | Validator.TDefault> {
    const validator = super.default(
      value instanceof Decimal ? value : new Decimal(value),
    );
    return validator as DecimalValidator<T | Validator.TDefault>;
  }

  public min(min: string | number | Decimal, inclusive: boolean = true): this {
    const validator = this.copy();
    validator.config.min = min instanceof Decimal ? min : new Decimal(min);
    validator.config.minInclusive = inclusive;
    return validator as this;
  }

  public max(max: string | number | Decimal, inclusive: boolean = true): this {
    const validator = this.copy();
    validator.config.max = max instanceof Decimal ? max : new Decimal(max);
    validator.config.maxInclusive = inclusive;
    return validator as this;
  }

  protected validateValue(
    value: unknown,
    _key: string,
    label: string,
  ): ValidateResult.Any<Decimal> {
    const { strict, min, max, minInclusive, maxInclusive } = this.config;
    let decimal: Decimal | undefined;

    if (value instanceof Decimal) {
      decimal = value;
    } else if (!strict && (typeof value === 'string' || typeof value === 'number')) {
      try {
        decimal = new Decimal(value);
      } catch {
        // 保持 undefined，走下方拒绝
      }
    }

    if (!decimal || !decimal.isFinite()) {
      return ValidateResult.deny(i18n.t('validator.number.must_be_decimal', { label }));
    }

    if (min !== undefined) {
      const cmp = decimal.comparedTo(min);
      if (minInclusive ? cmp < 0 : cmp <= 0) {
        return ValidateResult.deny(i18n.t('validator.number.not_in_range', { label }));
      }
    }
    if (max !== undefined) {
      const cmp = decimal.comparedTo(max);
      if (maxInclusive ? cmp > 0 : cmp >= 0) {
        return ValidateResult.deny(i18n.t('validator.number.not_in_range', { label }));
      }
    }

    return ValidateResult.accept(decimal);
  }

  declare protected copy: () => DecimalValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const { min, max, minInclusive, maxInclusive } = this.config;
    const defaultValue = this.getDefaultValue<Decimal>(this.config.defaultValue);
    return {
      // 用 string 保留精度，避免 JSON number 丢位
      type: 'string',
      example: '123.45',
      default: defaultValue === void 0 ? void 0 : defaultValue.toString(),
      minimum:
        minInclusive === false ? undefined : min === void 0 ? void 0 : min.toNumber(),
      maximum:
        maxInclusive === false ? undefined : max === void 0 ? void 0 : max.toNumber(),
      exclusiveMinimum:
        minInclusive === false && min !== undefined ? min.toNumber() : undefined,
      exclusiveMaximum:
        maxInclusive === false && max !== undefined ? max.toNumber() : undefined,
    };
  }
}

export { Decimal };

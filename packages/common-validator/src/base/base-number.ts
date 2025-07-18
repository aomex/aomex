import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult } from './validate-result';
import { Validator } from './validator';

export declare namespace BaseNumberValidator {
  export interface Options<T = false> extends Validator.Options<T> {
    min?: number;
    minInclusive?: boolean;
    max?: number;
    maxInclusive?: boolean;
    precision?: number;
  }
}

export abstract class BaseNumberValidator<T = number> extends Validator<T> {
  declare protected config: BaseNumberValidator.Options<T>;

  /**
   * 开启/关闭严格模式，开启后有以下限制：
   * - 字符串不再尝试转换为数字
   */
  declare public strict: (is?: boolean) => this;
  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;

  /**
   * 最小范围限制
   * @param min 最小值
   * @param inclusive 是否包含最小值，默认值：`true`
   */
  public min(min: number, inclusive: boolean = true): this {
    const validator = this.copy();
    validator.config.min = min;
    validator.config.minInclusive = inclusive;
    return validator as this;
  }

  /**
   * 最大范围限制
   * @param min 最大值
   * @param inclusive 是否包含最大值，默认值：`true`
   */
  public max(max: number, inclusive: boolean = true): this {
    const validator = this.copy();
    validator.config.max = max;
    validator.config.maxInclusive = inclusive;
    return validator as this;
  }

  /**
   * 小数点保留位数，使用`.toFixed()`剔除多余的小数
   */
  protected precision(decimals: number): this {
    const validator = this.copy();
    validator.config.precision = decimals;
    return validator as this;
  }

  protected validateValue(
    num: number,
    key: string,
    label: string,
  ): ValidateResult.Any<number> {
    const {
      min = -Infinity,
      max = Infinity,
      minInclusive,
      maxInclusive,
      strict,
      precision,
    } = this.config;

    if (!strict && typeof num === 'string') {
      num = Number(num);
    }

    if (!Number.isFinite(num)) {
      return ValidateResult.deny(i18n.t('validator.number.must_be_number', { label }));
    }

    if (precision !== undefined) {
      num = Number(num.toFixed(precision));
    }

    if (
      (minInclusive ? num < min : num <= min) ||
      (maxInclusive ? num > max : num >= max)
    ) {
      return ValidateResult.deny(i18n.t('validator.number.not_in_range', { label }));
    }

    return this.validateNumber(num, key, label);
  }

  protected abstract validateNumber(
    num: number,
    key: string,
    label: string,
  ): ValidateResult.Any<number>;

  declare protected copy: () => BaseNumberValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const { max, maxInclusive, min, minInclusive } = this.config;
    return {
      type: 'number',
      maximum: max,
      minimum: min,
      exclusiveMaximum: maxInclusive === void 0 ? void 0 : !maxInclusive,
      exclusiveMinimum: minInclusive === void 0 ? void 0 : !minInclusive,
    };
  }
}

import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate } from './magistrate';
import { Validator } from './validator';

export declare namespace BaseNumberValidator {
  export interface Options<T = false> extends Validator.Options<T> {
    min?: number;
    minInclusive?: boolean;
    max?: number;
    maxInclusive?: boolean;
  }
}

export abstract class BaseNumberValidator<T = number> extends Validator<T> {
  protected declare config: BaseNumberValidator.Options<T>;

  /**
   * 开启/关闭严格模式，开启后有以下限制：
   * - 字符串不再尝试转换为数字
   */
  public declare strict: (is?: boolean) => this;
  public declare docs: (
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

  protected validateValue(
    num: number,
    key: string,
    label: string,
  ): magistrate.Result<number> {
    const {
      min = -Infinity,
      max = Infinity,
      minInclusive,
      maxInclusive,
      strict,
    } = this.config;

    if (!strict && typeof num === 'string') {
      num = Number(num);
    }

    if (!Number.isFinite(num)) {
      return magistrate.fail(i18n.t('core.validator.number.must_be_number', { label }));
    }

    if (
      (minInclusive ? num < min : num <= min) ||
      (maxInclusive ? num > max : num >= max)
    ) {
      return magistrate.fail(i18n.t('core.validator.number.not_in_range', { label }));
    }

    return this.validateNumber(num, key, label);
  }

  protected abstract validateNumber(
    num: number,
    key: string,
    label: string,
  ): magistrate.Result<number>;

  protected declare copy: () => BaseNumberValidator<T>;

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

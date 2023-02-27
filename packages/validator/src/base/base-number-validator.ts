import type { OpenAPI } from '@aomex/openapi-type';
import { magistrate } from './magistrate';
import { ValidateResult, Validator, ValidatorOptions } from './validator';

export interface NumberValidatorOptions<T = false> extends ValidatorOptions<T> {
  min?: number;
  minInclusive?: boolean;
  max?: number;
  maxInclusive?: boolean;
  onlyInteger?: boolean;
  precision?: number;
}

const precisionPattern = /(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/;

export abstract class BaseNumberValidator<T = number> extends Validator<T> {
  protected declare config: NumberValidatorOptions<T>;

  public min(min: number, inclusive: boolean = true): this {
    this.config.min = min;
    this.config.minInclusive = inclusive;
    return this;
  }

  public max(max: number, inclusive: boolean = true): this {
    this.config.max = max;
    this.config.maxInclusive = inclusive;
    return this;
  }

  protected validateValue(
    num: number,
    key: string,
    superKeys: string[],
  ): ValidateResult<number> {
    const {
      min = -Infinity,
      max = Infinity,
      minInclusive,
      maxInclusive,
      onlyInteger,
      precision,
    } = this.config;

    if (typeof num !== 'number' && typeof num === 'string') {
      num = Number(num);
    }

    if (!Number.isFinite(num)) {
      return magistrate.fail('must be number', key, superKeys);
    }

    if (onlyInteger && !Number.isInteger(num)) {
      return magistrate.fail('must be integer', key, superKeys);
    }

    if (
      (minInclusive ? num < min : num <= min) ||
      (maxInclusive ? num > max : num >= max)
    ) {
      return magistrate.fail('too small or too big', key, superKeys);
    }

    if (precision !== undefined && !onlyInteger) {
      const matches = num.toString().match(precisionPattern)!;
      const decimals =
        (matches[1] ? matches[1].length : 0) -
        (matches[2] ? Number(matches[2]) : 0);

      if (decimals >= 0 && decimals > precision) {
        return magistrate.fail('incorrect decimals', key, superKeys);
      }
    }

    return magistrate.ok(num);
  }

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

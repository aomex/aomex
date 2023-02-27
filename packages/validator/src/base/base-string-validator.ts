import type { OpenAPI } from '@aomex/openapi-type';
import type { LengthRange } from '../mixins';
import { magistrate } from './magistrate';
import { ValidateResult, Validator, ValidatorOptions } from './validator';

export interface BaseStringValidatorOptions<T> extends ValidatorOptions<T> {
  trim?: boolean;
  pattern?: RegExp;
  lengthRange?: LengthRange;
}

export abstract class BaseStringValidator<T> extends Validator<T> {
  protected declare config: BaseStringValidatorOptions<T>;

  /**
   * Get read of spaces before validation
   */
  trim(): this {
    this.config.trim = true;
    return this;
  }

  protected match(pattern: RegExp): this {
    this.config.pattern = pattern;
    return this;
  }

  protected override isEmpty(value: any): boolean {
    if (value == null) return true;
    if (typeof value !== 'string') return false;
    if (value === '' || this.getTrimValue(value) === '') return true;

    return false;
  }

  protected getTrimValue(value: string) {
    return this.config.trim ? value.trim() : value;
  }

  protected shouldMatchPattern(
    value: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> | void {
    const { pattern } = this.config;
    if (pattern && !pattern.test(value)) {
      return magistrate.fail('not match regexp', key, superKeys);
    }
  }

  protected shouldBetweenLength(
    value: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> | void {
    const { lengthRange } = this.config;
    if (!lengthRange) return;

    const { min = 0, max = Infinity } = lengthRange;
    const length = value.length;
    if (length < min || length > max) {
      return magistrate.fail(`too short or too long`, key, superKeys);
    }
  }

  protected shouldBeString(
    value: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> | void {
    if (typeof value !== 'string') {
      return magistrate.fail('must be string', key, superKeys);
    }
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { lengthRange = {}, pattern } = this.config;
    return {
      type: 'string',
      // FIXME: where to place pattern.flags?
      pattern: pattern && pattern.source,
      minLength: lengthRange.min,
      maxLength: lengthRange.max,
    };
  }
}

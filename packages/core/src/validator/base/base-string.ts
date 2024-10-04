import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { ValidateResult } from './validate-result';
import { Validator } from './validator';

export declare namespace BaseStringValidator {
  export interface Options<T> extends Validator.Options<T> {
    trim?: boolean;
    pattern?: RegExp;
    lengthRange?: LengthRange;
  }

  export interface LengthRange {
    min?: number;
    max?: number;
  }
}

export abstract class BaseStringValidator<T = string> extends Validator<T> {
  protected declare config: BaseStringValidator.Options<T>;

  /**
   * 删除两边空格后再进行验证
   */
  protected trim(is: boolean = true): this {
    const validator = this.copy();
    validator.config.trim = is;
    return validator as this;
  }

  protected length(exactLength: number): this;
  protected length(range: BaseStringValidator.LengthRange): this;
  protected length(data: number | BaseStringValidator.LengthRange) {
    const validator = this.copy();
    validator.config.lengthRange =
      typeof data === 'number' ? { min: data, max: data } : data;
    return validator;
  }

  protected match(pattern: RegExp): this {
    const validator = this.copy();
    validator.config.pattern = pattern;
    return validator as this;
  }

  protected override isEmpty(value: any): boolean {
    if (value !== '' && super.isEmpty(value)) return true;
    if (typeof value !== 'string') return false;
    if (value === '' || this.getTrimValue(value) === '') return true;
    return false;
  }

  protected getTrimValue(value: string) {
    return this.config.trim ? value.trim() : value;
  }

  protected override validateValue(
    value: any,
    key: string,
    label: string,
  ): ValidateResult.Any<any> | Promise<ValidateResult.Any<any>> {
    const { pattern, lengthRange } = this.config;
    if (typeof value !== 'string') {
      return ValidateResult.deny(i18n.t('validator.string.must_be_string', { label }));
    }

    value = this.getTrimValue(value);

    if (lengthRange) {
      const { min = 0, max = Infinity } = lengthRange;
      const length = value.length;
      if (length < min || length > max) {
        return ValidateResult.deny(
          i18n.t('validator.string.length_not_in_range', { label }),
        );
      }
    }

    if (pattern && !pattern.test(value)) {
      return ValidateResult.deny(i18n.t('validator.string.not_match_pattern', { label }));
    }

    return this.validateString(value, key, label);
  }

  protected abstract validateString(
    value: string,
    key: string,
    label: string,
  ): ValidateResult.Any<any> | Promise<ValidateResult.Any<any>>;

  protected declare copy: () => BaseStringValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const { lengthRange = {}, pattern } = this.config;
    return {
      type: 'string',
      // FIXME: openapi没地方放`pattern.flags`
      pattern: pattern ? pattern.source : undefined,
      minLength: lengthRange.min,
      maxLength: lengthRange.max,
    };
  }
}

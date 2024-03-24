import type { OpenAPI } from '../../interface';
import { magistrate } from './magistrate';
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
    superKeys: string[],
  ): magistrate.Result<any> | Promise<magistrate.Result<any>> {
    const { pattern, lengthRange } = this.config;
    if (typeof value !== 'string') {
      return magistrate.fail('必须是字符串类型', key, superKeys);
    }

    value = this.getTrimValue(value);

    if (lengthRange) {
      const { min = 0, max = Infinity } = lengthRange;
      const length = value.length;
      if (length < min || length > max) {
        return magistrate.fail(`字符串长度不合法`, key, superKeys);
      }
    }

    if (pattern && !pattern.test(value)) {
      return magistrate.fail('未匹配指定格式', key, superKeys);
    }

    return this.validateString(value, key, superKeys);
  }

  protected abstract validateString(
    value: string,
    key: string,
    superKeys: string[],
  ): magistrate.Result<any> | Promise<magistrate.Result<any>>;

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

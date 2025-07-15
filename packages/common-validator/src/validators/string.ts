import type { OpenAPI } from '@aomex/internal-tools';
import {
  ValidateResult,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';

export declare namespace StringValidator {
  export interface Options<T> extends BaseStringValidator.Options<T> {
    allowEmpty?: boolean;
  }
}

export class StringValidator<T = string> extends BaseStringValidator<T> {
  declare protected config: StringValidator.Options<T>;

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => StringValidator<T | Validator.TOptional>;
  declare public nullable: () => StringValidator<T | null>;
  declare public default: (
    string: Validator.ParameterOrFn<T>,
  ) => StringValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  declare public match: (pattern: RegExp) => this;
  declare public trim: (is?: boolean) => this;
  declare public length: (exactOrRange: number | BaseStringValidator.LengthRange) => this;

  /**
   * 把空字符串`''`设置为合法的值
   */
  allowEmptyString(): StringValidator<T> {
    const validator = this.copy();
    validator.config.allowEmpty = true;
    return validator;
  }

  protected override isEmpty(value: any): boolean {
    if (value === '' && this.config.allowEmpty) return false;
    return super.isEmpty(value);
  }

  protected validateString(value: string): ValidateResult.Any<string> {
    return ValidateResult.accept(value);
  }

  declare protected copy: () => StringValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return super.toDocument();
  }
}

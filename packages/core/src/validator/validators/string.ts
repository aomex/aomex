import type { OpenAPI } from '../../interface';
import {
  magistrate,
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
  protected declare config: StringValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => StringValidator<T | Validator.TOptional>;
  public declare nullable: () => StringValidator<T | null>;
  public declare default: (
    string: Validator.ParameterOrFn<T>,
  ) => StringValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;
  public declare trim: (is?: boolean) => this;
  public declare length: (exactOrRange: number | BaseStringValidator.LengthRange) => this;

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

  protected validateString(value: string): magistrate.Result<string> {
    return magistrate.ok(value);
  }

  protected declare copy: () => StringValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return super.toDocument();
  }
}

import emailValidator from 'email-validator';
import type { OpenAPI } from '../../interface';
import {
  magistrate,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';

export declare namespace EmailValidator {
  export interface Options<T> extends BaseStringValidator.Options<T> {}
}

export class EmailValidator<T = string> extends BaseStringValidator<T> {
  protected declare config: EmailValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => EmailValidator<T | Validator.TOptional>;
  public declare nullable: () => EmailValidator<T | null>;
  public declare default: (
    email: Validator.ParameterOrFn<T>,
  ) => EmailValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  protected validateString(
    email: string,
    key: string,
    superKeys: string[],
  ): magistrate.Result<string> {
    if (!emailValidator.validate(email)) {
      return magistrate.fail('必须是电子邮箱格式', key, superKeys);
    }
    return magistrate.ok(email);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: 'email',
    };
  }
}

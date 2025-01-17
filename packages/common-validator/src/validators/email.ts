import emailValidator from 'email-validator';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  ValidateResult,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';
import { i18n } from '../i18n';

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
    _key: string,
    label: string,
  ): ValidateResult.Any<string> {
    if (!emailValidator.validate(email)) {
      return ValidateResult.deny(i18n.t('validator.string.must_be_email', { label }));
    }
    return ValidateResult.accept(email);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: 'email',
    };
  }
}

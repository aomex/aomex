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
  declare protected config: EmailValidator.Options<T>;

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => EmailValidator<T | Validator.TOptional>;
  declare public nullable: () => EmailValidator<T | null>;
  declare public default: (
    email: Validator.ParameterOrFn<T>,
  ) => EmailValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  declare public match: (pattern: RegExp) => this;

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

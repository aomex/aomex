import emailValidator from 'email-validator';
import type { OpenAPI } from '@aomex/openapi-type';
import { LengthRange, mixinLength, MixinLength } from '../mixins';
import {
  magistrate,
  TransformedValidator,
  BaseStringValidatorOptions,
  BaseStringValidator,
  ValidateResult,
  Validator,
} from '../base';

interface EmailValidatorOptions<T> extends BaseStringValidatorOptions<T> {
  lengthRange?: LengthRange;
}

export class EmailValidator<T = string> extends BaseStringValidator<T> {
  protected declare config: EmailValidatorOptions<T>;

  public declare optional: () => EmailValidator<T | Validator.TOptional>;

  public declare default: (
    email: Validator.ParameterOrFn<T>,
  ) => EmailValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  protected validateValue(
    email: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> {
    let checker: ValidateResult<string> | void;

    checker = this.shouldBeString(email, key, superKeys);
    if (checker) return checker;

    email = this.getTrimValue(email);
    checker = this.shouldBetweenLength(email, key, superKeys);
    if (checker) return checker;

    checker = this.shouldMatchPattern(email, key, superKeys);
    if (checker) return checker;

    if (!emailValidator.validate(email)) {
      return magistrate.fail('must be email', key, superKeys);
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

export interface EmailValidator extends MixinLength {}
mixinLength(EmailValidator);

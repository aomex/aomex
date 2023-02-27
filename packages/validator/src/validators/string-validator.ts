import type { OpenAPI } from '@aomex/openapi-type';
import { MixinLength, mixinLength } from '../mixins';
import {
  magistrate,
  TransformedValidator,
  BaseStringValidatorOptions,
  BaseStringValidator,
  ValidateResult,
  Validator,
} from '../base';

interface StringValidatorOptions<T> extends BaseStringValidatorOptions<T> {
  allowEmpty?: boolean;
}

export class StringValidator<T = string> extends BaseStringValidator<T> {
  protected declare config: StringValidatorOptions<T>;

  public declare optional: () => StringValidator<T | Validator.TOptional>;

  public declare default: (
    string: Validator.ParameterOrFn<T>,
  ) => StringValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare match: (pattern: RegExp) => this;

  /**
   * Make empty string`''` valid. Defaults `false`
   */
  allowEmpty() {
    this.config.allowEmpty = true;
    return this;
  }

  public declare trim: () => this;

  protected override isEmpty(value: any): boolean {
    if (value != null && this.config.allowEmpty) return false;
    return super.isEmpty(value);
  }

  protected validateValue(
    value: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<string> {
    let checker: ValidateResult<string> | void;

    checker = this.shouldBeString(value, key, superKeys);
    if (checker) return checker;

    value = this.getTrimValue(value);

    checker = this.shouldBetweenLength(value, key, superKeys);
    if (checker) return checker;

    checker = this.shouldMatchPattern(value, key, superKeys);
    if (checker) return checker;

    return magistrate.ok(value);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return super.toDocument();
  }
}

export interface StringValidator extends MixinLength {}
mixinLength(StringValidator);

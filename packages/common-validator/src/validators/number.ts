import type { OpenAPI } from '@aomex/internal-tools';
import {
  type TransformedValidator,
  BaseNumberValidator,
  Validator,
  ValidateResult,
} from '../base';

export declare namespace NumberValidator {
  export interface Options<T = false> extends BaseNumberValidator.Options<T> {}
}

export class NumberValidator<T = number> extends BaseNumberValidator<T> {
  protected declare config: NumberValidator.Options<T>;

  public declare optional: () => NumberValidator<T | Validator.TOptional>;
  public declare nullable: () => NumberValidator<T | null>;
  public declare default: (
    number: Validator.ParameterOrFn<T>,
  ) => NumberValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public declare precision: (decimals: number) => this;

  protected override validateNumber(num: number): ValidateResult.Any<number> {
    return ValidateResult.accept(num);
  }

  protected declare copy: () => this;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      type: 'number',
    };
  }
}

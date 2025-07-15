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
  declare protected config: NumberValidator.Options<T>;

  declare public optional: () => NumberValidator<T | Validator.TOptional>;
  declare public nullable: () => NumberValidator<T | null>;
  declare public default: (
    number: Validator.ParameterOrFn<T>,
  ) => NumberValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  declare public precision: (decimals: number) => this;

  protected override validateNumber(num: number): ValidateResult.Any<number> {
    return ValidateResult.accept(num);
  }

  declare protected copy: () => this;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      type: 'number',
    };
  }
}

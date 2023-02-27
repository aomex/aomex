import type { OpenAPI } from '@aomex/openapi-type';
import {
  TransformedValidator,
  BaseNumberValidator,
  NumberValidatorOptions,
  Validator,
} from '../base';

export class NumberValidator<T = number> extends BaseNumberValidator<T> {
  protected declare config: NumberValidatorOptions<T>;

  public declare optional: () => NumberValidator<T | Validator.TOptional>;

  public declare default: (
    number: Validator.ParameterOrFn<T>,
  ) => NumberValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  public precision(maxDecimals: number): this {
    this.config.precision = Math.min(20, Math.max(0, maxDecimals));
    return this;
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      type: 'number',
    };
  }
}

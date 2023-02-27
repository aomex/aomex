import type { OpenAPI } from '@aomex/openapi-type';
import {
  TransformedValidator,
  BaseNumberValidator,
  NumberValidatorOptions,
  Validator,
} from '../base';

export class IntValidator<T = number> extends BaseNumberValidator<T> {
  protected declare config: NumberValidatorOptions<T>;

  constructor() {
    super();
    this.config.onlyInteger = true;
  }

  public declare optional: () => IntValidator<T | Validator.TOptional>;

  public declare default: (
    integer: Validator.ParameterOrFn<T>,
  ) => IntValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      type: 'integer',
    };
  }
}

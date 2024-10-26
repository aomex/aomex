import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace AnyValidator {
  type Type =
    | number
    | string
    | boolean
    | any[]
    | { [K: string]: unknown }
    | bigint
    | Buffer;
}

export class AnyValidator<T = AnyValidator.Type> extends Validator<T> {
  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => AnyValidator<T | Validator.TOptional>;
  public declare nullable: () => AnyValidator<T | null>;
  public declare default: (
    anyValue: Validator.ParameterOrFn<T>,
  ) => AnyValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(value: any): ValidateResult.Any<any> {
    return ValidateResult.accept(value);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    // https://swagger.io/docs/specification/data-models/data-types/#any
    return {
      anyOf: [
        { type: 'array', items: {} },
        { type: 'boolean' },
        { type: 'integer' },
        { type: 'number' },
        { type: 'object' },
        { type: 'string' },
      ],
    };
  }
}

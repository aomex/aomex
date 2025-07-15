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
  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => AnyValidator<T | Validator.TOptional>;
  declare public nullable: () => AnyValidator<T | null>;
  declare public default: (
    anyValue: Validator.ParameterOrFn<T>,
  ) => AnyValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
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

import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  Validator,
  ValidatorOptions,
  ValidateResult,
} from '../base';

interface EnumValidatorOptions<T> extends ValidatorOptions<T> {
  ranges: T[];
}

export class EnumValidator<T = never> extends Validator<T> {
  protected declare config: EnumValidatorOptions<T>;

  constructor(ranges: T[]) {
    super();
    this.config.ranges = ranges;
    ranges.forEach((item) => {
      if (this.isEmpty(item)) {
        throw new Error(
          `enum items should not contains empty value: "${item}"`,
        );
      }
    });
  }

  public declare optional: () => EnumValidator<T | Validator.TOptional>;

  public declare default: (
    value: Validator.ParameterOrFn<T>,
  ) => EnumValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): ValidateResult<any> {
    const { ranges } = this.config;

    if (!ranges.includes(value)) {
      return magistrate.fail('not in enum range', key, superKeys);
    }

    return magistrate.ok(value);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { ranges } = this.config;
    const types = ranges.map((value) => typeof value) as Array<
      'string' | 'number' | 'boolean'
    >;

    return {
      type: new Set(types).size === 1 ? types[0] : undefined,
      enum: ranges,
    };
  }
}

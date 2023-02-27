import type { OpenAPI } from '@aomex/openapi-type';
import { MixinLength, mixinLength } from '../mixins';
import {
  magistrate,
  TransformedValidator,
  Validator,
  ValidatorOptions,
  ValidateResult,
  ValidateResultError,
} from '../base';

interface ArrayValidatorOptions<T> extends ValidatorOptions<T> {
  itemValidator?: Validator;
  lengthRange: { min?: number; max?: number };
}

export class ArrayValidator<T = unknown[]> extends Validator<T> {
  protected declare config: ArrayValidatorOptions<T>;

  constructor(validator?: Validator) {
    super();
    this.config.itemValidator = validator;
    this.config.lengthRange = {};
  }

  public declare optional: () => ArrayValidator<T | Validator.TOptional>;

  public declare default: (
    array: Validator.ParameterOrFn<T>,
  ) => ArrayValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected async validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): Promise<ValidateResult<any[]>> {
    const {
      lengthRange: { min = 0, max = Infinity },
      itemValidator,
    } = this.config;
    if (!Array.isArray(value)) {
      return magistrate.fail('must be array', key, superKeys);
    }

    const items = value.slice();
    const length = items.length;

    if (length < min || length > max) {
      return magistrate.fail(`contains invalid items length`, key, superKeys);
    }

    if (itemValidator) {
      const newSuperKeys = superKeys.concat(key);
      let error: ValidateResultError = {
        errors: [],
      };

      await Promise.all(
        items.map(async (_, index, arr) => {
          const result = await Validator.validate(
            itemValidator,
            arr[index],
            index.toString(),
            newSuperKeys,
          );

          if (magistrate.noError(result)) {
            arr[index] = result.ok;
          } else {
            error.errors = error.errors.concat(result.errors!);
          }
        }),
      );

      if (error.errors.length) return error;
    }

    return magistrate.ok(items);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { itemValidator, lengthRange } = this.config;

    return {
      type: 'array',
      items:
        (itemValidator && Validator.toDocument(itemValidator).schema) || {},
      minItems: lengthRange.min,
      maxItems: lengthRange.max,
    };
  }
}

export interface ArrayValidator extends MixinLength {}
mixinLength(ArrayValidator);

import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  Validator,
  ValidatorOptions,
  ValidateResult,
} from '../base';

interface BooleanValidatorOptions<T> extends ValidatorOptions<T> {
  trueValues?: any[];
  falseValues?: any[];
}

const defaultTrueValues: any[] = [1, '1', true, 'true'];
const defaultFalseValues: any[] = [0, '0', false, 'false'];

export class BooleanValidator<T = boolean> extends Validator<T> {
  protected declare config: BooleanValidatorOptions<T>;

  public declare optional: () => BooleanValidator<T | Validator.TOptional>;

  public declare default: (
    boolValue: boolean,
  ) => BooleanValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * Set true values. Defaults `[1, '1', true, 'true']`
   * ```typescript
   * boolean.trueValues([true, 'yes']);
   * boolean.trueValues([true, 'on', 'good']);
   * ```
   */
  public trueValues(values: any[]): this {
    this.config.trueValues = values;
    return this;
  }

  /**
   * Set false values. Defaults `[0, '0', false, 'false']`
   * ```typescript
   * boolean.falseValues([false, 'no']);
   * boolean.falseValues([false, 'off', 'bad']);
   * ```
   */
  public falseValues(values: any[]): this {
    this.config.falseValues = values;
    return this;
  }

  protected validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): ValidateResult<boolean> {
    const { trueValues = defaultTrueValues, falseValues = defaultFalseValues } =
      this.config;

    if (trueValues.includes(value)) {
      return magistrate.ok(true);
    }

    if (falseValues.includes(value)) {
      return magistrate.ok(false);
    }

    return magistrate.fail('must be boolean', key, superKeys);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'boolean',
    };
  }
}

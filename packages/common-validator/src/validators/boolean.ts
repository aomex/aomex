import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace BooleanValidator {
  export interface Options<T> extends Validator.Options<T> {
    truthyValues?: any[];
    falsyValues?: any[];
  }
}

export class BooleanValidator<T = boolean> extends Validator<T> {
  declare protected config: BooleanValidator.Options<T>;
  protected static defaultTruthyValues: any[] = [1, '1', true, 'true'];
  protected static defaultFalsyValues: any[] = [0, '0', false, 'false'];

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => BooleanValidator<T | Validator.TOptional>;
  declare public nullable: () => BooleanValidator<T | null>;
  declare public default: (
    boolValue: boolean,
  ) => BooleanValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 重新设置真值。默认值：`[1, '1', true, 'true']`
   * ```typescript
   * boolean.setTruthyValues([true, 'yes']);
   * boolean.setTruthyValues(['on', 'good']);
   * ```
   */
  public setTruthyValues(values: any[]): BooleanValidator<T> {
    const validator = this.copy();
    validator.config.truthyValues = values;
    return validator;
  }

  /**
   * 重新设置假值。默认值：`[0, '0', false, 'false']`
   * ```typescript
   * boolean.setFalsyValues([false, 'no']);
   * boolean.setFalsyValues(['off', 'bad']);
   * ```
   */
  public setFalsyValues(values: any[]): BooleanValidator<T> {
    const validator = this.copy();
    validator.config.falsyValues = values;
    return validator;
  }

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): ValidateResult.Any<boolean> {
    const {
      truthyValues: trueValues = BooleanValidator.defaultTruthyValues,
      falsyValues: falseValues = BooleanValidator.defaultFalsyValues,
    } = this.config;

    if (trueValues.includes(value)) {
      return ValidateResult.accept(true);
    }

    if (falseValues.includes(value)) {
      return ValidateResult.accept(false);
    }

    return ValidateResult.deny(i18n.t('validator.boolean.must_be_boolean', { label }));
  }

  declare protected copy: () => BooleanValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'boolean',
    };
  }
}

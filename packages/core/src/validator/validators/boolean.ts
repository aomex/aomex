import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

export declare namespace BooleanValidator {
  export interface Options<T> extends Validator.Options<T> {
    truthyValues?: any[];
    falsyValues?: any[];
  }
}

export class BooleanValidator<T = boolean> extends Validator<T> {
  protected declare config: BooleanValidator.Options<T>;
  protected static defaultTruthyValues: any[] = [1, '1', true, 'true'];
  protected static defaultFalsyValues: any[] = [0, '0', false, 'false'];

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => BooleanValidator<T | Validator.TOptional>;
  public declare nullable: () => BooleanValidator<T | null>;
  public declare default: (
    boolValue: boolean,
  ) => BooleanValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  /**
   * 重新设置真值。默认值：`[1, '1', true, 'true']`
   * ```typescript
   * boolean.trueValues([true, 'yes']);
   * boolean.trueValues([true, 'on', 'good']);
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
   * boolean.falseValues([false, 'no']);
   * boolean.falseValues([false, 'off', 'bad']);
   * ```
   */
  public setFalsyValues(values: any[]): BooleanValidator<T> {
    const validator = this.copy();
    validator.config.falsyValues = values;
    return validator;
  }

  protected validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): magistrate.Result<boolean> {
    const {
      truthyValues: trueValues = BooleanValidator.defaultTruthyValues,
      falsyValues: falseValues = BooleanValidator.defaultFalsyValues,
    } = this.config;

    if (trueValues.includes(value)) {
      return magistrate.ok(true);
    }

    if (falseValues.includes(value)) {
      return magistrate.ok(false);
    }

    return magistrate.fail('必须是布尔类型', key, superKeys);
  }

  protected declare copy: () => BooleanValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'boolean',
    };
  }
}

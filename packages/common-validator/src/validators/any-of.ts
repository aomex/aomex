import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace AnyOfValidator {
  export interface Options<T> extends Validator.Options<T> {
    validators: Validator[];
  }
}

export class AnyOfValidator<T = never> extends Validator<T> {
  protected declare config: AnyOfValidator.Options<T>;

  constructor(validators: [Validator, ...Validator[]]) {
    super();
    this.config.validators = validators;
  }

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;
  public declare optional: () => AnyOfValidator<T | Validator.TOptional>;
  public declare nullable: () => AnyOfValidator<T | null>;

  protected override isEmpty(_: any): boolean {
    return false;
  }

  protected async validateValue(
    value: any,
    key: string,
    label: string,
  ): Promise<ValidateResult.Any<any>> {
    const { validators } = this.config;
    let matched = false;

    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i]! as AnyOfValidator;
      const result = await validator.validate(value, key, label);
      if (ValidateResult.noError(result)) {
        value = result.data;
        matched = true;
      }
    }

    return matched
      ? ValidateResult.accept(value)
      : ValidateResult.deny(i18n.t('validator.any_of.not_match_rule', { label }));
  }

  protected override copyConfig(prev: AnyOfValidator): this {
    super.copyConfig(prev);
    this.config.validators = [...prev.config.validators];
    return this;
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { validators } = this.config;
    return {
      anyOf: validators.map((validator) => Validator.toDocument(validator).schema!),
    };
  }
}

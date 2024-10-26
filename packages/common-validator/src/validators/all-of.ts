import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace AllOfValidator {
  export interface Options<T> extends Validator.Options<T> {
    validators: Validator[];
  }
}

export class AllOfValidator<T = never> extends Validator<T> {
  protected declare config: AllOfValidator.Options<T>;

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

  protected override isEmpty(_: any): boolean {
    return false;
  }

  protected async validateValue(
    value: any,
    key: string,
    label: string,
  ): Promise<ValidateResult.Any<any>> {
    const { validators } = this.config;

    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i]! as AllOfValidator;
      const result = await validator.validate(value, key, label);
      if (ValidateResult.noError(result)) {
        value = result.data;
      } else {
        return ValidateResult.deny(i18n.t('validator.all_of.not_match_all', { label }));
      }
    }

    return ValidateResult.accept(value);
  }

  protected override copyConfig(prev: AllOfValidator): this {
    super.copyConfig(prev);
    this.config.validators = [...prev.config.validators];
    return this;
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { validators } = this.config;
    return {
      allOf: validators.map((validator) => Validator.toDocument(validator).schema!),
    };
  }
}

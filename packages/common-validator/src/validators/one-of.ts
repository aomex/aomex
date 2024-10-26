import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace OneOfValidator {
  export interface Options<T> extends Validator.Options<T> {
    validators: Validator[];
  }
}

export class OneOfValidator<T = never> extends Validator<T> {
  protected declare config: OneOfValidator.Options<T>;

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
    let matched: ValidateResult.Any<any> | undefined;

    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i]! as OneOfValidator;
      const result = await validator.validate(value, key, label);
      if (ValidateResult.noError(result)) {
        if (!matched) {
          matched = result;
        } else {
          return ValidateResult.deny(
            i18n.t('validator.one_of.match_multiple_rule', { label }),
          );
        }
      }
    }

    return (
      matched || ValidateResult.deny(i18n.t('validator.one_of.not_match_rule', { label }))
    );
  }

  protected override copyConfig(prev: OneOfValidator): this {
    super.copyConfig(prev);
    this.config.validators = [...prev.config.validators];
    return this;
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { validators } = this.config;
    return {
      oneOf: validators.map((validator) => Validator.toDocument(validator).schema!),
    };
  }
}

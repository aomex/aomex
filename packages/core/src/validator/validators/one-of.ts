import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

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
  ): Promise<magistrate.Result<any>> {
    const { validators } = this.config;

    for (let i = 0; i < validators.length; ++i) {
      const validator = validators[i]! as OneOfValidator;
      const result = await validator.validate(value, key, label);
      if (magistrate.noError(result)) return result;
    }

    return magistrate.fail(i18n.t('core.validator.one_of.not_match_rule', { label }));
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

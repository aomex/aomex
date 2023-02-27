import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  ValidateResult,
  TransformedValidator,
  Validator,
  ValidatorOptions,
} from '../base';

interface OneOfValidatorOptions<T> extends ValidatorOptions<T> {
  validators: Validator[];
}

export class OneOfValidator<T = never> extends Validator<T> {
  protected declare config: OneOfValidatorOptions<T>;

  constructor(rules: Validator[]) {
    super();
    this.config.validators = rules;
  }

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected override isEmpty(_: any): boolean {
    return false;
  }

  protected async validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): Promise<ValidateResult<any>> {
    const { validators } = this.config;

    for (let i = 0; i < validators.length; ++i) {
      const result = await (validators[i]! as OneOfValidator).validate(
        value,
        key,
        superKeys,
      );
      if (magistrate.noError(result)) return result;
    }

    return magistrate.fail('no rule matched', key, superKeys);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    const { validators } = this.config;
    return {
      oneOf: validators.map(
        (validator) => Validator.toDocument(validator).schema!,
      ),
    };
  }
}

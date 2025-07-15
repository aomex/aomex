import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  type TransformedValidator,
  BaseNumberValidator,
  Validator,
  ValidateResult,
} from '../base';

export class IntValidator<T = number> extends BaseNumberValidator<T> {
  declare protected config: BaseNumberValidator.Options<T>;

  declare public optional: () => IntValidator<T | Validator.TOptional>;
  declare public nullable: () => IntValidator<T | null>;
  declare public default: (
    integer: Validator.ParameterOrFn<T>,
  ) => IntValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected override validateNumber(
    num: number,
    _key: string,
    label: string,
  ): ValidateResult.Any<number> {
    if (!Number.isInteger(num)) {
      return ValidateResult.deny(i18n.t('validator.number.must_be_integer', { label }));
    }

    return ValidateResult.accept(num);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      type: 'integer',
    };
  }
}

import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  type TransformedValidator,
  BaseNumberValidator,
  Validator,
  ValidateResult,
} from '../base';

export class IntValidator<T = number> extends BaseNumberValidator<T> {
  protected declare config: BaseNumberValidator.Options<T>;

  public declare optional: () => IntValidator<T | Validator.TOptional>;
  public declare nullable: () => IntValidator<T | null>;
  public declare default: (
    integer: Validator.ParameterOrFn<T>,
  ) => IntValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
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

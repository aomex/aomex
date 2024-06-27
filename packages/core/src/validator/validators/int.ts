import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import {
  type TransformedValidator,
  BaseNumberValidator,
  Validator,
  magistrate,
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
  ): magistrate.Result<number> {
    if (!Number.isInteger(num)) {
      return magistrate.fail(i18n.t('core.validator.number.must_be_integer', { label }));
    }

    return magistrate.ok(num);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      type: 'integer',
    };
  }
}

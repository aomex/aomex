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
    key: string,
    superKeys: string[],
  ): magistrate.Result<number> {
    if (!Number.isInteger(num)) {
      return magistrate.fail('必须是整数', key, superKeys);
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

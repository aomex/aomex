import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  ValidateResult,
  Validator,
} from '../base';

export class BigIntValidator<T = bigint> extends Validator<T> {
  public declare optional: () => BigIntValidator<T | Validator.TOptional>;

  public declare default: (
    value: bigint,
  ) => BigIntValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: bigint,
    key: string,
    superKeys: string[],
  ): ValidateResult<bigint> {
    const type = typeof value;

    if (type === 'bigint') {
      return magistrate.ok(value);
    }

    if (type === 'number' || type === 'string') {
      try {
        return magistrate.ok(BigInt(value));
      } catch {}
    }

    return magistrate.fail('must be bigint', key, superKeys);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'bigint',
      // JSON.stringify can't handle bigint
      default: this.getDefaultValue<bigint>(
        this.config.defaultValue,
      )?.toString(),
    };
  }
}

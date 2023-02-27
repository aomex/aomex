import type { OpenAPI } from '@aomex/openapi-type';
import {
  magistrate,
  TransformedValidator,
  Validator,
  ValidatorOptions,
  ValidateResult,
} from '../base';

interface BufferValidatorOptions<T = Buffer> extends ValidatorOptions<T> {}

export class BufferValidator<T = Buffer> extends Validator<T> {
  protected declare config: BufferValidatorOptions<T>;

  public declare optional: () => BufferValidator<T | Validator.TOptional>;

  public declare default: (
    buffer: Buffer,
  ) => BufferValidator<T | Validator.TDefault>;

  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: any,
    key: string,
    superKeys: string[],
  ): ValidateResult<Buffer> {
    if (!Buffer.isBuffer(value)) {
      return magistrate.fail('must be buffer', key, superKeys);
    }

    return magistrate.ok(value);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'byte',
      // JSON can't handle buffer
      default: undefined,
    };
  }
}

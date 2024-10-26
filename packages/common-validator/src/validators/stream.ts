import stream from 'node:stream';
import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import { ValidateResult, type TransformedValidator, Validator } from '../base';

export declare namespace StreamValidator {
  export interface Options<T = stream.Stream> extends Validator.Options<T> {}
}

export class StreamValidator<T = stream.Stream> extends Validator<T> {
  protected declare config: StreamValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => StreamValidator<T | Validator.TOptional>;
  public declare nullable: () => StreamValidator<T | null>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: stream.Stream,
    _key: string,
    label: string,
  ): ValidateResult.Any<stream.Stream> {
    if (!(value instanceof stream.Stream)) {
      return ValidateResult.deny(i18n.t('validator.stream.must_be_stream', { label }));
    }

    return ValidateResult.accept(value);
  }

  protected declare copy: () => this;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'binary',
    };
  }
}

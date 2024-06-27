import stream from 'node:stream';
import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import { magistrate, type TransformedValidator, Validator } from '../base';

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
  ): magistrate.Result<stream.Stream> {
    if (!(value instanceof stream.Stream)) {
      return magistrate.fail(i18n.t('core.validator.stream.must_be_stream', { label }));
    }

    return magistrate.ok(value);
  }

  protected declare copy: () => this;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
      format: 'binary',
    };
  }
}

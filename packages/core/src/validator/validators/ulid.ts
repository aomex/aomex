import { i18n } from '../../i18n';
import type { OpenAPI } from '../../interface';
import {
  magistrate,
  type TransformedValidator,
  BaseStringValidator,
  Validator,
} from '../base';

// 最大值：'7ZZZZZZZZZZZZZZZZZZZZZZZZZ'
const pattern = /^[0-7][0-9A-HJKMNP-TV-Z]{25}$/;

export declare namespace UlidValidator {
  export interface Options<T = string> extends BaseStringValidator.Options<T> {}
}

export class UlidValidator<T = string> extends BaseStringValidator<T> {
  protected declare config: UlidValidator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => UlidValidator<T | Validator.TOptional>;
  public declare nullable: () => UlidValidator<T | null>;
  public declare default: (
    uuid: Validator.ParameterOrFn<T>,
  ) => UlidValidator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateString(
    ulid: string,
    _key: string,
    label: string,
  ): magistrate.Result<string> {
    if (!pattern.test(ulid)) {
      return magistrate.fail(i18n.t('validator.string.must_be_ulid', { label }));
    }
    return magistrate.ok(ulid);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      ...super.toDocument(),
      format: 'ulid',
    };
  }
}

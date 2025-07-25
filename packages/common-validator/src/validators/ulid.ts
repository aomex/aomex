import { i18n } from '../i18n';
import type { OpenAPI } from '@aomex/internal-tools';
import {
  ValidateResult,
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
  declare protected config: UlidValidator.Options<T>;

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => UlidValidator<T | Validator.TOptional>;
  declare public nullable: () => UlidValidator<T | null>;
  declare public default: (
    uuid: Validator.ParameterOrFn<T>,
  ) => UlidValidator<T | Validator.TDefault>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateString(
    ulid: string,
    _key: string,
    label: string,
  ): ValidateResult.Any<string> {
    if (!pattern.test(ulid)) {
      return ValidateResult.deny(i18n.t('validator.string.must_be_ulid', { label }));
    }
    return ValidateResult.accept(ulid);
  }

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      example: '01BJQE4QTHMFP0S5J153XCFSP9',
      ...super.toDocument(),
      format: 'ulid',
    };
  }
}

import {
  Validator,
  type TransformedValidator,
  ValidateResult,
  OpenAPI,
  Rule,
} from '@aomex/common';
import { i18n } from '../i18n';
import { mongo } from 'mongoose';

export class MongoDecimal128Validator<T = mongo.Decimal128> extends Validator<T> {
  protected declare config: Validator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => MongoDecimal128Validator<T | Validator.TOptional>;
  public declare default: (
    decimal128: mongo.Decimal128,
  ) => MongoDecimal128Validator<T | Validator.TDefault>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): ValidateResult.Any<mongo.Decimal128> {
    if (value instanceof mongo.Decimal128) {
      return ValidateResult.accept(value);
    }

    try {
      return ValidateResult.accept(mongo.Decimal128.fromString(value));
    } catch {
      return ValidateResult.deny(
        i18n.t('validator.decimal128.must_be_decimal128', { label }),
      );
    }
  }

  protected declare copy: () => MongoDecimal128Validator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    return {
      type: 'string',
    };
  }
}

declare module '@aomex/common' {
  export interface Rule {
    mongoDecimal128(): MongoDecimal128Validator;
  }
}

Rule.register('mongoDecimal128', MongoDecimal128Validator);

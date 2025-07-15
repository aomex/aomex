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
  declare protected config: Validator.Options<T>;

  declare public docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  declare public optional: () => MongoDecimal128Validator<T | Validator.TOptional>;
  declare public nullable: () => MongoDecimal128Validator<T | null>;
  declare public transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  override default(
    value: number | string | mongo.Decimal128,
  ): MongoDecimal128Validator<T | Validator.TDefault> {
    const validator = super.default(
      typeof value === 'string' || typeof value === 'number'
        ? mongo.Decimal128.fromString(value.toString())
        : value,
    );
    return validator as MongoDecimal128Validator<T | Validator.TDefault>;
  }

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

  declare protected copy: () => MongoDecimal128Validator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const defaultValue: mongo.Decimal128 | undefined = this.getDefaultValue(
      this.config.defaultValue,
    );
    return {
      type: 'string',
      default: defaultValue && defaultValue.toString(),
    };
  }
}

declare module '@aomex/common' {
  export interface Rule {
    mongoDecimal128(): MongoDecimal128Validator;
  }
}

Rule.register('mongoDecimal128', MongoDecimal128Validator);

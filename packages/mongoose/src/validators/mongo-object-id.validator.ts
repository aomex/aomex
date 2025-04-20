import {
  Validator,
  type TransformedValidator,
  ValidateResult,
  OpenAPI,
  Rule,
} from '@aomex/common';
import { i18n } from '../i18n';
import { mongo } from 'mongoose';

export class MongoObjectIdValidator<T = mongo.ObjectId> extends Validator<T> {
  protected declare config: Validator.Options<T>;

  public declare docs: (
    docs: Validator.PartialOpenAPISchema,
    mode?: Validator.DocumentMergeMode,
  ) => this;
  public declare optional: () => MongoObjectIdValidator<T | Validator.TOptional>;
  public declare nullable: () => MongoObjectIdValidator<T | null>;
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  override default(
    value: string | mongo.ObjectId,
  ): MongoObjectIdValidator<T | Validator.TDefault> {
    const validator = super.default(
      typeof value === 'string'
        ? mongo.ObjectId.createFromHexString(value.toString())
        : value,
    );
    return validator as MongoObjectIdValidator<T | Validator.TDefault>;
  }

  protected validateValue(
    value: any,
    _key: string,
    label: string,
  ): ValidateResult.Any<mongo.ObjectId> {
    if (value instanceof mongo.ObjectId) {
      return ValidateResult.accept(value);
    }

    try {
      return ValidateResult.accept(mongo.ObjectId.createFromHexString(String(value)));
    } catch {
      return ValidateResult.deny(
        i18n.t('validator.objectId.must_be_objectId', { label }),
      );
    }
  }

  protected declare copy: () => MongoObjectIdValidator<T>;

  protected override toDocument(): OpenAPI.SchemaObject {
    const defaultValue: mongo.ObjectId | undefined = this.getDefaultValue(
      this.config.defaultValue,
    );
    return {
      type: 'string',
      default: defaultValue && defaultValue.toHexString(),
    };
  }
}

declare module '@aomex/common' {
  export interface Rule {
    mongoObjectId(): MongoObjectIdValidator;
  }
}

Rule.register('mongoObjectId', MongoObjectIdValidator);

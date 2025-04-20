import {
  AnyValidator,
  ArrayValidator,
  BooleanValidator,
  DateValidator,
  NumberValidator,
  ObjectValidator,
  StringValidator,
  Validator,
} from '@aomex/common';
import { Schema, SchemaTypes, type SchemaDefinition } from 'mongoose';
import { i18n } from '../i18n';
import { MongoDecimal128Validator, MongoObjectIdValidator } from '../validators';

export const validatorToSchema = (validator: Validator) => {
  const defaultValue = validator['config']['nullable']
    ? null
    : validator['config']['defaultValue'];
  const schema: SchemaDefinition[string] = {
    required: defaultValue === undefined && validator['config']['required'],
    default: defaultValue,
  };

  if (validator instanceof StringValidator) {
    schema.type = SchemaTypes.String;
  } else if (validator instanceof NumberValidator) {
    schema.type = SchemaTypes.Number;
  } else if (validator instanceof BooleanValidator) {
    schema.type = SchemaTypes.Boolean;
  } else if (validator instanceof MongoDecimal128Validator) {
    schema.type = SchemaTypes.Decimal128;
  } else if (validator instanceof ArrayValidator) {
    const items = validator['config']['itemValidator'];
    if (items) {
      schema.type = [validatorToSchema(items)];
    } else {
      schema.type = SchemaTypes.Array;
    }
  } else if (validator instanceof ObjectValidator) {
    schema.type = SchemaTypes.Map;
    const properties = validator['config']['properties'];
    if (properties) {
      schema.type = new Schema(
        Object.fromEntries(
          Object.entries(properties).map(
            ([key, value]) => <const>[key, validatorToSchema(value)],
          ),
        ),
        { _id: false, timestamps: false, versionKey: false },
      );
    }
  } else if (validator instanceof DateValidator) {
    schema.type = SchemaTypes.Date;
  } else if (validator instanceof MongoObjectIdValidator) {
    schema.type = SchemaTypes.ObjectId;
  } else if (validator instanceof AnyValidator) {
    schema.type = SchemaTypes.Mixed;
  } else {
    throw new Error(
      i18n.t('mongoose.unsupported_validator', { validator: validator.constructor.name }),
    );
  }

  return schema;
};

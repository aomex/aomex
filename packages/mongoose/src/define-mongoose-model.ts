import type {
  AnyValidator,
  ArrayValidator,
  BooleanValidator,
  DateValidator,
  NumberValidator,
  ObjectValidator,
  StringValidator,
  Validator,
} from '@aomex/common';
import type { NonReadonly } from '@aomex/internal-tools';
import {
  Model,
  type IndexDirection,
  type IndexOptions,
  type SchemaOptions,
  type SchemaDefinition,
  Schema,
  model,
  type HydratedDocument,
} from 'mongoose';
import type { TimestampSetting, VersionKeySetting } from './type-d';
import { validatorToSchema } from './libs/validator-to-schema';
import type { MongoDecimal128Validator, MongoObjectIdValidator } from './validators';

export const defineMongooseModel = <
  const Schema extends {
    [field: string]:
      | StringValidator<any>
      | NumberValidator<any>
      | BooleanValidator<any>
      | ObjectValidator<any>
      | ArrayValidator<any>
      | DateValidator<any>
      | AnyValidator<any>
      | MongoDecimal128Validator<any>
      | MongoObjectIdValidator<any>;
  },
  Ver extends SchemaOptions['versionKey'],
  const Time extends SchemaOptions['timestamps'],
  Output = NonReadonly<Validator.Infer<Schema>> &
    TimestampSetting<Time> &
    VersionKeySetting<Ver>,
>(
  collectionName: string,
  opts: {
    readonly schemas: Schema;
    readonly indexes?: ({
      fields: { [K in keyof Schema]?: IndexDirection };
    } & IndexOptions)[];
    readonly timestamps?: Time;
    readonly versionKey?: Ver;
  } & Omit<SchemaOptions, 'timestamps' | 'versionKey'>,
): Model<Output, {}, {}, {}, HydratedDocument<Output>, Schema> => {
  const { schemas, indexes, ...schemaOptions } = opts;

  const definition: SchemaDefinition = {};
  Object.entries(schemas).forEach(([key, schema]) => {
    definition[key] = validatorToSchema(schema);
  });
  const schema = new Schema(definition, {
    collection: collectionName,
    ...schemaOptions,
  });

  indexes?.forEach(({ fields, ...indexRest }) => {
    schema.index(
      // @ts-expect-error
      fields,
      indexRest,
    );
  });

  const customModel = model(collectionName, schema);
  return customModel as Model<any>;
};

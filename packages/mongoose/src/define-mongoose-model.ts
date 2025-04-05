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
} from 'mongoose';
import type { TimestampSetting } from './type-d';
import { validatorToSchema } from './libs/validator-to-schema';
import type { MongoDecimal128Validator } from './overrides/mongo-decimal128.validator';
import type { MongoObjectIdValidator } from './overrides/mongo-object-id.validator';

export const defineMongooseModel = <
  const S extends {
    [K: string]:
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
  const TS extends SchemaOptions['timestamps'],
  Types = NonReadonly<Validator.Infer<S>> & TimestampSetting<TS>,
>(
  collectionName: string,
  opts: {
    readonly schemas: S;
    readonly indexes?: ({
      fields: { [K in keyof S]?: IndexDirection };
    } & IndexOptions)[];
    readonly timestamps?: TS;
  } & Omit<SchemaOptions, 'timestamps'>,
): Model<Types> => {
  const { schemas, indexes, timestamps, ...schemaOptions } = opts;

  const definition: SchemaDefinition = {};
  Object.entries(opts.schemas).forEach(([key, schema]) => {
    definition[key] = validatorToSchema(schema);
  });
  const schema = new Schema(definition, { ...schemaOptions, timestamps });

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

import {
  type AnyValidator,
  type ArrayValidator,
  type BooleanValidator,
  type DateValidator,
  type NumberValidator,
  type ObjectValidator,
  type StringValidator,
  type Validator,
  normalizeFieldTable,
  type NormalizeFieldTable,
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

type MongooseValidator =
  | StringValidator<any>
  | NumberValidator<any>
  | BooleanValidator<any>
  | ObjectValidator<any>
  | ArrayValidator<any>
  | DateValidator<any>
  | AnyValidator<any>
  | MongoDecimal128Validator<any>
  | MongoObjectIdValidator<any>;

/**
 * mongoose 模型字段：白名单 Validator，或嵌套裸对象（入库前转为 `rule.object`）
 */
type MongooseFieldToken = MongooseValidator | { [key: string]: MongooseFieldToken };

export const defineMongooseModel = <
  const Schema extends { [K in keyof Schema]: MongooseFieldToken },
  Ver extends SchemaOptions['versionKey'],
  const Time extends SchemaOptions['timestamps'],
  Output = NonReadonly<Extract<Validator.Infer<NormalizeFieldTable<Schema>>, object>> &
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
): Model<Output, {}, {}, {}, HydratedDocument<Output>, NormalizeFieldTable<Schema>> => {
  const { schemas: rawSchemas, indexes, ...schemaOptions } = opts;
  const schemas = normalizeFieldTable(rawSchemas);

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

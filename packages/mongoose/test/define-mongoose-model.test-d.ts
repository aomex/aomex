import { expectType, type TypeEqual } from 'ts-expect';
import { defineMongooseModel, type ModelOutput } from '../src';
import { rule } from '@aomex/common';
import { mongo } from 'mongoose';
import type { ModelInput } from '../src/type-d';

// 基础字段
{
  const model = defineMongooseModel('foo', {
    schemas: {
      str1: rule.string(),
      str2: rule.string().optional(),
      str3: rule.string().default('1'),
      str4: rule.string().nullable(),
      num1: rule.number(),
      num2: rule.number().optional(),
      num3: rule.number().default(123),
      bool1: rule.boolean(),
      bool2: rule.boolean().optional(),
      bool3: rule.boolean().default(true),
      date1: rule.date(),
      arr1: rule.array(),
      arr2: rule.array(rule.string()),
      arr3: rule.array({ foo: rule.string() }).optional(),
      arr4: rule.array().default(['foo']),
      obj1: rule.object(),
      obj2: rule.object({ foo: rule.string() }).optional(),
      obj3: rule.object().default({}),
      decimal1: rule.mongoDecimal128(),
      decimal2: rule.mongoDecimal128().optional(),
      decimal3: rule.mongoDecimal128().default(new mongo.Decimal128('123')),
      objId1: rule.mongoObjectId(),
    },
    versionKey: false,
  });

  type ModelType = ModelOutput<typeof model>;
  expectType<
    TypeEqual<
      ModelType,
      { _id: mongo.ObjectId } & {
        str1: string;
        str2?: string | undefined;
        str3: string;
        str4: string | null;
        num1: number;
        num2?: number | undefined;
        num3: number;
        bool1: boolean;
        bool2?: boolean | undefined;
        bool3: boolean;
        date1: Date;
        arr1: unknown[];
        arr2: string[];
        arr3?: { foo: string }[] | undefined;
        arr4: unknown[];
        obj1: { [k: string]: unknown };
        obj2?: { foo: string } | undefined;
        obj3: { [k: string]: unknown };
        decimal1: mongo.Decimal128;
        decimal2?: mongo.Decimal128 | undefined;
        decimal3: mongo.Decimal128;
        objId1: mongo.ObjectId;
      }
    >
  >(true);
}

// 特殊用例
{
  const model = defineMongooseModel('foo', {
    schemas: {
      date: rule.date().optional(),
      objectId: rule.mongoObjectId().optional(),
      str: rule.string().nullable().optional(),
    },
  });
  expectType<TypeEqual<ModelOutput<typeof model>['date'], Date | undefined>>(true);
  expectType<
    TypeEqual<ModelOutput<typeof model>['objectId'], mongo.ObjectId | undefined>
  >(true);
  expectType<TypeEqual<ModelOutput<typeof model>['str'], string | null | undefined>>(
    true,
  );
}

// 版本key
{
  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
    });
    type ModelType = ModelOutput<typeof model>;
    expectType<TypeEqual<ModelType['__v'], number>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      versionKey: false,
    });
    type ModelType = ModelOutput<typeof model>;
    // @ts-expect-error
    expectType<TypeEqual<ModelType['__v'], number>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      versionKey: 'VVV',
    });
    type ModelType = ModelOutput<typeof model>;
    expectType<TypeEqual<ModelType['VVV'], number>>(true);
    // @ts-expect-error
    expectType<TypeEqual<ModelType['__v'], number>>(true);
  }
}

// 时间戳
{
  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
    });
    type ModelType = ModelOutput<typeof model>;
    // @ts-expect-error
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    // @ts-expect-error
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: {},
    });
    type ModelType = ModelOutput<typeof model>;
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: { currentTime: () => Date.now() },
    });
    type ModelType = ModelOutput<typeof model>;
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: true,
    });
    type ModelType = ModelOutput<typeof model>;
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: false,
    });
    type ModelType = ModelOutput<typeof model>;
    // @ts-expect-error
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    // @ts-expect-error
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: { createdAt: true, updatedAt: false },
    });
    type ModelType = ModelOutput<typeof model>;
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    // @ts-expect-error
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: { createdAt: false, updatedAt: true },
    });
    type ModelType = ModelOutput<typeof model>;
    // @ts-expect-error
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: { createdAt: false, updatedAt: false },
    });
    type ModelType = ModelOutput<typeof model>;
    // @ts-expect-error
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    // @ts-expect-error
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
  }

  {
    const model = defineMongooseModel('foo', {
      schemas: { foo: rule.string() },
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    });
    type ModelType = ModelOutput<typeof model>;
    // @ts-expect-error
    expectType<TypeEqual<ModelType['createdAt'], Date>>(true);
    // @ts-expect-error
    expectType<TypeEqual<ModelType['updatedAt'], Date>>(true);
    expectType<TypeEqual<ModelType['created_at'], Date>>(true);
    expectType<TypeEqual<ModelType['updated_at'], Date>>(true);
  }
}

// 索引
{
  defineMongooseModel('foo', {
    schemas: { foo: rule.string(), bar: rule.number() },
    indexes: [
      { fields: { foo: 1, bar: -1 } },
      { fields: { foo: 'asc' }, unique: true },
      {
        fields: {
          // @ts-expect-error
          not_fields: 1,
          bar: -1,
        },
      },
    ],
  });
}

// 输入
{
  const model = defineMongooseModel('foo', {
    schemas: {
      required: rule.string(),
      optional: rule.string().optional(),
      nullable: rule.string().nullable(),
      nullableWithDefault: rule.string().nullable().default('abc'),
      withDefault: rule.string().default('abc'),
    },
    timestamps: true,
    versionKey: true,
  });
  type ModelType = ModelInput<typeof model>;
  expectType<
    TypeEqual<
      ModelType,
      {
        required: string;
        optional: string | undefined;
        nullable: string | null | undefined;
        nullableWithDefault: string | null | undefined;
        withDefault: string | undefined;
      }
    >
  >(true);
}

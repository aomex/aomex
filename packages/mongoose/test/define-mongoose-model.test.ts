import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { mongo } from 'mongoose';
import { afterEach, beforeEach, expect, test } from 'vitest';
import { defineMongooseModel } from '../src';
import { rule } from '@aomex/common';
import { getMongoBinary } from './helper/get-mongo-binary';
import { MigrationModel } from '../src/models/migration.model';

let mongod!: MongoMemoryServer;

beforeEach(async () => {
  mongod = await MongoMemoryServer.create({ binary: getMongoBinary() });
  await mongoose.connect(mongod.getUri());
}, 60_000 /* download */);

afterEach(async () => {
  Object.keys(mongoose.models).forEach((modelName) => {
    mongoose.deleteModel(modelName);
  });
  await mongoose.disconnect();
  await mongod.stop({ doCleanup: true });
});

test('模型名称和集合名称一致', async () => {
  const model1 = defineMongooseModel('user', {
    schemas: {},
  });
  const model2 = defineMongooseModel('admin', {
    schemas: {},
  });
  await model1.syncIndexes();
  await model2.syncIndexes();
  const collections = await mongoose.connection.listCollections();
  expect(
    collections
      .map((item) => item.name)
      .filter((item) => item !== MigrationModel.collection.name)
      .sort(),
  ).toMatchInlineSnapshot(`
    [
      "admin",
      "user",
    ]
  `);
});

test('索引', async () => {
  const model = defineMongooseModel('foo', {
    schemas: { foo: rule.string(), bar: rule.number() },
    indexes: [
      { fields: { foo: 'asc', bar: 'asc' } },
      { fields: { foo: 'desc' }, unique: true },
    ],
  });
  await model.syncIndexes();
  await expect(model.listIndexes()).resolves.toMatchInlineSnapshot(`
    [
      {
        "key": {
          "_id": 1,
        },
        "name": "_id_",
        "v": 2,
      },
      {
        "background": true,
        "key": {
          "bar": 1,
          "foo": 1,
        },
        "name": "foo_1_bar_1",
        "v": 2,
      },
      {
        "background": true,
        "key": {
          "foo": -1,
        },
        "name": "foo_-1",
        "unique": true,
        "v": 2,
      },
    ]
  `);
});

test('必填字段', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      str1: rule.string(),
    },
    versionKey: false,
  });

  await expect(() => model.create({})).rejects.toThrow('Path `str1` is required.');

  const result = await model.create({ str1: 'bar' });
  const json = result.toJSON();
  Reflect.deleteProperty(json, '_id');
  expect(json).toMatchInlineSnapshot(`
    {
      "str1": "bar",
    }
  `);
});

test('选填字段', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      str1: rule.string(),
      str2: rule.string().optional(),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ str1: 'bar' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "str1": "bar",
      }
    `);
  }

  {
    const result = await model.create({ str1: 'bar', str2: 'xyz' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "str1": "bar",
        "str2": "xyz",
      }
    `);
  }
});

test('空值字段', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      str1: rule.string(),
      str2: rule.string().nullable(),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ str1: 'bar' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "str1": "bar",
        "str2": null,
      }
    `);
  }

  {
    const result = await model.create({ str1: 'bar', str2: 'xyz' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "str1": "bar",
        "str2": "xyz",
      }
    `);
  }
});

test('自动填充字段', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      str1: rule.string(),
      str2: rule.string().default('abc'),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ str1: 'bar' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "str1": "bar",
        "str2": "abc",
      }
    `);
  }

  {
    const result = await model.create({ str1: 'bar', str2: 'xyz' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "str1": "bar",
        "str2": "xyz",
      }
    `);
  }
});

test('数字', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      num1: rule.number(),
      num2: rule.number().default(1),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ num1: 123 });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "num1": 123,
        "num2": 1,
      }
    `);
  }

  {
    const result = await model.create({ num1: 123, num2: 245.45 });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "num1": 123,
        "num2": 245.45,
      }
    `);
  }
});

test('布尔值', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      bool1: rule.boolean(),
      bool2: rule.boolean().default(false),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ bool1: true });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "bool1": true,
        "bool2": false,
      }
    `);
  }

  {
    const result = await model.create({ bool1: true, bool2: true });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "bool1": true,
        "bool2": true,
      }
    `);
  }
});

test('时间', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      date1: rule.date(),
      date2: rule.date().default(new Date('2025-04-05T00:00:00Z')),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ date1: new Date('2005-01-01T00:00:00Z') });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "date1": 2005-01-01T00:00:00.000Z,
        "date2": 2025-04-05T00:00:00.000Z,
      }
    `);
  }

  {
    const result = await model.create({
      date1: new Date('2005-01-01T00:00:00Z'),
      date2: new Date('2006-01-01T00:00:00Z'),
    });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "date1": 2005-01-01T00:00:00.000Z,
        "date2": 2006-01-01T00:00:00.000Z,
      }
    `);
  }
});

test('Decimal128', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      dec1: rule.mongoDecimal128(),
      dec2: rule.mongoDecimal128().default(new mongo.Decimal128('12345')),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ dec1: new mongo.Decimal128('11') });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "dec1": {
          "$numberDecimal": "11",
        },
        "dec2": {
          "$numberDecimal": "12345",
        },
      }
    `);
  }

  {
    const result = await model.create({
      dec1: new mongo.Decimal128('11'),
      dec2: new mongo.Decimal128('12'),
    });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "dec1": {
          "$numberDecimal": "11",
        },
        "dec2": {
          "$numberDecimal": "12",
        },
      }
    `);
  }
});

test('objectId', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      obj1: rule.mongoObjectId(),
      obj2: rule.mongoObjectId().default(new mongo.ObjectId('67e4c72dd163c5dbf922b752')),
    },
    versionKey: false,
  });

  {
    const result = await model.create({
      obj1: new mongo.ObjectId('67e4c72ed163c5dbf922b764'),
    });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "obj1": "67e4c72ed163c5dbf922b764",
        "obj2": "67e4c72dd163c5dbf922b752",
      }
    `);
  }

  {
    const result = await model.create({
      obj1: new mongo.ObjectId('67e4c72ed163c5dbf922b764'),
      obj2: new mongo.ObjectId('67e61bb7d163c5dbf9503080'),
    });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "obj1": "67e4c72ed163c5dbf922b764",
        "obj2": "67e61bb7d163c5dbf9503080",
      }
    `);
  }
});

test('数组', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      arr1: rule.array({ hello: rule.string() }),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ arr1: [{ hello: 'abc' }] });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "arr1": [
          {
            "hello": "abc",
          },
        ],
      }
    `);
  }

  {
    const result = await model.create({
      arr1: [{ hello: 'foo', world: 'this-property-not-saved' }],
    });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "arr1": [
          {
            "hello": "foo",
          },
        ],
      }
    `);
  }

  await expect(() => model.create({ arr1: 'abc' })).rejects.toThrow(Error);
  await expect(() => model.create({ arr1: ['abc'] })).rejects.toThrow(Error);
});

test('空数组可填充任意数据', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      arr1: rule.array(),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ arr1: ['abc', 123, { foo: 'bar' }] });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "arr1": [
          "abc",
          123,
          {
            "foo": "bar",
          },
        ],
      }
    `);
  }
});

test('对象', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      obj: rule.object({ hello: rule.string(), world: rule.string() }),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ obj: { hello: 'foo', world: 'bar' } });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "obj": {
          "hello": "foo",
          "world": "bar",
        },
      }
    `);
  }

  await expect(() => model.create({ obj: 'abc' })).rejects.toThrow(Error);
  await expect(() => model.create({ obj: { hello: 'foo' } })).rejects.toThrow(Error);
});

test('任意类型', async () => {
  const model = defineMongooseModel('foo', {
    schemas: {
      any: rule.any(),
    },
    versionKey: false,
  });

  {
    const result = await model.create({ any: 123 });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "any": 123,
      }
    `);
  }

  {
    const result = await model.create({ any: 'abc' });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json).toMatchInlineSnapshot(`
      {
        "any": "abc",
      }
    `);
  }

  {
    const result = await model.create({ any: new mongo.Decimal128('1234') });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json.any).toBeInstanceOf(mongo.Decimal128);
    expect(json).toMatchInlineSnapshot(`
      {
        "any": {
          "$numberDecimal": "1234",
        },
      }
    `);
  }

  {
    const result = await model.create({
      any: new mongo.ObjectId('67e4c72dd163c5dbf922b752'),
    });
    const json = result.toJSON();
    Reflect.deleteProperty(json, '_id');
    expect(json.any).toBeInstanceOf(mongo.ObjectId);
    expect(json).toMatchInlineSnapshot(`
      {
        "any": "67e4c72dd163c5dbf922b752",
      }
    `);
  }
});

test('不支持的验证器', async () => {
  expect(() =>
    defineMongooseModel('foo', {
      schemas: {
        // @ts-expect-error
        url: rule.url(),
      },
    }),
  ).to.toThrowError();
});

test('时间戳', async () => {
  {
    const model = defineMongooseModel('foo-1', {
      schemas: { str: rule.string() },
      versionKey: false,
      timestamps: true,
    });
    const result = await model.create({ str: 'foo' });
    const json = result.toJSON();
    expect(Object.keys(json)).toMatchInlineSnapshot(`
      [
        "str",
        "_id",
        "createdAt",
        "updatedAt",
      ]
    `);
  }

  {
    const model = defineMongooseModel('foo-2', {
      schemas: { str: rule.string() },
      versionKey: false,
      timestamps: false,
    });
    const result = await model.create({ str: 'foo' });
    const json = result.toJSON();
    expect(Object.keys(json)).toMatchInlineSnapshot(`
      [
        "str",
        "_id",
      ]
    `);
  }

  {
    const model = defineMongooseModel('foo-3', {
      schemas: { str: rule.string() },
      versionKey: false,
      timestamps: {},
    });
    const result = await model.create({ str: 'foo' });
    const json = result.toJSON();
    expect(Object.keys(json)).toMatchInlineSnapshot(`
      [
        "str",
        "_id",
        "createdAt",
        "updatedAt",
      ]
    `);
  }

  {
    const model = defineMongooseModel('foo-4', {
      schemas: { str: rule.string() },
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    });
    const result = await model.create({ str: 'foo' });
    const json = result.toJSON();
    expect(Object.keys(json)).toMatchInlineSnapshot(`
      [
        "str",
        "_id",
        "created_at",
        "updated_at",
      ]
    `);
  }

  {
    const model = defineMongooseModel('foo-5', {
      schemas: { str: rule.string() },
      versionKey: false,
      timestamps: { createdAt: 'created_at', updatedAt: false },
    });
    const result = await model.create({ str: 'foo' });
    const json = result.toJSON();
    expect(Object.keys(json)).toMatchInlineSnapshot(`
      [
        "str",
        "_id",
        "created_at",
      ]
    `);
  }
});

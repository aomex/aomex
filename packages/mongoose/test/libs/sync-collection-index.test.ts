import { MongoMemoryReplSet, MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeEach, afterEach, test, expect, describe } from 'vitest';
import { defineMongooseModel } from '../../src';
import { rule } from '@aomex/common';
import { getMongoBinary } from '../helper/get-mongo-binary';

describe('单机', () => {
  let mongod!: MongoMemoryServer;

  beforeEach(async () => {
    mongod = await MongoMemoryServer.create({ binary: getMongoBinary() });
  }, 60_000 /* download */);

  afterEach(async () => {
    Object.keys(mongoose.models).forEach((modelName) => {
      mongoose.deleteModel(modelName);
    });
    await mongoose.disconnect();
    await mongod.stop({ doCleanup: true });
  });

  test('使用 primary', async () => {
    await mongoose.connect(mongod.getUri(), {
      readPreference: 'primary',
      autoIndex: false,
    });
    const model = defineMongooseModel('foo', {
      schemas: {
        str: rule.string(),
        num: rule.number(),
      },
      indexes: [{ fields: { str: 'asc' } }],
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
            "str": 1,
          },
          "name": "str_1",
          "v": 2,
        },
      ]
    `);
  });

  test('使用 secondary', async () => {
    await mongoose.connect(mongod.getUri(), {
      readPreference: 'secondary',
      autoIndex: false,
    });
    const model = defineMongooseModel('foo', {
      schemas: {
        str: rule.string(),
        num: rule.number(),
      },
      indexes: [{ fields: { str: 'asc' } }],
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
            "str": 1,
          },
          "name": "str_1",
          "v": 2,
        },
      ]
    `);
  });
});

describe('副本集', () => {
  let mongod!: MongoMemoryReplSet;

  beforeEach(async () => {
    mongod = await MongoMemoryReplSet.create({ binary: getMongoBinary() });
  }, 60_000 /* download */);

  afterEach(async () => {
    Object.keys(mongoose.models).forEach((modelName) => {
      mongoose.deleteModel(modelName);
    });
    await mongoose.disconnect();
    await mongod.stop({ doCleanup: true });
  });

  test('使用 primary', async () => {
    await mongoose.connect(mongod.getUri(), {
      readPreference: 'primary',
      replicaSet: 'testset',
      autoIndex: false,
    });
    const model = defineMongooseModel('foo', {
      schemas: {
        str: rule.string(),
        num: rule.number(),
      },
      indexes: [{ fields: { str: 'asc' } }],
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
            "str": 1,
          },
          "name": "str_1",
          "v": 2,
        },
      ]
    `);
  });

  test('使用 secondaryPreferred', async () => {
    await mongoose.connect(mongod.getUri(), {
      readPreference: 'secondaryPreferred',
      replicaSet: 'testset',
      autoIndex: false,
    });
    const model = defineMongooseModel('foo', {
      schemas: {
        str: rule.string(),
        num: rule.number(),
      },
      indexes: [{ fields: { str: 'asc' } }],
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
            "str": 1,
          },
          "name": "str_1",
          "v": 2,
        },
      ]
    `);
  });
});

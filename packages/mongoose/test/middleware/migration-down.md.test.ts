import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeEach, afterEach, test, expect } from 'vitest';
import { FooModel } from '../fixtures/models/foo.model';
import { ConsoleApp } from '@aomex/console';
import path from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { MigrationModel } from '../../src/models/migration.model';
import { migrationDown } from '../../src/middleware/migration-down.md';
import { getMongoBinary } from '../helper/get-mongo-binary';

const modelsPath = path.join(
  path.relative(path.resolve(), path.dirname(import.meta.dirname)),
  'fixtures',
  'models',
);

let migrationsPath!: string;
let app!: ConsoleApp;
let mongod!: MongoMemoryReplSet;

beforeEach(async () => {
  migrationsPath = path.join(
    path.relative(path.resolve(), path.dirname(import.meta.dirname)),
    'fixtures',
    'migrations-for-down' + Math.random(),
  );

  mongod = await MongoMemoryReplSet.create({ binary: getMongoBinary() });
  await mongoose.connect(mongod.getUri(), {
    replicaSet: 'testset',
    readPreference: 'secondaryPreferred',
  });
  const collection = mongoose.connection.db!.collection('foo');
  await collection.insertMany([{ foo: 'bar1' }, { foo: 'bar2' }, { fo: 'bar3', bar: 1 }]);

  await mkdir(migrationsPath, { recursive: true });

  app = new ConsoleApp({
    mount: [
      migrationDown({
        migrationsPath: migrationsPath,
        modelsPath: modelsPath,
        connection: mongoose.connection,
      }),
    ],
  });
}, 60_000 /* download */);

afterEach(async () => {
  await mongoose.disconnect();
  await mongod.stop({ doCleanup: true });
  await rm(migrationsPath, { recursive: true, force: true });
});

test('没有迁移记录则不回滚', async () => {
  const code = await app.run('mongoose:migration:down');
  expect(code).toBe(0);
});

test('回滚文件不存在则直接报错', async () => {
  await MigrationModel.insertMany([{ filename: '12345_test' }]);
  const app = new ConsoleApp({
    mount: [
      migrationDown({
        migrationsPath: migrationsPath,
        modelsPath: modelsPath,
        connection: mongoose.connection,
      }),
    ],
  });
  const code = await app.run('mongoose:migration:down');
  expect(code).toBe(1);
});

test('原始数据', async () => {
  await expect(FooModel.find({}, { _id: 0 }).lean()).resolves.toMatchInlineSnapshot(`
    [
      {
        "foo": "bar1",
      },
      {
        "foo": "bar2",
      },
      {
        "bar": 1,
        "fo": "bar3",
      },
    ]
  `);
});

test('每次只滚一个', async () => {
  await MigrationModel.insertMany([
    { filename: '12345_test' },
    { filename: '12346_test' },
  ]);
  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async () => {},
      down: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { fooooo: 'good' }}, { session });
      },
    });`,
  );
  await writeFile(
    path.join(migrationsPath, '12346_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async () => {},
      down: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { foo: 'fooooo' }}, { session });
      },
    });`,
  );
  await app.run('mongoose:migration:down');
  await expect(FooModel.find({}, { _id: 0 }).lean()).resolves.toMatchInlineSnapshot(`
    [
      {
        "fooooo": "bar1",
      },
      {
        "fooooo": "bar2",
      },
      {
        "bar": 1,
        "fo": "bar3",
      },
    ]
  `);
  await expect(MigrationModel.find({}, { filename: 1, _id: 0 })).resolves
    .toMatchInlineSnapshot(`
    [
      {
        "filename": "12345_test",
      },
    ]
  `);

  await app.run('mongoose:migration:down');
  await expect(FooModel.find({}, { _id: 0 }).lean()).resolves.toMatchInlineSnapshot(`
    [
      {
        "good": "bar1",
      },
      {
        "good": "bar2",
      },
      {
        "bar": 1,
        "fo": "bar3",
      },
    ]
  `);
  await expect(MigrationModel.find()).resolves.toMatchInlineSnapshot(`[]`);
});

test('一次回滚全部', async () => {
  await MigrationModel.insertMany([
    { filename: '12345_test' },
    { filename: '12346_test' },
  ]);
  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async () => {},
      down: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { fooooo: 'good' }}, { session });
      },
    });`,
  );
  await writeFile(
    path.join(migrationsPath, '12346_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async () => {},
      down: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { foo: 'fooooo' }}, { session });
      },
    });`,
  );
  await app.run('mongoose:migration:down', '--all');
  await expect(FooModel.find({}, { _id: 0 }).lean()).resolves.toMatchInlineSnapshot(`
    [
      {
        "good": "bar1",
      },
      {
        "good": "bar2",
      },
      {
        "bar": 1,
        "fo": "bar3",
      },
    ]
  `);
  await expect(MigrationModel.find()).resolves.toMatchInlineSnapshot(`[]`);
});

test('出错回滚', async () => {
  await MigrationModel.insertMany([{ filename: '12345_test' }]);
  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async () => {},
      down: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { foo: 'fooooo' }}, { session });
        await db.collection('foo').updateMany({}, { $rename: { fooooo: 'good' }}, { session });
        throw new Error('test');
      },
    });`,
  );
  const code = await app.run('mongoose:migration:down');
  expect(code).toBe(1);
  await expect(FooModel.find({}, { _id: 0 }).lean()).resolves.toMatchInlineSnapshot(`
    [
      {
        "foo": "bar1",
      },
      {
        "foo": "bar2",
      },
      {
        "bar": 1,
        "fo": "bar3",
      },
    ]
  `);
});

test('同步索引', async () => {
  await expect(FooModel.listIndexes()).resolves.toMatchInlineSnapshot(`
    [
      {
        "key": {
          "_id": 1,
        },
        "name": "_id_",
        "v": 2,
      },
    ]
  `);
  await app.run('mongoose:migration:down');
  await expect(FooModel.listIndexes()).resolves.toMatchInlineSnapshot(`
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
          "abc": -1,
        },
        "name": "abc_-1",
        "v": 2,
      },
    ]
  `);
});

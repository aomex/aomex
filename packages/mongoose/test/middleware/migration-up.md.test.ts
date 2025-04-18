import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { beforeEach, afterEach, test, expect } from 'vitest';
import { FooModel } from '../fixtures/models/foo.model';
import { ConsoleApp } from '@aomex/console';
import { migrationUp } from '../../src/middleware/migration-up.md';
import path, { join } from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { MigrationModel } from '../../src/models/migration.model';
import { getMongoBinary } from '../helper/get-mongo-binary';
import { tmpdir } from 'node:os';

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
    'migrations-for-up' + Math.random(),
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
      migrationUp({
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

test('目录不存在则自动创建', async () => {
  const app = new ConsoleApp({
    mount: [
      migrationUp({
        migrationsPath: join(tmpdir(), 'not-found-' + Date.now() + Math.random()),
        modelsPath: modelsPath,
        connection: mongoose.connection,
      }),
    ],
  });
  const code = await app.run('mongoose:migration:up');
  expect(code).toBe(0);
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

test('完整迁移', async () => {
  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { foo: 'fooooo' }}, { session });
      },
      down: async () => {},
    });`,
  );
  await writeFile(
    path.join(migrationsPath, '12346_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { fooooo: 'good' }}, { session });
      },
      down: async () => {},
    });`,
  );
  await app.run('mongoose:migration:up');
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
  await expect(MigrationModel.find({}, { filename: 1, _id: 0 })).resolves
    .toMatchInlineSnapshot(`
    [
      {
        "filename": "12345_test",
      },
      {
        "filename": "12346_test",
      },
    ]
  `);
});

test('部分迁移', async () => {
  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { foo: 'fooooo' }}, { session });
      },
      down: async () => {},
    });`,
  );
  await app.run('mongoose:migration:up');
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

  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async (db, session) => {
        throw new Error('foo');
      },
      down: async () => {},
    });`,
  );
  await writeFile(
    path.join(migrationsPath, '12346_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { fooooo: 'good' }}, { session });
      },
      down: async () => {},
    });`,
  );
  await app.run('mongoose:migration:up');
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
  await expect(MigrationModel.find({}, { filename: 1, _id: 0 })).resolves
    .toMatchInlineSnapshot(`
    [
      {
        "filename": "12345_test",
      },
      {
        "filename": "12346_test",
      },
    ]
  `);
});

test('出错回滚', async () => {
  await writeFile(
    path.join(migrationsPath, '12345_test.ts'),
    `
    import { migrate } from '../../../src';
    export default migrate({
      up: async (db, session) => {
        await db.collection('foo').updateMany({}, { $rename: { foo: 'fooooo' }}, { session });
        await db.collection('foo').updateMany({}, { $rename: { fooooo: 'good' }}, { session });
        throw new Error('test');
      },
      down: async () => {},
    });`,
  );
  const code = await app.run('mongoose:migration:up');
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
  await app.run('mongoose:migration:up');
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

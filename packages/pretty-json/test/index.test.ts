import { Readable } from 'node:stream';
import { middleware } from '@aomex/core';
import { WebApp } from '@aomex/web';
import { expect, test } from 'vitest';
import supertest from 'supertest';
import { prettyJson } from '../src';

test('默认开启美化', async () => {
  const app = new WebApp({
    mount: [
      prettyJson(),
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect('content-type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "{
          "foo": "bar"
        }"
      `);
    });
});

test('null和undefined', async () => {
  const app = new WebApp({
    mount: [
      prettyJson(),
      middleware.web((ctx) => {
        ctx.send({ foo: null, bar: undefined });
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "{
          "foo": null
        }"
      `);
    });
});

test('通过enable=false关闭美化', async () => {
  const app = new WebApp({
    mount: [
      prettyJson({ enable: false }),
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`"{"foo":"bar"}"`);
    });
});

test('自定义空格', async () => {
  const app = new WebApp({
    mount: [
      prettyJson({ spaces: 6 }),
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "{
              "foo": "bar"
        }"
      `);
    });
});

test('通过查询字符串开启美化', async () => {
  const app = new WebApp({
    mount: [
      prettyJson({ enable: false, query: 'make_it_pretty' }),
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    ],
  });

  await supertest(app.listen())
    .get('/?test')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`"{"foo":"bar"}"`);
    });
  await supertest(app.listen())
    .get('/?make_it_pretty')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "{
          "foo": "bar"
        }"
      `);
    });
});

test('如果设置中不包含查询字符串，则查询字符串无效', async () => {
  const app = new WebApp({
    mount: [
      prettyJson({ enable: false }),
      middleware.web((ctx) => {
        ctx.send({ foo: 'bar' });
      }),
    ],
  });

  await supertest(app.listen())
    .get('/?pretty')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`"{"foo":"bar"}"`);
    });
});

test('美化对象流', async () => {
  const app = new WebApp({
    mount: [
      prettyJson({ spaces: 4 }),
      middleware.web((ctx) => {
        const stream = new Readable({ objectMode: true });
        ctx.send(stream);
        stream.push({ message: '1' });
        stream.push({ message: '2' });
        stream.push(null);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect('content-type', 'application/json; charset=utf-8')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`
        "[
        {
            "message": "1"
        }
        ,
        {
            "message": "2"
        }
        ]
        "
      `);
    });
});

test('普通流不美化', async () => {
  const app = new WebApp({
    mount: [
      prettyJson({ spaces: 4 }),
      middleware.web((ctx) => {
        const stream = new Readable();
        ctx.send(stream);
        stream.push(JSON.stringify({ message: '1' }));
        stream.push(JSON.stringify({ message: '2' }));
        stream.push(null);
      }),
    ],
  });

  await supertest(app.listen())
    .get('/')
    .expect('content-type', 'application/octet-stream')
    .expect((res) => {
      expect(res.text).toMatchInlineSnapshot(`undefined`);
      expect(res.body.toString()).toMatchInlineSnapshot(
        `"{"message":"1"}{"message":"2"}"`,
      );
    });
});

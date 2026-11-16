import { expect, test } from 'vitest';
import { Builder } from '../../src';

const action = {
  action: () => {},
};

test('斜杆修正', () => {
  const builder = new Builder('test////foo//', '////bar///', ['GET'], action);
  expect(builder.uri).toBe('/test/foo/bar');
  expect(builder.match('/test/foo/bar')).toStrictEqual(Object.create(null));
});

test('定义侧尾斜杠会被剥掉', () => {
  const builder = new Builder('/api/', '/users/', ['GET'], action);
  expect(builder.uri).toBe('/api/users');
  expect(builder.match('/api/users')).toStrictEqual(Object.create(null));
  expect(builder.match('/api/users/')).toStrictEqual(Object.create(null));
});

test('路径参数', () => {
  const builder = new Builder('', '/users/:userId/posts/:postId', ['GET'], action);
  expect(builder.match('/users/2/posts/5678')).toMatchInlineSnapshot(`
    {
      "postId": "5678",
      "userId": "2",
    }
  `);
  // 请求路径尾斜杠仍可匹配（pattern 无显式尾 /）
  expect(builder.match('/users/2/posts/5678/')).toMatchInlineSnapshot(`
    {
      "postId": "5678",
      "userId": "2",
    }
  `);
});

test('参数转义', () => {
  const builder = new Builder('', '/users/:userId/posts/:postId', ['GET'], action);
  expect(builder.match('/users/%23/posts/xxxx')).toMatchInlineSnapshot(`
    {
      "postId": "xxxx",
      "userId": "#",
    }
  `);
});

test('同段多参数时末段贪婪（path-to-regexp@9）', () => {
  const builder = new Builder('', '/:file.:ext', ['GET'], action);
  expect(builder.match('/foo.json.html')).toMatchInlineSnapshot(`
    {
      "ext": "json.html",
      "file": "foo",
    }
  `);
  expect(builder.match('/foo.json')).toMatchInlineSnapshot(`
    {
      "ext": "json",
      "file": "foo",
    }
  `);
  expect(builder.match('/foo')).toBeFalsy();
  expect(builder.match('/foo.')).toBeFalsy();
});

test('通配符捕获为数组', () => {
  const builder = new Builder('', '/files/*path', ['GET'], action);
  expect(builder.match('/files/a/b/c')).toMatchInlineSnapshot(`
    {
      "path": [
        "a",
        "b",
        "c",
      ],
    }
  `);
  expect(builder.match('/files')).toBeFalsy();
});

test('可选通配符段', () => {
  const builder = new Builder('', '/files{/*path}', ['GET'], action);
  expect(builder.match('/files')).toStrictEqual(Object.create(null));
  expect(builder.match('/files/a/b')).toMatchInlineSnapshot(`
    {
      "path": [
        "a",
        "b",
      ],
    }
  `);
});

test('可选命名参数段', () => {
  const builder = new Builder('', '/users{/:id}', ['GET'], action);
  expect(builder.match('/users')).toStrictEqual(Object.create(null));
  expect(builder.match('/users/42')).toMatchInlineSnapshot(`
    {
      "id": "42",
    }
  `);
  expect(builder.match('/users/42/extra')).toBeFalsy();
});

test('必须完整匹配', () => {
  const builder = new Builder('', '/users', ['GET'], action);
  for (const uri of [
    '/123users',
    '/users123',
    '/my/users',
    '/my/users/my',
    '/users/ok',
    '/user',
    '/users-123',
    'user',
    '',
  ]) {
    expect(builder.match(uri)).toBeFalsy();
  }
});

test('纯路径', () => {
  expect(new Builder('', '/users', ['GET'], action).isPureUri()).toBeTruthy();
  expect(new Builder('', '/:users', ['GET'], action).isPureUri()).toBeFalsy();
  expect(new Builder('', '/*users', ['GET'], action).isPureUri()).toBeFalsy();
  expect(new Builder('', '/:file.:ext', ['GET'], action).isPureUri()).toBeFalsy();
});

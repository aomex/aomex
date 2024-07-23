import { expect, test } from 'vitest';
import { Builder } from '../../src';

const action = {
  action: () => {},
};

test('斜杆修正', () => {
  const builder = new Builder('test////foo//', '////bar///', ['GET'], action);
  expect(builder.match('/test/foo/bar')).toStrictEqual(Object.create(null));
});

test('路径参数', () => {
  const builder = new Builder('', '/users/:userId/posts/:postId', ['GET'], action);
  expect(builder.match('/users/2/posts/5678')).toMatchInlineSnapshot(`
    {
      "postId": "5678",
      "userId": "2",
    }
  `);
  expect(builder.match('/users/%23/posts/xxxx')).toMatchInlineSnapshot(`
    {
      "postId": "xxxx",
      "userId": "#",
    }
  `);
  expect(builder.match('/users/%23/posts')).toBeFalsy();
});

test('路径正则参数', () => {
  expect(new Builder('', '/users/(\\d+)/posts', ['GET'], action).match('/users/2/posts'))
    .toMatchInlineSnapshot(`
    {
      "0": "2",
    }
  `);
});

test('必须完整路径匹配', () => {
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
  expect(new Builder('', '/{users}?', ['GET'], action).isPureUri()).toBeFalsy();
});

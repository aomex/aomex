import { describe, expect, test } from 'vitest';
import { mockServer } from '../fixture/mock-server';

describe('send', () => {
  test('状态码', async () => {
    const { ctx, res } = await mockServer((agent) => agent.get('/'));
    ctx.send(202);
    expect(res.statusCode).toBe(202);
    expect(res.body).toBeNull();
  });

  test('内容', async () => {
    const { ctx, res } = await mockServer((agent) => agent.get('/'));
    ctx.send('foo bar');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe('foo bar');
    res.flush();
  });

  test('状态码+内容', async () => {
    const { ctx, res } = await mockServer((agent) => agent.get('/'));
    ctx.send(201, 'foo bar');
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe('foo bar');
    res.flush();
  });
});

test('抛出异常', async () => {
  const { ctx, res } = await mockServer((agent) => agent.get('/'));
  expect(() => ctx.throw(400, 'foo bar')).toThrowError('foo bar');
  res.flush();
});

import { expect, test } from 'vitest';
import { mockServer } from '../fixture/mock-server';
import { existsSync } from 'node:fs';
import { rename, unlink } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const dir = dirname(import.meta.dirname);

const waitDeleted = async (filepath: string) => {
  await expect.poll(() => existsSync(filepath)).toBeFalsy();
};

test('解析后业务期间文件存在，响应结束后删除', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );

  const filepath = (req.body as { file1: { filepath: string }[] }).file1[0]!.filepath;
  expect(existsSync(filepath)).toBeTruthy();

  res.flush();
  await waitDeleted(filepath);
});

test('多文件都会在响应结束后删除', async () => {
  const { req, res } = await mockServer((agent) =>
    agent
      .post('/')
      .attach('files', join(dir, 'fixture/upload-1.txt'))
      .attach('files', join(dir, 'fixture/upload-2.txt')),
  );

  const filepaths = (req.body as { files: { filepath: string }[] }).files.map(
    (file) => file.filepath,
  );
  expect(filepaths).toHaveLength(2);
  for (const filepath of filepaths) {
    expect(existsSync(filepath)).toBeTruthy();
  }

  res.flush();
  for (const filepath of filepaths) {
    await waitDeleted(filepath);
  }
});

test('相同文件上传两次：filepath不同、md5相同，响应结束后都删除', async () => {
  const { req, res } = await mockServer((agent) =>
    agent
      .post('/')
      .attach('files', join(dir, 'fixture/upload-1.txt'))
      .attach('files', join(dir, 'fixture/upload-1.txt')),
  );

  const files = (req.body as { files: { filepath: string; hash: string }[] }).files;
  expect(files).toHaveLength(2);
  expect(files[0]!.filepath).not.toBe(files[1]!.filepath);
  expect(files[0]!.hash).toBe(files[1]!.hash);
  expect(existsSync(files[0]!.filepath)).toBeTruthy();
  expect(existsSync(files[1]!.filepath)).toBeTruthy();

  res.flush();
  await waitDeleted(files[0]!.filepath);
  await waitDeleted(files[1]!.filepath);
});

test('仅字段+附件时也会清理附件临时文件', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').field('name', 'a').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );

  const filepath = (req.body as { file1: { filepath: string }[] }).file1[0]!.filepath;
  expect(existsSync(filepath)).toBeTruthy();

  res.flush();
  await waitDeleted(filepath);
});

test('业务抛错经 onError 后仍删除临时文件', async () => {
  const { req, res, ctx, app } = await mockServer((agent) =>
    agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );

  const filepath = (req.body as { file1: { filepath: string }[] }).file1[0]!.filepath;
  expect(existsSync(filepath)).toBeTruthy();

  // mockServer 未走 callback()，需先挂 error 监听，否则 emit('error') 会在 flush 前抛出
  app.on('error', () => {});
  // 模拟 WebApp.callback：fn(ctx).catch(res.onError)
  try {
    ctx.throw(400, 'biz failed');
  } catch (err) {
    await res.onError(err as Error);
  }

  await waitDeleted(filepath);
});

test('业务rename走后响应结束不报错且不误删新路径', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );

  const tempPath = (req.body as { file1: { filepath: string }[] }).file1[0]!.filepath;
  const movedPath = `${tempPath}.moved`;
  await rename(tempPath, movedPath);
  expect(existsSync(tempPath)).toBeFalsy();
  expect(existsSync(movedPath)).toBeTruthy();

  res.flush();
  await waitDeleted(tempPath);
  expect(existsSync(movedPath)).toBeTruthy();
  await unlink(movedPath);
});

test('不同请求的文件在各自响应结束时才删除', async () => {
  const [req1, req2] = await Promise.all([
    mockServer((agent) =>
      agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
    ),
    mockServer((agent) =>
      agent.post('/').attach('file1', join(dir, 'fixture/upload-2.txt')),
    ),
  ]);

  const filepath1 = (req1.req.body as { file1: { filepath: string }[] }).file1[0]!
    .filepath;
  const filepath2 = (req2.req.body as { file1: { filepath: string }[] }).file1[0]!
    .filepath;
  expect(filepath1).not.toBe(filepath2);
  expect(existsSync(filepath1)).toBeTruthy();
  expect(existsSync(filepath2)).toBeTruthy();

  req1.res.flush();
  await waitDeleted(filepath1);
  expect(existsSync(filepath2)).toBeTruthy();

  req2.res.flush();
  await waitDeleted(filepath2);
});

test('payload string：json 解析为 string，text 保留原文', async () => {
  const jsonReq = await mockServer((agent) =>
    agent.post('/').type('json').send('"hello"'),
  );
  expect(jsonReq.req.body).toBe('hello');
  jsonReq.res.flush();

  const textReq = await mockServer((agent) => agent.post('/').type('text').send('hello'));
  expect(textReq.req.body).toBe('hello');
  textReq.res.flush();
});

test('payload number：json 解析为 number，text 保留原文', async () => {
  const jsonReq = await mockServer((agent) => agent.post('/').type('json').send('0'));
  expect(jsonReq.req.body).toBe(0);
  jsonReq.res.flush();

  const textReq = await mockServer((agent) => agent.post('/').type('text').send('0'));
  expect(textReq.req.body).toBe('0');
  textReq.res.flush();
});

test('payload boolean：json 解析为 boolean，text 保留原文', async () => {
  const jsonReq = await mockServer((agent) => agent.post('/').type('json').send('false'));
  expect(jsonReq.req.body).toBe(false);
  jsonReq.res.flush();

  const textReq = await mockServer((agent) => agent.post('/').type('text').send('false'));
  expect(textReq.req.body).toBe('false');
  textReq.res.flush();
});

test('payload null：json 解析为 null，text 保留原文', async () => {
  const jsonReq = await mockServer((agent) => agent.post('/').type('json').send('null'));
  expect(jsonReq.req.body).toBeNull();
  jsonReq.res.flush();

  const textReq = await mockServer((agent) => agent.post('/').type('text').send('null'));
  expect(textReq.req.body).toBe('null');
  textReq.res.flush();
});

test('payload 空字符串：json 解析为 ""，text 保留原文', async () => {
  const jsonReq = await mockServer((agent) => agent.post('/').type('json').send('""'));
  expect(jsonReq.req.body).toBe('');
  jsonReq.res.flush();

  const textReq = await mockServer((agent) => agent.post('/').type('text').send(''));
  expect(textReq.req.body).toBe('');
  textReq.res.flush();
});

test('空 JSON 报文仍解析为对象', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').set('Content-Type', 'application/json').send(''),
  );
  expect(req.body).toStrictEqual({});
  res.flush();
});

test('urlencoded 不是顶层标量语义', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').type('form').send({ flag: 'false', count: '0' }),
  );
  expect(req.body).toStrictEqual({ flag: 'false', count: '0' });
  res.flush();
});

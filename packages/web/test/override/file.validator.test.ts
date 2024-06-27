import { describe, expect, test } from 'vitest';
import { FileValidator } from '../../src';
import { mockServer } from '../fixture/mock-server';
import { dirname, join } from 'node:path';
import { rule, validate } from '@aomex/core';
import { PersistentFile } from 'formidable';

const dir = dirname(import.meta.dirname);

describe('链式调用返回新的实例', () => {
  const validator = new FileValidator();

  test('maxSize', () => {
    const v1 = validator.maxSize(200);
    expect(v1).toBeInstanceOf(FileValidator);
    expect(v1).not.toBe(validator);
  });

  test('mimeTypes', () => {
    const v1 = validator.mimeTypes('jpg');
    expect(v1).toBeInstanceOf(FileValidator);
    expect(v1).not.toBe(validator);
  });
});

test('maxSize支持传入字符串和数字', () => {
  const validator = new FileValidator().maxSize('20kb');
  expect(validator['config'].maxSize).toBe(20_480);

  const validator1 = validator.maxSize(3000);
  expect(validator1['config'].maxSize).toBe(3000);
});

test('接收单个文件', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );

  const validator = new FileValidator();
  const result = await validate(req.body, {
    file1: validator,
  });
  expect(result.file1).toBeInstanceOf(PersistentFile);
  expect(result.file1).toMatchObject({
    hash: 'ab56b4d92b40713acc5af89985d4b786',
    originalFilename: 'upload-1.txt',
    size: 5,
  });
  res.flush();
});

test('多个文件时，只处理第一个文件', async () => {
  const { req, res } = await mockServer((agent) =>
    agent
      .post('/')
      .attach('file1', join(dir, 'fixture/upload-1.txt'))
      .attach('file1', join(dir, 'fixture/upload-2.txt')),
  );

  const result = await validate(req.body, {
    file1: new FileValidator(),
  });
  expect(result.file1).toMatchObject({
    hash: 'ab56b4d92b40713acc5af89985d4b786',
    originalFilename: 'upload-1.txt',
    size: 5,
  });

  res.flush();
});

test('使用array+file的形式可以接受多个文件', async () => {
  const { req, res } = await mockServer((agent) =>
    agent
      .post('/')
      .attach('file1', join(dir, 'fixture/upload-1.txt'))
      .attach('file1', join(dir, 'fixture/upload-2.txt')),
  );

  const result = await validate(req.body, {
    file1: rule.array(new FileValidator()),
  });
  expect(result.file1).toHaveLength(2);
  expect(result.file1[0]).toMatchObject({
    hash: 'ab56b4d92b40713acc5af89985d4b786',
    originalFilename: 'upload-1.txt',
    size: 5,
  });
  expect(result.file1[1]).toMatchObject({
    hash: '7ac66c0f148de9519b8bd264312c4d64',
    originalFilename: 'upload-2.txt',
    size: 7,
  });
  res.flush();
});

test('非文件类型', async () => {
  await expect(new FileValidator()['validate']({ file1: 'foo' })).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是文件类型",
      ],
    }
  `);
});

test('体积太大', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );
  const validator = new FileValidator().maxSize(2);
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [Error: 验证失败：

    - file1：文件体积太大
    ]
  `);
  res.flush();
});

test('媒体类型', async () => {
  const { req, res } = await mockServer((agent) =>
    agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
  );
  const validator = new FileValidator().mimeTypes('.html');
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`
    [Error: 验证失败：

    - file1：不支持的文件类型
    ]
  `);
  res.flush();
});

test('快捷方式', () => {
  expect(rule.file()).toBeInstanceOf(FileValidator);
});

test('获取文档', () => {
  expect(new FileValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "binary",
      "type": "string",
    }
  `);
});

import { describe, expect, test } from 'vitest';
import { FileValidator } from '../../src';
import { mockServer } from '../fixture/mock-server';
import { dirname, join } from 'node:path';
import { rule, validate } from '@aomex/common';
import { PersistentFile } from 'formidable';
import { ensureFiles } from '../fixture/ensure-files';

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

  test('fallbackToMimetype', () => {
    const v1 = validator.fallbackToMimetype();
    expect(v1).toBeInstanceOf(FileValidator);
    expect(v1).not.toBe(validator);
    expect(v1['config'].fallbackToMimetype).toBe(true);

    const v2 = v1.fallbackToMimetype(false);
    expect(v2).not.toBe(v1);
    expect(v2['config'].fallbackToMimetype).toBe(false);

    const v3 = v2.fallbackToMimetype(true);
    expect(v3['config'].fallbackToMimetype).toBe(true);
  });
});

test('maxSize支持传入字符串和数字', () => {
  const validator = new FileValidator().maxSize('20kb');
  expect(validator['config'].maxSize).toBe(20_480);

  const validator1 = validator.maxSize(3000);
  expect(validator1['config'].maxSize).toBe(3000);
});

test('接收单个文件', async () => {
  const { req, res } = await mockServer(
    (agent) => agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
    undefined,
    [ensureFiles('file1')],
  );

  const validator = new FileValidator();
  const result = await validate(req.body, {
    file1: validator,
  });
  expect(result.file1).toBeInstanceOf(PersistentFile);
  expect(result.file1).toMatchObject({
    hash: 'ab56b4d92b40713acc5af89985d4b786',
    originalFilename: 'upload-1.txt',
    mimetype: 'text/plain',
    size: 5,
  });
  res.flush();
});

test('多个文件时，只处理第一个文件', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent
        .post('/')
        .attach('file1', join(dir, 'fixture/upload-1.txt'))
        .attach('file1', join(dir, 'fixture/upload-2.txt')),
    undefined,
    [ensureFiles('file1')],
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
  const { req, res } = await mockServer(
    (agent) =>
      agent
        .post('/')
        .attach('file1', join(dir, 'fixture/upload-1.txt'))
        .attach('file1', join(dir, 'fixture/upload-2.txt')),
    undefined,
    [ensureFiles('file1')],
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
  await expect(new FileValidator()['validate']({ file1: 'foo' }, '', 'LABEL')).resolves
    .toMatchInlineSnapshot(`
    {
      "errors": [
        "LABEL必须为文件",
      ],
    }
  `);
});

test('体积太大', async () => {
  const { req, res } = await mockServer(
    (agent) => agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt')),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().maxSize(2);
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1文件过大]`);
  res.flush();
});

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
  'base64',
);

test('媒体类型按文件内容判断，声明成图片的文本会被拒绝', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt'), {
        filename: 'a.png',
        contentType: 'image/png',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().mimeTypes('.png');
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1的文件类型不受支持]`);
  res.flush();
});

test('没有文件签名时默认拒绝', async () => {
  const { req, res } = await mockServer(
    (agent) => agent.post('/').attach('file1', join(dir, 'fixture/upload-1.html')),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().mimeTypes('.html');
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1的文件类型不受支持]`);
  res.flush();
});

test('fallbackToMimetype 时没有文件签名的文件按声明类型放行', async () => {
  const { req, res } = await mockServer(
    (agent) => agent.post('/').attach('file1', join(dir, 'fixture/upload-1.html')),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().mimeTypes('.html').fallbackToMimetype();
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).resolves.toMatchObject({
    file1: {
      mimetype: 'text/html',
      originalFilename: 'upload-1.html',
    },
  });
  res.flush();
});

test('fallbackToMimetype 会相信伪装的 Content-Type', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt'), {
        filename: 'a.png',
        contentType: 'image/png',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().mimeTypes('.png').fallbackToMimetype();
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).resolves.toMatchObject({
    file1: { mimetype: 'image/png' },
  });
  res.flush();
});

test('认不出文件签名时保留客户端声明的类型', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt'), {
        filename: 'note.txt',
        contentType: 'text/plain',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  const result = await validate(req.body, { file1: new FileValidator() });
  expect(result.file1).toMatchObject({ mimetype: 'text/plain' });
  res.flush();
});

test('未限制类型时也按文件签名改写 mimetype', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', png, {
        filename: 'evil.exe',
        contentType: 'image/jpeg',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  const result = await validate(req.body, { file1: new FileValidator() });
  expect(result.file1).toMatchObject({ mimetype: 'image/png' });
  res.flush();
});

test('后缀名会换成媒体类型，且不看客户端 Content-Type', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', png, {
        filename: 'evil.exe',
        contentType: 'application/octet-stream',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().mimeTypes('.png');
  await expect(
    validate(req.body, {
      file1: validator,
    }),
  ).resolves.toMatchObject({
    file1: {
      originalFilename: 'evil.exe',
      mimetype: 'image/png',
      size: png.length,
    },
  });
  res.flush();
});

test('mimeTypes 保留媒体类型和通配符，扩展名才查表', () => {
  expect(new FileValidator().mimeTypes('.png', 'image/*')['config'].mimeTypes).toEqual([
    'image/png',
    'image/*',
  ]);
  expect(
    new FileValidator().mimeTypes('.html', 'text/plain')['config'].mimeTypes,
  ).toEqual(['text/html', 'text/plain']);
  expect(
    new FileValidator().mimeTypes(['jpg', '.jpg', 'image/jpeg'])['config'].mimeTypes,
  ).toEqual(['image/jpeg']);
});

test('mimeTypes 遇到无效 token 时抛错，空列表表示不限制类型', () => {
  expect(() =>
    new FileValidator().mimeTypes('not-a-type'),
  ).toThrowErrorMatchingInlineSnapshot(`[Error: 无效的媒体类型或文件扩展名：not-a-type]`);
  expect(() =>
    new FileValidator().mimeTypes(['jpg', 'not-a-type']),
  ).toThrowErrorMatchingInlineSnapshot(`[Error: 无效的媒体类型或文件扩展名：not-a-type]`);
  expect(() =>
    new FileValidator().mimeTypes('path/to/file'),
  ).toThrowErrorMatchingInlineSnapshot(
    `[Error: 无效的媒体类型或文件扩展名：path/to/file]`,
  );
  expect(new FileValidator().mimeTypes([])['config'].mimeTypes).toEqual([]);
});

test('直接传入的 text/plain 在 fallback 下放行纯文本', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', join(dir, 'fixture/upload-1.txt'), {
        filename: 'note.txt',
        contentType: 'text/plain',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  await expect(
    validate(req.body, {
      file1: new FileValidator().mimeTypes('text/plain').fallbackToMimetype(),
    }),
  ).resolves.toMatchObject({
    file1: { mimetype: 'text/plain' },
  });
  res.flush();
});

test('文件签名与允许列表不符时拒绝，fallback 也不能改写签名', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', png, {
        filename: 'a.jpg',
        contentType: 'image/jpeg',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  await expect(
    validate(req.body, { file1: new FileValidator().mimeTypes('image/jpeg') }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1的文件类型不受支持]`);
  await expect(
    validate(req.body, {
      file1: new FileValidator().mimeTypes('image/jpeg').fallbackToMimetype(),
    }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1的文件类型不受支持]`);
  res.flush();
});

test('image/* 按文件签名放行 PNG', async () => {
  const { req, res } = await mockServer(
    (agent) =>
      agent.post('/').attach('file1', png, {
        filename: 'a.bin',
        contentType: 'application/octet-stream',
      }),
    undefined,
    [ensureFiles('file1')],
  );
  await expect(
    validate(req.body, { file1: new FileValidator().mimeTypes('image/*') }),
  ).resolves.toMatchObject({
    file1: { mimetype: 'image/png' },
  });
  res.flush();
});

test('fallbackToMimetype 的声明类型不在允许列表时仍拒绝', async () => {
  const { req, res } = await mockServer(
    (agent) => agent.post('/').attach('file1', join(dir, 'fixture/upload-1.html')),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator().mimeTypes('text/plain').fallbackToMimetype();
  await expect(
    validate(req.body, { file1: validator }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1的文件类型不受支持]`);
  res.flush();
});

test('fallbackToMimetype 再调用 mimeTypes 仍保留开关', () => {
  const validator = new FileValidator().fallbackToMimetype().mimeTypes('.html');
  expect(validator['config'].fallbackToMimetype).toBe(true);
  expect(validator['config'].mimeTypes).toEqual(['text/html']);
});

test('fallbackToMimetype(false) 关闭后无文件签名仍拒绝', async () => {
  const { req, res } = await mockServer(
    (agent) => agent.post('/').attach('file1', join(dir, 'fixture/upload-1.html')),
    undefined,
    [ensureFiles('file1')],
  );
  const validator = new FileValidator()
    .mimeTypes('.html')
    .fallbackToMimetype()
    .fallbackToMimetype(false);
  await expect(
    validate(req.body, { file1: validator }),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`[Error: file1的文件类型不受支持]`);
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

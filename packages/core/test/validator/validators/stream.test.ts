import { expect, test } from 'vitest';
import { StreamValidator, magistrate } from '../../../src';
import { createReadStream } from 'node:fs';

test('检测缓冲类型', async () => {
  const validator = new StreamValidator();
  const stream = createReadStream(import.meta.filename);
  await expect(validator['validate'](stream)).resolves.toStrictEqual(
    magistrate.ok(stream),
  );
});

test('非缓冲类型', async () => {
  const validator = new StreamValidator();
  await expect(validator['validate'](Buffer.from([]))).resolves.toMatchInlineSnapshot(`
    {
      "errors": [
        "：必须是stream类型",
      ],
    }
  `);
});

test('获取文档', () => {
  expect(new StreamValidator()['toDocument']()).toMatchInlineSnapshot(`
    {
      "format": "binary",
      "type": "string",
    }
  `);
});

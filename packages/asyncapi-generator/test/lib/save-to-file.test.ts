import { join } from 'node:path';
import { readFile, rm } from 'node:fs/promises';
import { afterEach, expect, test } from 'vitest';
import { initializeDocument, saveToFile } from '../../src';

const jsonPath = join(import.meta.dirname, 'out.asyncapi.json');
const yamlPath = join(import.meta.dirname, 'out.asyncapi.yaml');

afterEach(async () => {
  await rm(jsonPath, { force: true });
  await rm(yamlPath, { force: true });
});

test('保存 json / yaml', async () => {
  const document = await initializeDocument({
    asyncapi: '3.1.0',
    info: { title: 't', version: '1.0.0' },
  });
  const json = await saveToFile(document, jsonPath);
  expect(json.dest).toBe(jsonPath);
  expect(JSON.parse(await readFile(jsonPath, 'utf8')).info.title).toBe('t');

  const yaml = await saveToFile(document, yamlPath);
  expect(yaml.dest).toBe(yamlPath);
  expect(await readFile(yamlPath, 'utf8')).toContain('title: t');
});

import { getDMMF, getSchemaWithPath } from '@prisma/internals';
import { transform } from '../src/lib/transform';
import { expect, test } from 'vitest';
import path from 'path';
import { generateJS } from './helpers/generate-js';
import { generateDTS } from './helpers/generate-dts';

const fixtures = path.join(import.meta.dirname, 'fixtures');
const snapshots = path.join(import.meta.dirname, '__snapshots__');

test.each(['mysql', 'postgresql', 'mongodb', 'sqlite', 'table-name'])(
  'transform %s',
  async (provider) => {
    const schemaPath = path.join(fixtures, `${provider}.prisma`);
    const schema = await getSchemaWithPath(schemaPath);
    const dmmf = await getDMMF({ datamodel: schema.schemas });
    const content = await transform(dmmf, path.join(snapshots, `${provider}.snapshot`));

    await expect(content).toMatchFileSnapshot(
      path.join(snapshots, `${provider}.snapshot.ts`),
    );
    await expect(generateJS(content)).resolves.toMatchFileSnapshot(
      path.join(snapshots, `${provider}.snapshot.js`),
    );
    await expect(generateDTS(content)).resolves.toMatchFileSnapshot(
      path.join(snapshots, `${provider}.snapshot.d.ts`),
    );
  },
  300_000,
);

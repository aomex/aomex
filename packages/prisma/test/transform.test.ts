import { getDMMF, getSchemaWithPath } from '@prisma/internals';
import prettier from 'prettier';
import { transform } from '../src/lib/transform';
import { expect, test } from 'vitest';
import path from 'path';

const fixtures = path.join(import.meta.dirname, 'fixtures');

test.each(['mysql', 'postgresql', 'mongodb', 'sqlite', 'table-name'])(
  'transform %s',
  async (provider) => {
    const schemaPath = path.join(fixtures, `${provider}.prisma`);
    const schema = await getSchemaWithPath(schemaPath);
    const dmmf = await getDMMF({ datamodel: schema.schemas });
    const [js, dts] = transform(dmmf);
    await expect(prettier.format(js, { parser: 'babel' })).resolves.toMatchSnapshot(
      `.js`,
    );
    await expect(prettier.format(dts, { parser: 'typescript' })).resolves.toMatchSnapshot(
      `.d.ts`,
    );
  },
  300_000,
);

import { getDMMF, getGenerators } from '@prisma/internals';
import prettier from 'prettier';
import { transform } from '../src/lib/transform';
import { expect, test } from 'vitest';
import path from 'path';

const fixtures = path.join(import.meta.dirname, 'fixtures');

test.each(['mysql', 'postgresql', 'mongodb', 'sqlite', 'table-name'])(
  'transform',
  async (provider) => {
    {
      const generators = await getGenerators({
        schemaPath: path.join(fixtures, `${provider}.prisma`),
      });
      await generators.shift()!.generate();
    }
    {
      const dmmf = await getDMMF({
        datamodelPath: path.join(fixtures, `${provider}.prisma`),
      });
      const [js, dts] = transform(dmmf);
      await expect(prettier.format(js, { parser: 'babel' })).resolves.toMatchSnapshot(
        `${provider}.js`,
      );
      await expect(
        prettier.format(dts, { parser: 'typescript' }),
      ).resolves.toMatchSnapshot(`${provider}.d.ts`);
    }
  },
  100000,
);

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
    // @prisma/internals ≥7.10：入参改为 { schemaPath: SchemaPathInput }
    const schema = await getSchemaWithPath({
      schemaPath: { cliProvidedPath: schemaPath },
    });
    const dmmf = await getDMMF({ datamodel: schema.schemas });
    const tsContent = await transform(dmmf);

    await expect(tsContent).toMatchFileSnapshot(
      path.join(snapshots, `${provider}.snapshot.ts`),
    );
    await expect(generateJS(tsContent)).resolves.toMatchFileSnapshot(
      path.join(snapshots, `${provider}.snapshot.js`),
    );
    const dts = await generateDTS(tsContent);
    await expect(dts).toMatchFileSnapshot(
      path.join(snapshots, `${provider}.snapshot.d.ts`),
    );

    expect(dts).toMatch(/export declare const generated:/);
    expect(dts).not.toMatch(/export declare const prismaInput/);
    expect(dts).not.toMatch(/export declare const prismaOutput/);
    expect(dts).not.toMatch(/export declare const prismaEnum/);
    expect(dts).not.toMatch(/export declare const \w+InputSchema/);
    expect(dts).not.toMatch(/export declare const \w+OutputSchema/);
    expect(dts).not.toMatch(/export declare const \w+Enum/);

    expect(tsContent).toContain('src/schemas/prisma.schema.ts');
    expect(tsContent).toContain('as unknown as PrismaGeneratedSchemas<');
    expect(tsContent).toContain('prismaEnum');
    expect(tsContent).not.toContain('asPrismaGenerated');

    if (provider !== 'table-name') {
      // 两行 /// 注释进入 documentation 后须仍是完整 JSDoc，并带换行
      expect(tsContent).toMatch(
        /\.docs\(\{\s*description:\s*['"]I am the comments\\nline two of comments['"]\s*\}\)/,
      );
      expect(tsContent).toMatch(
        /\*\s*I am the comments\n\s*\*\s*line two of comments\n\s*\*\//,
      );
    }
  },
  300_000,
);

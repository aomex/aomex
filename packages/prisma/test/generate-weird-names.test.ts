import type { DMMF } from '@prisma/generator-helper';
import { expect, test } from 'vitest';
import { generateEnums } from '../src/lib/generate-enums';
import { generateModels } from '../src/lib/generate-models';

const scalarField = (name: string): DMMF.Field =>
  ({
    name,
    kind: 'scalar',
    isList: false,
    isRequired: true,
    isUnique: false,
    isId: name === 'id',
    isReadOnly: false,
    hasDefaultValue: false,
    type: 'String',
    isGenerated: false,
    isUpdatedAt: false,
  }) as DMMF.Field;

test('奇怪 model 名在 map 中按原始名报价', () => {
  const content = generateModels([
    {
      name: 'foo-bar',
      dbName: null,
      fields: [scalarField('id')],
      uniqueFields: [],
      uniqueIndexes: [],
      isGenerated: false,
      primaryKey: null,
    } as unknown as DMMF.Model,
  ]);

  expect(content).toContain('"foo-bar": foo_barInputSchema');
  expect(content).toContain('"foo-bar": foo_barOutputSchema');
  expect(content).toContain('.asName("foo-barInput")');
  expect(content).toContain('.asName("foo-barOutput")');
});

test('奇怪 enum 名在 prismaEnum 中按原始名报价', () => {
  const content = generateEnums([
    {
      name: 'foo-bar',
      values: [
        { name: 'A', dbName: null },
        { name: 'B', dbName: null },
      ],
      dbName: null,
    },
  ]);

  expect(content.join('\n')).toContain('"foo-bar": foo_barEnum');
});

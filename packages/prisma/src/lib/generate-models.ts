import type { DMMF } from '@prisma/generator-helper';
import { parseFields } from './parse-fields';
import { toIdent } from './to-ident';
import { toObjectKey } from './to-object-key';

export const generateModels = (origin: readonly DMMF.Model[]) => {
  const getters = origin.map((model) => {
    const ident = toIdent(model.name);
    const modelKey = toObjectKey(model.name);
    const inputFields = parseFields(model.fields, true);
    const outputFields = parseFields(model.fields, false);
    const inputColumnsName = `${ident}InputColumns`;
    const outputColumnsName = `${ident}OutputColumns`;
    const inputSchemaName = `${ident}InputSchema`;
    const outputSchemaName = `${ident}OutputSchema`;

    const columns = `
    const ${inputColumnsName} = {
      ${inputFields.join('\n')}
    };
    const ${inputSchemaName}: ValidatorSchema<typeof ${inputColumnsName}> = schema(${inputColumnsName}).asName(${JSON.stringify(`${model.name}Input`)});

    const ${outputColumnsName} = {
      ${outputFields.join('\n')}
    };
    const ${outputSchemaName}: ValidatorSchema<typeof ${outputColumnsName}> = schema(${outputColumnsName}).asName(${JSON.stringify(`${model.name}Output`)});
    `;

    return {
      columns,
      inputGetter: `${modelKey}: ${inputSchemaName},`,
      outputGetter: `${modelKey}: ${outputSchemaName},`,
    };
  });

  return `
  ${getters.map(({ columns }) => columns).join('\n')}

  const prismaInput = {
    ${getters.map(({ inputGetter }) => inputGetter).join('\n')}
  };

  const prismaOutput = {
    ${getters.map(({ outputGetter }) => outputGetter).join('\n')}
  };

  export const generated = {
    prismaInput,
    prismaOutput,
    prismaEnum,
  } as unknown as PrismaGeneratedSchemas<
    typeof prismaInput,
    typeof prismaOutput,
    typeof prismaEnum
  >;
  `;
};

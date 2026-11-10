import type { DMMF } from '@prisma/generator-helper';
import { parseFields } from './parse-fields';
import { toIdent } from './to-ident';

export const generateTypes = (types: readonly DMMF.Model[]) => {
  return types
    .map(({ name, fields }) => {
      const ident = toIdent(name);
      const inputTypeName = ident + 'InputType';
      const outputTypeName = ident + 'OutputType';
      const inputModelFields = parseFields(fields, true);
      const outputModelFields = parseFields(fields, false);
      return [
        {
          key: inputTypeName,
          value: `const _${inputTypeName} = {
          ${inputModelFields.join('\n')}
        };
        const ${inputTypeName}: ValidatorSchema<typeof _${inputTypeName}> = schema(_${inputTypeName}).asName(${JSON.stringify(`${name}Input`)});`,
        },
        {
          key: outputTypeName,
          value: `const _${outputTypeName} = {
          ${outputModelFields.join('\n')}
        };
        const ${outputTypeName}: ValidatorSchema<typeof _${outputTypeName}> = schema(_${outputTypeName}).asName(${JSON.stringify(`${name}Output`)});`,
        },
      ];
    })
    .flat()
    .sort((a, b) => {
      return a.value.includes(`${b.key}.object()`) ? 1 : -1;
    })
    .map(({ value }) => value);
};

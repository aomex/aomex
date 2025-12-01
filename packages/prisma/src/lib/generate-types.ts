import type { DMMF } from '@prisma/generator-helper';
import { parseFields } from './parse-fields';
import { pascalCase } from './pascal-case';

export const generateTypes = (types: readonly DMMF.Model[]) => {
  return types
    .map(({ name, fields }) => {
      const typeName = pascalCase(name) + 'Type';
      const inputTypeName = pascalCase(name) + 'InputType';
      const outputTypeName = pascalCase(name) + 'OutputType';
      const inputModelFields = parseFields(fields, typeName, true);
      const outputModelFields = parseFields(fields, typeName, false);
      return [
        {
          key: inputTypeName,
          value: `export const ${inputTypeName} = {
          ${inputModelFields.join('\n')}
        };`,
        },
        {
          key: outputTypeName,
          value: `export const ${outputTypeName} = {
          ${outputModelFields.join('\n')}
        };`,
        },
      ];
    })
    .flat()
    .sort((a, b) => {
      return a.value.includes(`: ${b.key},`) ? 1 : -1;
    })
    .map(({ value }) => value);
};

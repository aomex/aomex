import type { DMMF } from '@prisma/generator-helper';
import { parseFields } from './parse-fields';
import { pascalCase } from './pascal-case';

export const generateTypes = (types: readonly DMMF.Model[]) => {
  return types
    .map(({ name, fields }) => {
      const typeName = pascalCase(name) + 'Type';
      const modelFields = parseFields(fields, typeName, true);
      return {
        key: typeName,
        value: `const ${typeName} = {
          ${modelFields.join('\n')}
        };`,
      };
    })
    .sort((a, b) => {
      return a.value.includes(`: ${b.key},`) ? 1 : -1;
    })
    .map(({ value }) => value);
};

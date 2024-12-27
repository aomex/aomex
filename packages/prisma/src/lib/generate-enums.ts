import type { DMMF } from '@prisma/generator-helper';
import { pascalCase } from './pascal-case';

export const generateEnums = (enums: readonly DMMF.DatamodelEnum[]) => {
  return enums.map(({ name, values }) => {
    const names = values.map((item) => item.name);
    return `const ${pascalCase(name)}Enum = <const>${JSON.stringify(names)}`;
  });
};

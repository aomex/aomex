import type { DMMF } from '@prisma/generator-helper';
import { toIdent } from './to-ident';
import { toObjectKey } from './to-object-key';

export const generateEnums = (enums: readonly DMMF.DatamodelEnum[]) => {
  const declarations = enums.map(({ name, values }) => {
    const names = values.map((item) => item.name);
    return `const ${toIdent(name)}Enum = <const>${JSON.stringify(names)}`;
  });

  const entries = enums.map(({ name }) => {
    const key = toObjectKey(name);
    const constName = `${toIdent(name)}Enum`;
    return `${key}: ${constName},`;
  });

  return [
    ...declarations,
    `const prismaEnum = {
      ${entries.join('\n')}
    };`,
  ];
};

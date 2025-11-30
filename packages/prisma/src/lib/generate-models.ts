import type { DMMF } from '@prisma/generator-helper';
import { parseFields } from './parse-fields';
import camelCase from 'lodash.camelcase';

export const generateModels = (origin: readonly DMMF.Model[]) => {
  const getters = origin.map((model) => {
    const className = camelCase(model.name);
    const inputFields = parseFields(model.fields, className, true);
    const outputFields = parseFields(model.fields, className, false);
    const fieldNames = model.fields
      .filter((field) => field.kind !== 'object')
      .map((field) => `"${field.name}"`)
      .join('|');

    const columns = `
    const ${className}InputColumns = {
      ${inputFields.join('\n')}
    };

    const ${className}OutputColumns = {
      ${outputFields.join('\n')}
    };
    `;

    const inputGetter = `
    ${className}: {
      /** 所有字段对象 */
      columns: ${className}InputColumns,
      /** 选择部分字段 */
      pick: <Keys extends ${fieldNames}>(...keys: Keys[]): { [K in Keys]: (typeof ${className}InputColumns)[K] } => {
        // @ts-ignore
        return pick(${className}InputColumns, ...keys);
      },
      /** 去除部分字段 */
      omit: <Keys extends ${fieldNames}>(...keys: Keys[]): { [K in (keyof typeof ${className}InputColumns) as K extends Keys ? never : K]: (typeof ${className}InputColumns)[K] } => {
        // @ts-ignore
        return omit(${className}InputColumns, ...keys);
      },
    },
    `;

    const outputGetter = `
    ${className}: {
      /** 所有字段对象 */
      columns: ${className}OutputColumns,
      /** 选择部分字段 */
      pick: <Keys extends ${fieldNames}>(...keys: Keys[]): { [K in Keys]: (typeof ${className}OutputColumns)[K] } => {
        // @ts-ignore
        return pick(${className}OutputColumns, ...keys);
      },
      /** 去除部分字段 */
      omit: <Keys extends ${fieldNames}>(...keys: Keys[]): { [K in (keyof typeof ${className}OutputColumns) as K extends Keys ? never : K]: (typeof ${className}OutputColumns)[K] } => {
        // @ts-ignore
        return omit(${className}OutputColumns, ...keys);
      },
    },
    `;

    return { columns, inputGetter, outputGetter };
  });

  return `
  ${getters.map(({ columns }) => columns).join('\n')}

  export const prismaInput = <const>{
    ${getters.map(({ inputGetter }) => inputGetter).join('\n')}
  };

  export const prismaOutput = <const>{
    ${getters.map(({ outputGetter }) => outputGetter).join('\n')}
  };
  `;
};

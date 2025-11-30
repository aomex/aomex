import type { DMMF } from '@prisma/generator-helper';
import camelCase from 'lodash.camelcase';
import { pascalCase } from './pascal-case';

export const generateSchemaMap = (
  models: { model: DMMF.Model; type: 'model' | 'type' }[],
) => {
  return `
  export type PrismaSchemaMap = {
    ${models
      .map(({ model, type }) => {
        return `${type === 'model' ? camelCase(model.name) : pascalCase(model.name) + 'Type'}: [
            ${model.fields.map((field) => `"${field.name}"`).join(', ')}
          ],`;
      })
      .join('\n')}
  }
  `;
};

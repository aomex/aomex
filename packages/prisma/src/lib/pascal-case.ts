import camelCase from 'lodash.camelcase';
import upperFirst from 'lodash.upperfirst';

export const pascalCase = (tableName: string) => {
  return upperFirst(camelCase(tableName));
};

import type { DMMF } from '@prisma/generator-helper';

export const generateComments = (field: DMMF.Field, runtimeValidator: string) => {
  const { type, documentation, isList, isRequired } = field;
  const arrayModifier = isList ? '[]' : '';
  const requireModifier = isRequired ? '' : '?';
  const defaultValue = field.hasDefaultValue
    ? `\`${getDefaultValue(field.default)}\``
    : '';
  const support = runtimeValidator.includes(`any()`) ? '[暂未支持]' : '';

  return `
/**
 * Prisma类型：\`${type}${arrayModifier}${requireModifier}\` ${support}
 * 
 * 数据库默认值：${defaultValue} ${
   documentation
     ? `
 *
 * ${documentation}`
     : ''
 }
 */`;
};

const getDefaultValue = (value: DMMF.Field['default']) => {
  if (typeof value !== 'object') {
    return JSON.stringify(value);
  }

  if (isArray(value)) {
    return JSON.stringify(value);
  }

  // prisma@5 中存在uuid(4)这种名称
  if (value.name.includes('(')) return value.name;

  return `${value.name}(${value.args.join(', ')})`;
};

const isArray = (value: any): value is any[] | readonly any[] => Array.isArray(value);

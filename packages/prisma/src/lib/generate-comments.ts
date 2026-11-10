import type { DMMF } from '@prisma/generator-helper';

/** 防止内容里的星号斜杠序列提前结束块注释 */
const escapeJsdoc = (text: string) => text.replaceAll('*/', '*\\/');

export const generateComments = (field: DMMF.Field, runtimeValidator: string) => {
  const { type, documentation, isList, isRequired } = field;
  const arrayModifier = isList ? '[]' : '';
  const requireModifier = isRequired ? '' : '?';
  const defaultValue = field.hasDefaultValue
    ? `\`${escapeJsdoc(getDefaultValue(field.default))}\``
    : '';
  const support = runtimeValidator.includes(`any()`) ? '[暂未支持]' : '';

  const safeDocs = documentation
    ? escapeJsdoc(documentation)
        // 保持每行仍在 JSDoc 前缀下
        .split(/\r?\n/)
        .map((line) => ` * ${line}`)
        .join('\n')
    : '';

  return `
/**
 * Prisma类型：\`${type}${arrayModifier}${requireModifier}\` ${support}
 * 
 * 数据库默认值：${defaultValue}${
   safeDocs
     ? `
 *
${safeDocs}`
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

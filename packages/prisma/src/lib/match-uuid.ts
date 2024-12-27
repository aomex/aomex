import type { DMMF } from '@prisma/generator-helper';

const isArray = (value: any): value is any[] | readonly any[] => Array.isArray(value);

export const matchUUID = (field: DMMF.Field): boolean | string => {
  const defaultValue = field.default;
  if (typeof defaultValue !== 'object') return false;
  if (isArray(defaultValue)) return false;
  if (defaultValue.name === 'uuid') {
    const version = defaultValue.args[0]?.toString();
    return version ? 'v' + version : true;
  }
  if (defaultValue.name === 'dbgenerated') {
    const firstArg = defaultValue.args[0];
    if (typeof firstArg === 'string') {
      const matched = (firstArg as string).match(/uuid_generate_(v[1-5])\(\)/);
      if (matched) return matched[1]!;
    }
  }
  return false;
};

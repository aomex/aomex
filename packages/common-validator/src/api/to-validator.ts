import { Validator } from '../base';
import { ValidatorSchema } from '../base/validator-schema';
import { ObjectValidator } from '../validators';

/**
 * 可递归嵌套的字段表；裸对象会在 `toValidator` / `schema` 入库时转为 `rule.object(...)`
 */
export type ValidatorFieldTable = {
  [key: string]: ValidatorToken;
};

export type ValidatorToken = Validator | ValidatorSchema<any> | ValidatorFieldTable;

/**
 * 将字段表中的嵌套裸对象 / schema 规范化为 Validator，供 `schema` 入库使用
 */
export type NormalizeFieldTable<T> = {
  [K in keyof T]: T[K] extends Validator
    ? T[K]
    : T[K] extends ValidatorSchema<any>
      ? ObjectValidator<Validator.Infer<T[K]>>
      : T[K] extends object
        ? ObjectValidator<Validator.Infer<T[K]>>
        : never;
};

export function toValidator(validator: ValidatorToken): Validator;
export function toValidator(validator: undefined): undefined;
export function toValidator(validator: ValidatorToken | undefined): Validator | undefined;
export function toValidator(
  validator: ValidatorToken | undefined,
): Validator | undefined {
  if (!validator) return;
  if (validator instanceof Validator) return validator;
  if (validator instanceof ValidatorSchema) {
    const objectValidator = new ObjectValidator(validator['rules']);
    if (validator['name'] !== undefined) {
      objectValidator['config'].refName = validator['name'];
    }
    return objectValidator;
  }
  return new ObjectValidator(normalizeFieldTable(validator));
}

/**
 * 逐字段转为 Validator；嵌套裸对象 / schema 经 `toValidator` 转为 `ObjectValidator`
 */
export function normalizeFieldTable(
  fields: Record<string, ValidatorToken>,
): Record<string, Validator> {
  const result: Record<string, Validator> = {};
  for (const key of Object.keys(fields)) {
    result[key] = toValidator(fields[key]!);
  }
  return result;
}

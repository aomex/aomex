import { ValidatorSchema } from '../base/validator-schema';
import {
  normalizeFieldTable,
  type NormalizeFieldTable,
  type ValidatorToken,
} from './to-validator';

export { ValidatorSchema };

/**
 * 创建可派生的字段集合，可直接或经 pick/omit/extend/partial/required 后用于校验
 *
 * 嵌套裸对象会在入库前转为 `rule.object(...)`：
 * ```typescript
 * schema({
 *   profile: { bio: rule.string() }, // 等价于 rule.object({ bio: rule.string() })
 * });
 * ```
 *
 * ```typescript
 * const userSchema = schema({
 *   id: rule.int(),
 *   name: rule.string(),
 *   email: rule.email(),
 * });
 *
 * const createUserSchema = userSchema.omit('id');
 * const patchUserSchema = userSchema.pick('name', 'email').partial();
 * const requiredSchema = patchUserSchema.required();
 * type User = Validator.Infer<typeof userSchema>;
 * ```
 */
export const schema = <T extends { [K in keyof T]: ValidatorToken }>(
  rules: T,
): ValidatorSchema<NormalizeFieldTable<T>> => {
  return new ValidatorSchema(normalizeFieldTable(rules) as NormalizeFieldTable<T>);
};

import { Validator } from '../base';
import { ValidatorSchema } from '../base/validator-schema';

export { ValidatorSchema };

/**
 * 创建可派生的字段集合，可直接或经 pick/omit/extend/merge 后用于校验
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
 * type User = Validator.Infer<typeof userSchema>;
 * ```
 */
export const schema = <T extends Record<string, Validator<any>>>(rules: T) => {
  return new ValidatorSchema(rules);
};

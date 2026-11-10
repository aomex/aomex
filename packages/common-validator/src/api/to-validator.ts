import { Validator } from '../base';
import { ValidatorSchema } from '../base/validator-schema';
import { ObjectValidator } from '../validators';

export type ValidatorToken =
  | Validator
  | ValidatorSchema<any>
  | { [key: string]: Validator };

export function toValidator(validator: ValidatorToken): Validator;
export function toValidator(validator: undefined): undefined;
export function toValidator(validator: ValidatorToken | undefined): Validator | undefined;
export function toValidator(
  validator: ValidatorToken | undefined,
): Validator | undefined {
  if (!validator) return;
  if (validator instanceof Validator) return validator;
  if (validator instanceof ValidatorSchema) return validator.object();
  return new ObjectValidator(validator);
}

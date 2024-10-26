import { Validator } from '../base';
import { ObjectValidator } from '../validators';

export type ValidatorToken = Validator | { [key: string]: Validator };

export function toValidator(validator: ValidatorToken): Validator;
export function toValidator(validator: undefined): undefined;
export function toValidator(validator: ValidatorToken | undefined): Validator | undefined;
export function toValidator(
  validator: ValidatorToken | undefined,
): Validator | undefined {
  if (!validator) return;
  if (validator instanceof Validator) return validator;
  return new ObjectValidator(validator);
}

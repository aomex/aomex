import { expect } from 'vitest';
import { ValidateResultError, Validator } from '../../src';

export const testFail = async (
  validator: Validator,
  data: any[],
  errors: ValidateResultError['errors'] | string,
) => {
  for (const item of data) {
    await expect(Validator.validate(validator, item)).resolves.toMatchObject(<
      ValidateResultError
    >{
      errors:
        typeof errors === 'string' ? [{ path: [], message: errors }] : errors,
    });
  }
};

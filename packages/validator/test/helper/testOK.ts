import { expect } from 'vitest';
import { ValidateResultOK, Validator } from '../../src';

export const testOK = async (
  validator: Validator,
  data: any[],
  callback?: (data: any) => any,
) => {
  for (const item of data) {
    await expect(Validator.validate(validator, item)).resolves.toMatchObject(<
      ValidateResultOK<any>
    >{
      ok: callback ? callback(item) : item,
    });
  }
};

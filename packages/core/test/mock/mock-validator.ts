import { Validator, ValidateResult } from '../../src/validator/base';

export class MockValidator extends Validator {
  protected override validateValue(
    value: any,
  ): ValidateResult.Any<any> | Promise<ValidateResult.Any<any>> {
    return ValidateResult.accept(value);
  }
}

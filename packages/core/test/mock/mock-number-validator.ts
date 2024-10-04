import { BaseNumberValidator, ValidateResult } from '../../src';

export class MockNumberValidator extends BaseNumberValidator {
  protected override validateNumber(num: number): ValidateResult.Any<number> {
    return ValidateResult.accept(num);
  }
}

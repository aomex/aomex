import { BaseStringValidator, ValidateResult } from '../../src';

export class MockStringValidator extends BaseStringValidator {
  protected override validateString(
    value: string,
  ): ValidateResult.Any<any> | Promise<ValidateResult.Any<any>> {
    return ValidateResult.accept(value);
  }
}

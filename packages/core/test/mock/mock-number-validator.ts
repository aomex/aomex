import { BaseNumberValidator, magistrate } from '../../src';

export class MockNumberValidator extends BaseNumberValidator {
  protected override validateNumber(num: number): magistrate.Result<number> {
    return magistrate.ok(num);
  }
}

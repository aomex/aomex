import { Validator, magistrate } from '../../src/validator/base';

export class MockValidator extends Validator {
  protected override validateValue(
    value: any,
  ): magistrate.Result<any> | Promise<magistrate.Result<any>> {
    return magistrate.ok(value);
  }
}

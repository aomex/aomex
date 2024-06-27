import { BaseStringValidator, magistrate } from '../../src';

export class MockStringValidator extends BaseStringValidator {
  protected override validateString(
    value: string,
  ): magistrate.Result<any> | Promise<magistrate.Result<any>> {
    return magistrate.ok(value);
  }
}

import {
  magistrate,
  TransformedValidator,
  ValidateResult,
  Validator,
} from '../base';

export class AnyValidator<T = any> extends Validator<T> {
  public declare transform: <T1>(
    fn: Validator.TransformFn<T, T1>,
  ) => TransformedValidator<T1>;

  protected override isEmpty(): boolean {
    return false;
  }

  protected validateValue(value: any): ValidateResult<any> {
    return magistrate.ok(value);
  }
}

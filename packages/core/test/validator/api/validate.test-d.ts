import { expectType } from 'ts-expect';
import { ValidateResult, rule, validate } from '../../../src';

// 传参
{
  validate({}, {});
  validate(
    {},
    {
      test: rule.string(),
    },
  );
  validate({}, rule.number());
  validate(
    {},
    {},
    {
      errorFormatter(errors) {
        expectType<ValidateResult.Denied['errors']>(errors);
        return '';
      },
    },
  );
}

// 泛型
{
  const result1 = await validate(
    {},
    {
      test: rule.string().optional(),
    },
  );
  expectType<{ test?: string | undefined }>(result1);
  // @ts-expect-error
  expectType<{ test: string | undefined }>(result1);
  // @ts-expect-error
  expectType<{ test: string }>(result1);

  const result2 = await validate({}, rule.number());
  expectType<number>(result2);
  // @ts-expect-error
  expectType<string>(result2);
}

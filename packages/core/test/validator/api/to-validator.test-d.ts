import { type TypeEqual, expectType } from 'ts-expect';
import { Validator, toValidator, type ValidatorToken } from '../../../src';
import { MockValidator } from '../../mock/mock-validator';

// undefined
{
  const result = toValidator(undefined);
  expectType<TypeEqual<undefined, typeof result>>(true);

  // @ts-expect-error
  const token: ValidatorToken | undefined;
  toValidator(token);
}

// 验证器
{
  const result = toValidator(new MockValidator());
  expectType<TypeEqual<Validator, typeof result>>(true);
}

// 对象
{
  const result = toValidator({ key: new MockValidator() });
  expectType<TypeEqual<Validator, typeof result>>(true);
}

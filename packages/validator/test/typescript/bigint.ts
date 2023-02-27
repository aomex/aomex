import { expectType } from 'ts-expect';
import { BigIntValidator, rule, Validator } from '../../../core/src';

const validator = rule.bigint();

expectType<BigIntValidator<bigint>>(validator);

expectType<BigIntValidator<bigint | Validator.TOptional>>(validator.optional());

expectType<BigIntValidator<bigint | Validator.TDefault>>(
  validator.default(123n),
);

expectType<BigIntValidator<bigint | Validator.TDefault | Validator.TOptional>>(
  validator.default(123n).optional(),
);

validator.transform((data) => expectType<bigint>(data));

validator.optional().transform((data) => expectType<bigint | undefined>(data));

validator
  .optional()
  .default(123n)
  .transform((data) => expectType<bigint>(data));

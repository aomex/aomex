import { expectType } from 'ts-expect';
import { BooleanValidator, rule, Validator } from '../../../core/src';

const validator = rule.boolean();

expectType<BooleanValidator<boolean>>(validator);

expectType<BooleanValidator<boolean | Validator.TOptional>>(
  validator.optional(),
);

expectType<BooleanValidator<boolean | Validator.TDefault>>(
  validator.default(false),
);

expectType<
  BooleanValidator<boolean | Validator.TDefault | Validator.TOptional>
>(validator.default(false).optional());

validator.transform((data) => expectType<boolean>(data));

validator.optional().transform((data) => expectType<boolean | undefined>(data));

validator
  .optional()
  .default(true)
  .transform((data) => expectType<boolean>(data));

validator.trueValues([1, '2', {}]);

validator.falseValues([1, '2', Symbol('')]);

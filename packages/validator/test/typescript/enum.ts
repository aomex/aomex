import { expectType } from 'ts-expect';
import { EnumValidator, rule, Validator } from '../../../core/src';

const validator = rule.enum(['x', 1]);

expectType<EnumValidator<'x' | 1>>(validator);

expectType<EnumValidator<'x' | 1 | Validator.TOptional>>(validator.optional());

expectType<EnumValidator<'x' | 1 | Validator.TDefault>>(validator.default('x'));

expectType<EnumValidator<'x' | 1 | Validator.TDefault | Validator.TOptional>>(
  validator.default(1).optional(),
);

validator.transform((data) => expectType<'x' | 1>(data));

validator.optional().transform((data) => expectType<'x' | 1 | undefined>(data));

validator
  .optional()
  .default('x')
  .transform((data) => expectType<'x' | 1>(data));

validator.default('x');
validator.default(1);
// @ts-expect-error
validator.default(2);
// @ts-expect-error
validator.default('xx');

rule.enum([1, 2, 'x-y- z', true, false]);
// @ts-expect-error
rule.enum();
// @ts-expect-error
rule.enum(1);
// @ts-expect-error
rule.enum([]);
// @ts-expect-error
rule.enum([function () {}]);
// @ts-expect-error
rule.enum([[]]);
// @ts-expect-error
rule.enum([Symbol('')]);

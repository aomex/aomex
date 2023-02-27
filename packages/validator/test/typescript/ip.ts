import { expectType } from 'ts-expect';
import { IpValidator, rule, Validator } from '../../../core/src';

const validator = rule.ip('v4');

expectType<IpValidator<string>>(validator);

expectType<IpValidator<string | Validator.TOptional>>(validator.optional());

expectType<IpValidator<string | Validator.TDefault>>(
  validator.default('1.1.1.1'),
);

expectType<IpValidator<string | Validator.TDefault | Validator.TOptional>>(
  validator.default('1.1.1.1').optional(),
);

validator.transform((data) => expectType<string>(data));

validator.optional().transform((data) => expectType<string | undefined>(data));

validator
  .optional()
  .default('1.1.1.1')
  .transform((data) => expectType<string>(data));

validator.trim();
validator.match(/^$/);

rule.ip('v4');
rule.ip('v6');
rule.ip(['v4']);
rule.ip(['v4', 'v6']);
// @ts-expect-error
rule.ip('v5');
// @ts-expect-error
rule.ip(4);
// @ts-expect-error
rule.ip([]);
// @ts-expect-error
rule.ip();
// @ts-expect-error
rule.ip(['v5']);

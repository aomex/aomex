import { expectType } from 'ts-expect';
import { HashValidator, rule, Validator } from '../../../core/src';

const validator = rule.hash('md5');

expectType<HashValidator<string>>(validator);

expectType<HashValidator<string | Validator.TOptional>>(validator.optional());

expectType<HashValidator<string | Validator.TDefault>>(
  validator.default('abcd'),
);

expectType<HashValidator<string | Validator.TDefault | Validator.TOptional>>(
  validator.default('abcd').optional(),
);

validator.transform((data) => expectType<string>(data));

validator.optional().transform((data) => expectType<string | undefined>(data));

validator
  .optional()
  .default('abcd')
  .transform((data) => expectType<string>(data));

rule.hash('crc32');
rule.hash('sha1');
rule.hash('sha256');
// @ts-expect-error
rule.hash();
// @ts-expect-error
rule.hash([]);

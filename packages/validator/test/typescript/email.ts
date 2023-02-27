import { expectType } from 'ts-expect';
import { EmailValidator, rule, Validator } from '../../../core/src';

const validator = rule.email();

expectType<EmailValidator<string>>(validator);

expectType<EmailValidator<string | Validator.TOptional>>(validator.optional());

expectType<EmailValidator<string | Validator.TDefault>>(
  validator.default('e@gmail.com'),
);

expectType<EmailValidator<string | Validator.TDefault | Validator.TOptional>>(
  validator.default('e@gmail.com').optional(),
);

validator.transform((data) => expectType<string>(data));

validator.optional().transform((data) => expectType<string | undefined>(data));

validator
  .optional()
  .default('e@gmail.com')
  .transform((data) => expectType<string>(data));

validator.trim();
validator.match(/^$/);
validator
  .length(10)
  .length(10, 20)
  .length({ min: 10 })
  .length({ max: 10 })
  .length({ min: 10, max: 20 });

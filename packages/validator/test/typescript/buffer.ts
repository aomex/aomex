import { expectType } from 'ts-expect';
import { BufferValidator, rule, Validator } from '../../../core/src';

const buffer = Buffer.from([]);
const validator = rule.buffer();

expectType<BufferValidator<Buffer>>(validator);

expectType<BufferValidator<Buffer | Validator.TOptional>>(validator.optional());

expectType<BufferValidator<Buffer | Validator.TDefault>>(
  validator.default(buffer),
);

expectType<BufferValidator<Buffer | Validator.TDefault | Validator.TOptional>>(
  validator.default(buffer).optional(),
);

validator.transform((data) => expectType<Buffer>(data));

validator.optional().transform((data) => expectType<Buffer | undefined>(data));

validator
  .optional()
  .default(buffer)
  .transform((data) => expectType<Buffer>(data));

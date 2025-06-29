import { ValidateResult, Validator, ValidateDeniedError } from '../base';
import { toValidator, type ValidatorToken } from './to-validator';

/**
 * 验证传入数据，并返回可信的数据
 *
 * @param untrusted 数据源
 * @param schema 验证器
 * @param options.errorFormatter 报错文字格式化处理
 */
export const validate = async <T extends ValidatorToken>(
  untrusted: any,
  validators: T,
  options: {
    errorFormatter?: (
      errors: ValidateResult.Denied['errors'],
    ) => string | Promise<string>;
  } = {},
): Promise<Validator.Infer<T>> => {
  const { errorFormatter = defaultErrorFormatter } = options;
  const validator = toValidator(validators);
  const source = await untrusted;
  const trusted = await validator['validate'](source);

  if (ValidateResult.noError(trusted)) return trusted.data;

  const msg = await errorFormatter(trusted.errors!);
  throw new ValidateDeniedError(msg, trusted.errors);
};

const defaultErrorFormatter = (errors: ValidateResult.Denied['errors']) => {
  return errors[0];
};

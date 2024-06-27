import { i18n } from '../../i18n';
import { magistrate, Validator, ValidatorError } from '../base';
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
    errorFormatter?: (errors: magistrate.Fail['errors']) => string | Promise<string>;
  } = {},
): Promise<Validator.Infer<T>> => {
  const { errorFormatter = defaultErrorFormatter } = options;
  const validator = toValidator(validators);
  const source = await untrusted;
  const trusted = await validator['validate'](source);

  if (magistrate.noError(trusted)) return trusted.ok;

  const msg = await errorFormatter(trusted.errors!);
  throw new ValidatorError(msg, trusted.errors);
};

const defaultErrorFormatter = (errors: magistrate.Fail['errors']) => {
  let msg = i18n.t('core.validator.validation_failed');

  msg += '\n';
  errors.forEach((err) => {
    msg += `\n- ${err}`;
  });
  msg += '\n';

  return msg;
};

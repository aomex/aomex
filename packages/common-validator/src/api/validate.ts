import { ValidateResult, Validator, ValidateDeniedError } from '../base';
import { toValidator, type ValidatorToken } from './to-validator';

export type ValidateOptions = {
  /**
   * - `true`（默认）：失败时抛出 `ValidateDeniedError`
   * - `false`：失败时不抛错，返回 `{ data: null, errors }`
   */
  throwOnError?: boolean;
  /**
   * 报错文字格式化处理（仅 `throwOnError: true` 时生效）
   */
  errorFormatter?: (errors: ValidateResult.Denied['errors']) => string | Promise<string>;
};

/**
 * 验证传入数据，并返回可信的数据
 *
 * 默认失败抛错；传入 `{ throwOnError: false }` 时改为返回 Result。
 */
export async function validate<T extends ValidatorToken>(
  untrusted: any,
  validators: T,
  options?: {
    throwOnError?: true;
    errorFormatter?: ValidateOptions['errorFormatter'];
  },
): Promise<Validator.Infer<T>>;
export async function validate<T extends ValidatorToken>(
  untrusted: any,
  validators: T,
  options: {
    throwOnError: false;
  },
): Promise<ValidateResult.Safe<Validator.Infer<T>>>;
export async function validate<T extends ValidatorToken>(
  untrusted: any,
  validators: T,
  options: ValidateOptions = {},
): Promise<Validator.Infer<T> | ValidateResult.Safe<Validator.Infer<T>>> {
  const { throwOnError = true, errorFormatter } = options;
  const validator = toValidator(validators);
  const source = await untrusted;
  const trusted = await validator['validate'](source);

  if (ValidateResult.noError(trusted)) {
    if (throwOnError) return trusted.data;
    return { data: trusted.data, errors: null };
  }

  const errors = trusted.errors!;

  if (!throwOnError) {
    return { data: null, errors };
  }

  const msg = errorFormatter ? await errorFormatter(errors) : errors[0];
  throw new ValidateDeniedError(msg, errors);
}

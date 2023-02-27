import { magistrate, Validator, ValidateResult, ValidatorError } from '../base';
import { ObjectValidator } from '../validators';

export type ValidateOptions =
  | {
      throwIfError?: true;
    }
  | {
      throwIfError: false;
    };

export function validate<T extends Validator>(
  source: any,
  validator: T,
  options?: {
    throwIfError?: true;
  },
): Promise<Validator.Infer<T>>;
export function validate<T extends Validator>(
  source: any,
  validator: T,
  options?: {
    throwIfError: false;
  },
): Promise<ValidateResult<Validator.Infer<T>>>;

export function validate<T extends { [key: string]: V }, V extends Validator>(
  source: object | Promise<object>,
  validators: T,
  options?: {
    throwIfError?: true;
  },
): Promise<{ [K in keyof T]: Validator.Infer<T[K]> }>;
export function validate<T extends { [key: string]: V }, V extends Validator>(
  source: object | Promise<object>,
  validators: T,
  options?: {
    throwIfError: false;
  },
): Promise<ValidateResult<{ [K in keyof T]: Validator.Infer<T[K]> }>>;

export async function validate(
  source: object | any[] | Promise<object | any[]>,
  schema: { [key: string]: Validator } | Validator,
  options?: {
    throwIfError?: boolean;
  },
): Promise<any> {
  const { throwIfError = true } = options || {};
  const validator =
    schema instanceof Validator ? schema : new ObjectValidator(schema);
  const src = await source;
  const result = await Validator.validate(validator, src);

  if (magistrate.noError(result)) {
    return throwIfError ? result.ok : result;
  }

  if (throwIfError) {
    const errors = result.errors!;
    let msg = 'Validate failed with reasons: ';

    if (errors.length === 1 && !errors[0]!.path.length) {
      msg += errors[0]!.message;
    } else {
      msg += '\n';
      result.errors!.forEach((err) => {
        msg += `\n- [${err.path.join('.')}] ${err.message}`;
      });
      msg += '\n';
    }

    throw new ValidatorError(msg);
  }

  return result as any;
}

import type { ValidateResult } from './validate-result';

export class ValidateDeniedError extends Error {
  constructor(
    message: string | undefined,
    protected readonly errors: ValidateResult.Denied['errors'] = [],
  ) {
    super(message);
  }

  getValidateErrors() {
    return this.errors;
  }
}

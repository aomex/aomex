import type { magistrate } from './magistrate';

export class ValidatorError extends Error {
  constructor(
    message: string | undefined,
    protected readonly errors: magistrate.Fail['errors'] = [],
  ) {
    super(message);
  }

  getValidateErrors() {
    return this.errors;
  }
}

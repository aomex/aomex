export declare namespace ValidateResult {
  export type Any<T> = Accepted<T> | Denied;

  export interface Accepted<T> {
    data: T;
  }

  export interface Denied {
    errors: string[];
  }
}

export const ValidateResult = {
  accept: <T>(data: T): ValidateResult.Accepted<T> => {
    return { data };
  },
  deny: (message: string): ValidateResult.Denied => {
    return {
      errors: [message],
    };
  },
  noError: <T>(result: ValidateResult.Any<T>): result is ValidateResult.Accepted<T> => {
    return 'data' in result;
  },
};

export declare namespace ValidateResult {
  export type Any<T> = Accepted<T> | Denied;

  export interface Accepted<T> {
    data: T;
  }

  export interface Denied {
    errors: string[];
  }

  /**
   * `validate(..., { throwOnError: false })` 的返回形态。
   * 请用 `errors === null` 收窄，勿用 `data === null`（合法值也可能为 `null`）。
   */
  export type Safe<T> = { data: T; errors: null } | { data: null; errors: string[] };
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

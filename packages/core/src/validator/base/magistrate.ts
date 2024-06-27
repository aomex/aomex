export declare namespace magistrate {
  export type Result<T> = Ok<T> | Fail;

  export interface Ok<T> {
    ok: T;
  }

  export interface Fail {
    errors: string[];
  }
}

export const magistrate = {
  ok: <T>(result: T): magistrate.Ok<T> => {
    return { ok: result };
  },
  fail: (message: string): magistrate.Fail => {
    return {
      errors: [message],
    };
  },
  noError: <T>(result: magistrate.Result<T>): result is magistrate.Ok<T> => {
    return 'ok' in result;
  },
};

import { Validator } from './validator';

export declare namespace magistrate {
  export type Result<T> = Ok<T> | Fail;

  export interface Ok<T> {
    ok: T;
  }

  export interface Fail {
    errors: { path: string[]; message: string }[];
  }
}

export const magistrate = {
  ok: <T>(result: T): magistrate.Ok<T> => {
    return { ok: result };
  },
  fail: (
    message: string,
    key: string,
    superKeys: string[],
  ): magistrate.Fail => {
    return {
      errors: [
        {
          path: superKeys
            .concat(key)
            .filter((item) => item !== Validator.$rootKey),
          message,
        },
      ],
    };
  },
  noError: <T>(result: magistrate.Result<T>): result is magistrate.Ok<T> => {
    return 'ok' in result;
  },
};

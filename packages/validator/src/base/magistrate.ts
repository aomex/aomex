import { ValidateResult, ValidateResultOK, Validator } from './validator';

export const magistrate = {
  ok: <T>(result: T): ValidateResult<T> => {
    return {
      ok: result,
    };
  },
  fail: (
    message: string,
    key: string,
    superKeys: string[],
  ): ValidateResult<any> => {
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
  noError: <T>(result: ValidateResult<T>): result is ValidateResultOK<T> => {
    return 'ok' in result;
  },
};

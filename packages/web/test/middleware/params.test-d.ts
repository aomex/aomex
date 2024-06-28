import { type TypeEqual, expectType } from 'ts-expect';
import { WebMiddleware, params } from '../../src';
import { rule } from '@aomex/core';

const mdw = params({
  test: rule.string(),
  test1: rule.number().optional(),
});

expectType<
  TypeEqual<
    WebMiddleware<{
      readonly params: {
        test: string;
        test1: number | undefined;
      };
    }>,
    typeof mdw
  >
>(true);

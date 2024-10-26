import { type TypeEqual, expectType } from 'ts-expect';
import { WebMiddleware, query } from '../../src';
import { rule } from '@aomex/common';

const mdw = query({
  test: rule.string(),
  test1: rule.number().optional(),
});

expectType<
  TypeEqual<
    WebMiddleware<{ readonly query: { test: string } & { test1?: number | undefined } }>,
    typeof mdw
  >
>(true);

expectType<
  TypeEqual<
    WebMiddleware<{ readonly query: { test: string; test1: number | undefined } }>,
    typeof mdw
  >
>(false);

import { type TypeEqual, expectType } from 'ts-expect';
import { WebMiddleware, body } from '../../src';
import { rule } from '@aomex/core';

const mdw = body({
  test: rule.string(),
  test1: rule.number().optional(),
});

expectType<
  TypeEqual<
    WebMiddleware<{ readonly body: { test: string } & { test1?: number | undefined } }>,
    typeof mdw
  >
>(true);

expectType<
  TypeEqual<
    WebMiddleware<{ readonly body: { test: string; test1: number | undefined } }>,
    typeof mdw
  >
>(false);

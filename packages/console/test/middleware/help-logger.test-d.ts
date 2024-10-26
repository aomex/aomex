import { expectType, type TypeEqual } from 'ts-expect';
import { helpLogger } from '../../src/middleware/help-logger';
import type { ConsoleMiddleware } from '../../src';
import { middleware } from '@aomex/common';

const logger = helpLogger([]);
expectType<TypeEqual<ConsoleMiddleware, typeof logger>>(true);

helpLogger([middleware.console(() => {}), middleware.mixin(() => {})]);
// @ts-expect-error
helpLogger();
// @ts-expect-error
helpLogger([1]);
// @ts-expect-error
helpLogger(['a']);
// @ts-expect-error
helpLogger([{}]);
// @ts-expect-error
helpLogger(middleware.console(() => {}));

import { expectType, type TypeEqual } from 'ts-expect';
import '@aomex/common';

expectType<TypeEqual<'cli' | undefined, typeof process.env.AOMEX_RUNTIME>>(true);
expectType<TypeEqual<'1' | undefined, typeof process.env.AOMEX_CLI_MODE>>(true);

// @ts-expect-error 非法取值
process.env.AOMEX_RUNTIME = 'web';
// @ts-expect-error 非法取值
process.env.AOMEX_CLI_MODE = '0';

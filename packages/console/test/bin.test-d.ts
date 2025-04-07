import { expectType, type TypeEqual } from 'ts-expect';

expectType<TypeEqual<'1' | undefined, typeof process.env.AOMEX_CLI_MODE>>(true);

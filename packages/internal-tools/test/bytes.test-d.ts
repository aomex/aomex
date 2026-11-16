import { expectType, type TypeEqual } from 'ts-expect';
import { bytes, type BytesOptions } from '../src';

const formatted = bytes(1024);
expectType<TypeEqual<string, typeof formatted>>(true);
// @ts-expect-error 格式化结果不含 null
formatted as null;

const opts = { unitSeparator: '' } satisfies BytesOptions;
const formattedWithOpts = bytes(1024, opts);
expectType<TypeEqual<string, typeof formattedWithOpts>>(true);

const parsed = bytes('1KB');
expectType<TypeEqual<number, typeof parsed>>(true);
// @ts-expect-error 解析结果不含 null
parsed as null;

// @ts-expect-error 字符串解析不接受 options
bytes('1KB', { unitSeparator: '' });

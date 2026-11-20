import { expectType } from 'ts-expect';
import type { DurationInput, DurationString, DurationUnit } from '../src/duration';
import { parseDuration } from '../src/duration';

expectType<DurationInput>(1000);
expectType<DurationInput>('1 day');
expectType<DurationInput>('30m');
expectType<DurationInput>('1.5 hours');
expectType<DurationInput>('2 months');
expectType<DurationString>('1 week');
expectType<DurationUnit>('day');

parseDuration('1 day');
parseDuration(60_000);
parseDuration('500ms');

// @ts-expect-error 非法单位
parseDuration('1 lightyear');
// @ts-expect-error 缺少单位
parseDuration('1');
// @ts-expect-error 纯字符串非法
parseDuration('abc');
// @ts-expect-error 不允许 boolean
parseDuration(true);

const unit: DurationUnit = 'month';
expectType<'month'>(unit);
// @ts-expect-error 非法单位字面量
const badUnit: DurationUnit = 'fortnight';
void badUnit;

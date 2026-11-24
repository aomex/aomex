import { expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { rateLimit, type RateLimitOptions } from '../src/rate-limit';

expectType<WebMiddleware>(rateLimit());

const options = {
  maxRequest: 30,
  duration: '10s',
  errorMessage: '稍后再试',
  headers: false,
} satisfies RateLimitOptions;
void rateLimit(options);

rateLimit({ duration: '1 hour' });
rateLimit({ duration: 10_000 });
rateLimit({ duration: 3600 * 1_000 });

rateLimit({
  // @ts-expect-error 无单位的数字字符串不是 DurationInput
  duration: '1',
});

rateLimit({
  // @ts-expect-error maxRequest 须为 number
  maxRequest: '1',
});

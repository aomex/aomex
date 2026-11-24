import { expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { rateLimit, type RateLimitOptions } from '../src/rate-limit';

expectType<WebMiddleware>(rateLimit());

const options = {
  limit: 30,
  window: '10s',
  errorMessage: '稍后再试',
  headers: false,
} satisfies RateLimitOptions;
void rateLimit(options);

rateLimit({ window: '1 hour' });
rateLimit({ window: 10_000 });
rateLimit({ window: 3600 * 1_000 });

rateLimit({
  // @ts-expect-error 无单位的数字字符串不是 DurationInput
  window: '1',
});

rateLimit({
  // @ts-expect-error limit 须为 number
  limit: '1',
});

import { expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { httpAccessLog, HttpAccessLogToken, type HttpAccessLogOptions } from '../src';

expectType<WebMiddleware>(httpAccessLog());
expectType<string>(HttpAccessLogToken.ip);

const options = {
  disabled: false,
  format: `${HttpAccessLogToken.method} [href]`,
  customTokens: {
    href: (ctx) => ctx.request.href,
  },
} satisfies HttpAccessLogOptions;
void httpAccessLog(options);

httpAccessLog({
  // @ts-expect-error customTokens 值须为函数
  customTokens: { foo: 'bar' },
});

httpAccessLog({
  // @ts-expect-error disabled 须为 boolean
  disabled: 'yes',
});

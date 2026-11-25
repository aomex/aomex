import { combineServices, Service } from '@aomex/common';
import { Logger } from '@aomex/logger';
import { WebApp, WebContext } from '../../src';
import { expectType, type TypeEqual } from 'ts-expect';

class Demo extends Service {
  ping() {
    return 1;
  }
}

const services = await combineServices({
  demo: async () => Demo,
});
const logger = new Logger({ transports: [] });

new WebApp({
  services,
  logger,
  language: { mode: 'fixed', language: 'zh-CN' },
  proxyIP: { mode: 'detect' },
});

declare const ctx: WebContext;
expectType<Logger>(ctx.logger);
const bound = ctx.logger.withBindings({ requestId: 'r1' }, async () => 'ok' as const);
expectType<TypeEqual<Promise<'ok'>, typeof bound>>(true);

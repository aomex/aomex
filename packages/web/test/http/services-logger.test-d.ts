import { combineServices, Service, type PromisifiedService } from '@aomex/common';
import { TestWebLoggerService } from '../../src/testing';
import { WebApp, WebContext } from '../../src';
import { expectType, type TypeEqual } from 'ts-expect';

type PL = PromisifiedService<TestWebLoggerService>;
type Ok = PL extends WebApp.Logger ? true : false;
expectType<TypeEqual<true, Ok>>(true);

class Demo extends Service {
  ping() {
    return 1;
  }
}

const services = await combineServices({
  logger: async () => TestWebLoggerService,
  demo: async () => Demo,
});

new WebApp({
  services,
  logger: services.logger,
  language: { mode: 'fixed', language: 'zh-CN' },
  proxyIP: { mode: 'detect' },
});

declare const ctx: WebContext;
expectType<WebApp.Logger>(ctx.logger);
const bound = ctx.logger.withBindings({ requestId: 'r1' }, async () => 'ok' as const);
expectType<TypeEqual<Promise<'ok'>, typeof bound>>(true);

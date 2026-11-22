import { expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { asyncapiUI, type AsyncapiUIOptions } from '../src';
import type { AsyncAPI } from '@aomex/common';

const fromPath = asyncapiUI({ asyncapi: './asyncapi.json' });
expectType<WebMiddleware>(fromPath);

const fromFn = asyncapiUI({
  asyncapi: (): AsyncAPI.Document => ({
    asyncapi: '3.1.0',
    info: { title: 't', version: '0' },
  }),
});
expectType<WebMiddleware>(fromFn);

const fromAsync = asyncapiUI({
  asyncapi: async (): Promise<AsyncAPI.Document> => ({
    asyncapi: '3.0.0',
    info: { title: 't', version: '0' },
  }),
  uriPrefix: '/docs',
  enable: () => true,
  headTags: [
    {
      tag: 'link',
      props: { rel: 'icon', href: '/favicon.ico' },
      selfClosing: true,
    },
  ],
});
expectType<WebMiddleware>(fromAsync);

const opts = {} as AsyncapiUIOptions;
expectType<string | (() => Promise<AsyncAPI.Document> | AsyncAPI.Document)>(
  opts.asyncapi,
);
expectType<string | undefined>(opts.uriPrefix);
expectType<
  ((ctx?: import('@aomex/web').WebContext) => boolean | Promise<boolean>) | undefined
>(opts.enable);

// @ts-expect-error 缺少 asyncapi
asyncapiUI({});

// @ts-expect-error asyncapi 类型非法
asyncapiUI({ asyncapi: 1 });

// @ts-expect-error enable 返回值非法
asyncapiUI({ asyncapi: './x.json', enable: () => 'yes' });

// @ts-expect-error headTags 缺少 tag
asyncapiUI({ asyncapi: './x.json', headTags: [{ props: {} }] });

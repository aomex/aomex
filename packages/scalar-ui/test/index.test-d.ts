import { expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { scalarUI, type ScalarUIOptions } from '../src';
import type { OpenAPI } from '@aomex/common';

const fromPath = scalarUI({ openapi: './openapi.json' });
expectType<WebMiddleware>(fromPath);

const fromFn = scalarUI({
  openapi: (): OpenAPI.Document => ({
    openapi: '3.0.0',
    info: { title: 't', version: '0' },
    paths: {},
  }),
});
expectType<WebMiddleware>(fromFn);

const fromAsync = scalarUI({
  openapi: async (): Promise<OpenAPI.Document> => ({
    openapi: '3.0.0',
    info: { title: 't', version: '0' },
    paths: {},
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

const opts = {} as ScalarUIOptions;
expectType<string | (() => Promise<OpenAPI.Document> | OpenAPI.Document)>(opts.openapi);
expectType<string | undefined>(opts.uriPrefix);
expectType<
  ((ctx?: import('@aomex/web').WebContext) => boolean | Promise<boolean>) | undefined
>(opts.enable);

// @ts-expect-error 缺少 openapi
scalarUI({});

// @ts-expect-error openapi 类型非法
scalarUI({ openapi: 1 });

// @ts-expect-error enable 返回值非法
scalarUI({ openapi: './x.json', enable: () => 'yes' });

// @ts-expect-error headTags 缺少 tag
scalarUI({ openapi: './x.json', headTags: [{ props: {} }] });

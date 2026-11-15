import { expectType, type TypeEqual } from 'ts-expect';
import { CacheAdapter } from '../src';
import {
  CacheFileAdapter,
  type CacheFileAdapterOptions,
} from '../src/adapters/cache-file-adapter';

expectType<TypeEqual<CacheFileAdapterOptions, { filename: string; timeout?: number }>>(
  true,
);

const adapter = new CacheFileAdapter({ filename: ':memory:' });
expectType<TypeEqual<CacheFileAdapter, typeof adapter>>(true);
expectType<TypeEqual<true, typeof adapter extends CacheAdapter ? true : false>>(true);

new CacheFileAdapter({
  filename: '/tmp/cache.sqlite',
  timeout: 1000,
});

// @ts-expect-error 缺少 filename
new CacheFileAdapter({});

// @ts-expect-error filename 必须是 string
new CacheFileAdapter({ filename: 1 });

// @ts-expect-error timeout 必须是 number
new CacheFileAdapter({ filename: ':memory:', timeout: '1' });

expectType<string>(adapter.filename);
expectType<TypeEqual<CacheFileAdapter['getValue'], CacheAdapter['getValue']>>(true);

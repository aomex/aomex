import { type TypeEqual, expectType } from 'ts-expect';
import type { WebMiddleware } from '@aomex/web';
import { Router, routers } from '../src';

// 参数
{
  routers('/path/to');
  routers(['/path/to', 'path/to']);
  routers([new Router(), new Router()]);
  routers([]);
  // @ts-expect-error
  routers();
  // @ts-expect-error
  routers(['/path/to', new Router()]);
}

// 返回值
{
  const md = routers('/');
  expectType<TypeEqual<WebMiddleware, typeof md>>(true);
}

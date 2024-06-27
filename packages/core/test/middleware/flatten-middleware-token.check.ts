import { type TypeEqual, expectType } from 'ts-expect';
import { Middleware, mdchain, flattenMiddlewareToken, middleware } from '../../src';

{
  const result = flattenMiddlewareToken(null);
  expectType<TypeEqual<Middleware[], typeof result>>(true);
}

flattenMiddlewareToken([]);
flattenMiddlewareToken(middleware.mixin(() => {}));
flattenMiddlewareToken(mdchain.mixin);
flattenMiddlewareToken([null, middleware.mixin(() => {}), mdchain.mixin]);

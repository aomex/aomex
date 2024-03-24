import { type TypeEqual, expectType } from 'ts-expect';
import {
  Middleware,
  container,
  flattenMiddlewareToken,
  middleware,
} from '../../src';

{
  const result = flattenMiddlewareToken(null);
  expectType<TypeEqual<Middleware[], typeof result>>(true);
}

flattenMiddlewareToken([]);
flattenMiddlewareToken(middleware.mixin(() => {}));
flattenMiddlewareToken(container.mixin);
flattenMiddlewareToken([null, middleware.mixin(() => {}), container.mixin]);

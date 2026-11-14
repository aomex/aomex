import { middleware } from '@aomex/common';
import type { GenerateOpenapiOptions } from '../../src';

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: './src/routers',
    mount: [],
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    mount: [middleware.web(() => {}), middleware.mixin(() => {})],
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    // @ts-expect-error 不允许 console 中间件
    mount: [middleware.console(() => {})],
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    // @ts-expect-error mount 须为数组
    mount: middleware.web(() => {}),
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    // @ts-expect-error mount 须为 WebMiddlewareToken[]
    mount: {},
  };
  void opts;
}

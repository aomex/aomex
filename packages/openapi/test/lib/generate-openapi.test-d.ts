import type { GenerateOpenapiOptions } from '../../src';
import { TestWebApp } from '../../../web/src/testing';

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: './src/routers',
    app: new TestWebApp(),
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    // @ts-expect-error app 须为 WebApp
    app: {},
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    // @ts-expect-error 已移除 mount，请传 app
    mount: [],
  };
  void opts;
}

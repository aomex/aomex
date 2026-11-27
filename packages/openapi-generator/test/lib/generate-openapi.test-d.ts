import type { GenerateOpenapiOptions, OpenapiVersion } from '../../src';
import { TestWebApp } from '../../../web/src/testing';

type ExpectedOpenapiVersion = '3.1.0' | '3.1.1' | '3.1.2' | '3.2.0' | '3.2.1';

const knownOpenapiVersion: OpenapiVersion = '3.2.1';
void knownOpenapiVersion;

const validDocs: GenerateOpenapiOptions['docs'] = { openapi: '3.1.2' };
void validDocs;

const invalidDocs: GenerateOpenapiOptions['docs'] = {
  // @ts-expect-error 只能使用已发布的 OpenAPI 版本
  openapi: '3.2.2',
};
void invalidDocs;

{
  // @ts-expect-error 不支持 OpenAPI 3.0
  const unsupportedVersion: OpenapiVersion = '3.0.4';
  void unsupportedVersion;
}

{
  // @ts-expect-error 未发布的版本不能赋值
  const invalidVersion: OpenapiVersion = '3.3.0';
  void invalidVersion;
}

type VersionUnionIsExact = OpenapiVersion extends ExpectedOpenapiVersion
  ? ExpectedOpenapiVersion extends OpenapiVersion
    ? true
    : false
  : false;
const versionUnionIsExact: VersionUnionIsExact = true;
void versionUnionIsExact;

{
  // @ts-expect-error app 必填
  const opts: GenerateOpenapiOptions = {
    routers: [],
  };
  void opts;
}

{
  // @ts-expect-error docs 必填
  const opts: GenerateOpenapiOptions = {
    routers: [],
    app: new TestWebApp(),
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: './src/routers',
    app: new TestWebApp(),
    docs: { openapi: '3.2.1' },
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    // @ts-expect-error app 须为 WebApp
    app: {},
    docs: { openapi: '3.2.1' },
  };
  void opts;
}

{
  const opts: GenerateOpenapiOptions = {
    routers: [],
    app: new TestWebApp(),
    docs: { openapi: '3.2.1' },
    // @ts-expect-error 已移除 mount，请传 app
    mount: [],
  };
  void opts;
}

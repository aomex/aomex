import type { GenerateAsyncapiOptions } from '../../src';

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: { asyncapi: '3.1.0' },
  };
  void opts;
}

{
  // @ts-expect-error docs 必填
  const opts: GenerateAsyncapiOptions = {
    channels: [],
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    // @ts-expect-error asyncapi 必填
    docs: { info: { title: 'x', version: '1.0.0' } },
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: { asyncapi: '3.0.0' },
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: {
      // @ts-expect-error 不支持 2.x
      asyncapi: '2.6.0',
    },
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: {
      asyncapi: '3.1.0',
      id: 'urn:aomex:chat',
      defaultContentType: 'application/json',
      servers: {
        prod: { host: 'example.com', protocol: 'wss' },
      },
      info: {
        contact: { name: 'aomex' },
        license: { name: 'MIT' },
      },
    },
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: {
      asyncapi: '3.1.0',
      // @ts-expect-error channels 由生成器写入
      channels: {},
    },
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: {
      asyncapi: '3.1.0',
      // @ts-expect-error operations 由生成器写入
      operations: {},
    },
  };
  void opts;
}

{
  const opts: GenerateAsyncapiOptions = {
    channels: [],
    docs: {
      asyncapi: '3.1.0',
      // @ts-expect-error components 由生成器写入
      components: { messages: {} },
    },
  };
  void opts;
}

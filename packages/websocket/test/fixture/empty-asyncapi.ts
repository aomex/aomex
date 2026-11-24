import type { AsyncAPI } from '@aomex/common';

/** 测试用最小 AsyncAPI 文档（空骨架在 `@aomex/asyncapi-generator`） */
export const emptyAsyncApiDocument = (
  options: {
    asyncapi?: AsyncAPI.Document['asyncapi'];
    info?: Partial<AsyncAPI.InfoObject>;
  } = {},
): AsyncAPI.Document => ({
  asyncapi: options.asyncapi ?? '3.1.0',
  info: {
    title: options.info?.title ?? '',
    version: options.info?.version ?? '0.0.0',
    ...(options.info?.description !== undefined
      ? { description: options.info.description }
      : {}),
  },
  channels: {},
  operations: {},
  components: { messages: {} },
});

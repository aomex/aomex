import { downgradeSpecV32ToV31 } from '@openapi-spec/downgrader';
import type { OpenAPI } from '@aomex/common';
import type { OpenapiVersion } from '../openapi';

export const convertOpenapiVersion = (
  document: OpenAPI.Document,
  version: OpenapiVersion,
): OpenAPI.Document => {
  if (version.startsWith('3.2.')) {
    return { ...document, openapi: version };
  }

  // Scalar 与降级器对 OpenAPI 3.2 的类型定义不兼容，但运行时文档结构一致。
  const document32: unknown = { ...document, openapi: '3.2.0' };
  const document31 = downgradeSpecV32ToV31(
    document32 as Parameters<typeof downgradeSpecV32ToV31>[0],
  );
  const output: unknown = { ...document31, openapi: version };
  return output as OpenAPI.Document;
};

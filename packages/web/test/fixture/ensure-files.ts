import { middleware } from '@aomex/common';
import {
  internalEnsureBodyKey,
  type ParseBodyProps,
} from '../../src/middleware/parse-body';

/** 测试用：在 parseBody 之后按字段名收 multipart 文件 */
export const ensureFiles = (
  ...allowFileFields: string[]
): ReturnType<typeof middleware.web> =>
  middleware.web(async (ctx, next) => {
    await (ctx as typeof ctx & ParseBodyProps)[internalEnsureBodyKey]({
      allowFileFields,
      maxFileSize: 100 * 1024 * 1024,
      maxFiles: 30,
    });
    return next();
  });

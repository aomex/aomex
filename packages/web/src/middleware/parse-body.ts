import { middleware, sleep } from '@aomex/common';
import { bytes } from '@aomex/internal-tools';
import type { WebMiddleware } from '../override';
import type { WebContext } from '../http';
import formidable from 'formidable';
import coBody from 'co-body';
import { unlink } from 'node:fs/promises';
import { finished } from 'node:stream/promises';

const jsonTypes = <const>['json', 'application/*+json', 'application/csp-report'];
const formTypes = <const>['urlencoded'];
const textTypes = <const>['text'];

/** `formData.maxFileSize` 默认值（字节） */
export const DEFAULT_MAX_FILE_SIZE = 50 * 1024 * 1024;
/** `formData.maxFiles` 默认值 */
export const DEFAULT_MAX_FILES = 10;
/** `formData.maxFields` 默认值 */
export const DEFAULT_MAX_FIELDS = 100;
/** `payload.maxSize` 默认值 */
export const DEFAULT_BODY_LIMIT = '2mb';

export interface EnsureBodyOptions {
  /**
   * 允许落盘的文件字段名。
   * 空数组：解析 multipart，但不接收任何文件。
   */
  allowFileFields: readonly string[];
  /**
   * 单文件大小上限（字节）。
   * 默认值：`52428800`
   */
  maxFileSize?: number;
  /**
   * 文件个数上限。无文件字段时应为 `0`。
   */
  maxFiles: number;
  /**
   * 字段个数上限（文本字段 + 文件字段）。
   * 默认值：`100`
   */
  maxFields?: number;
}

/**
 * 包内 Symbol：由 `parseBody` 注入到 ctx，仅供 `body()` 调用。
 */
export const internalEnsureBodyKey: unique symbol = Symbol('internalEnsureBody');

export type ParseBodyProps = {
  [internalEnsureBodyKey]: (options: EnsureBodyOptions) => Promise<void>;
};

/**
 * 请求体解析限制（`WebApp` 的 `body` 选项）。
 *
 * - `payload`：非文件请求体，整包读入内存
 * - `formData`：`multipart/form-data` 上传
 */
export interface ParseBodyOptions {
  /**
   * 非文件请求体限制。
   *
   * 适用 Content-Type：
   * - `application/json`
   * - `application/*+json`
   * - `application/csp-report`
   * - `application/x-www-form-urlencoded`
   * - `text/*`
   *
   */
  payload?: {
    /**
     * 请求体大小上限。数字为字节；字符串如 `'2mb'`。
     * 超出返回 `413` 状态码。
     * 默认值：`2mb`
     */
    maxSize?: string | number;
  };
  /**
   * `multipart/form-data` 限制。
   */
  formData?: {
    /**
     * 单个文件大小上限。数字为字节；字符串如 `'20mb'`。
     * 默认值：`50mb`
     */
    maxFileSize?: string | number;
    /**
     * 单次请求允许的文件个数上限。
     * 默认值：`10`
     */
    maxFiles?: number;
    /**
     * 字段个数上限（文本字段与文件字段合计）。
     * 默认值：`100`
     */
    maxFields?: number;
  };
}

const ensureBody = async (
  ctx: Pick<WebContext, 'request' | 'response'>,
  options: EnsureBodyOptions,
): Promise<void> => {
  const { request, response } = ctx;
  if (request['_body'] !== undefined) return;
  if (!request.contentType) {
    request['_body'] = {};
    return;
  }

  if (!request.matchContentType('multipart/form-data')) {
    // json/urlencoded/text 由全局 parseBody 处理；此处兜底为空对象
    request['_body'] = {};
    return;
  }

  const allowFileFields = new Set(options.allowFileFields);
  const maxFileSize = Math.max(0, options.maxFileSize ?? DEFAULT_MAX_FILE_SIZE);
  const maxFiles = Math.max(0, options.maxFiles);
  const maxFields = Math.max(0, options.maxFields ?? DEFAULT_MAX_FIELDS);

  const filepaths: string[] = [];
  const form = formidable({
    hashAlgorithm: 'md5',
    keepExtensions: true,
    maxFileSize,
    maxFiles,
    maxFields,
    allowEmptyFiles: false,
    filter: ({ name }) => !!name && allowFileFields.has(name),
  });
  form.on('fileBegin', (_name, file) => {
    filepaths.push(file.filepath);
  });

  const cleanupFiles = () => {
    for (const filepath of filepaths) {
      void (async () => {
        for (let i = 0; i < 5; i++) {
          try {
            await unlink(filepath);
            return;
          } catch (e) {
            const code =
              e && typeof e === 'object' && 'code' in e
                ? (e as NodeJS.ErrnoException).code
                : undefined;
            if (code === 'ENOENT') return;
            if (code !== 'EBUSY' && code !== 'EPERM') return;
            await sleep(20 * (i + 1));
          }
        }
      })();
    }
  };

  const onRequestCloseDuringParse = () => {
    if (!request.complete) cleanupFiles();
  };
  request.once('close', onRequestCloseDuringParse);

  try {
    const [fields, files] = await form.parse(request);
    request.off('close', onRequestCloseDuringParse);

    const fixedFields = Object.fromEntries(
      Object.entries(fields).map(([key, values]) => {
        return [key, values == undefined || values.length > 1 ? values : values[0]];
      }),
    );
    request['_body'] = { ...fixedFields, ...files };

    if (filepaths.length) {
      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        cleanupFiles();
      };
      response.once('finish', cleanup);
      response.once('close', cleanup);
    }
  } catch (e) {
    cleanupFiles();
    request.once('close', cleanupFiles);
    throw e;
  }
};

/**
 * 将路由上传选项与应用 `formData` 上限合并（取更严）。
 */
export const mergeUploadCeilings = (
  opts: EnsureBodyOptions,
  formData?: ParseBodyOptions['formData'],
): EnsureBodyOptions => {
  if (!formData) return opts;

  const ceilingFileSize =
    formData.maxFileSize !== undefined
      ? Math.max(
          0,
          (typeof formData.maxFileSize === 'number'
            ? formData.maxFileSize
            : bytes(formData.maxFileSize)) ?? 0,
        )
      : undefined;
  const ceilingFiles =
    formData.maxFiles !== undefined ? Math.max(0, formData.maxFiles) : undefined;
  const ceilingFields =
    formData.maxFields !== undefined ? Math.max(0, formData.maxFields) : undefined;

  return {
    ...opts,
    maxFiles:
      ceilingFiles !== undefined && opts.maxFiles > 0
        ? Math.min(opts.maxFiles, ceilingFiles)
        : opts.maxFiles,
    ...(ceilingFileSize !== undefined
      ? {
          maxFileSize: Math.min(
            opts.maxFileSize ?? DEFAULT_MAX_FILE_SIZE,
            ceilingFileSize,
          ),
        }
      : null),
    ...(ceilingFields !== undefined
      ? {
          maxFields: Math.min(opts.maxFields ?? DEFAULT_MAX_FIELDS, ceilingFields),
        }
      : null),
  };
};

/**
 * 全局请求体中间件：
 * - 解析 `payload` 适用的 Content-Type
 * - 向 ctx 注入 `internalEnsureBody`，供 `body()` 按需解析 `multipart/form-data`
 * - 若无人解析 multipart，则在 `next` 之后丢弃请求流
 */
export const parseBody = (
  options: ParseBodyOptions = {},
): WebMiddleware<ParseBodyProps> => {
  const maxPayloadSize = options.payload?.maxSize ?? DEFAULT_BODY_LIMIT;

  return middleware.web({
    fn: async (ctx, next) => {
      ctx[internalEnsureBodyKey] = (opts) =>
        ensureBody(ctx, mergeUploadCeilings(opts, options.formData));

      const { request } = ctx;
      if (!request.contentType) return next();

      const methodName = request.matchContentType(...jsonTypes)
        ? 'json'
        : request.matchContentType(...formTypes)
          ? 'form'
          : request.matchContentType(...textTypes)
            ? 'text'
            : false;

      if (methodName) {
        const { parsed, raw } = await coBody[methodName](request, {
          limit: maxPayloadSize,
          returnRawBody: true,
          ...(methodName === 'json' ? { strict: false } : null),
          // @ts-expect-error
          onProtoPoisoning: 'remove',
        });
        const isEmptyPayload =
          methodName === 'json' && typeof raw === 'string' && raw.trim() === '';
        request['_body'] = isEmptyPayload ? {} : parsed;
        request['_rawBody'] = raw;
        return next();
      }

      // 等待 body() 主动解析
      if (!request.matchContentType('multipart/form-data')) {
        return next();
      }

      await next();

      // 无人调用 internalEnsureBody 时丢弃流，避免连接挂起
      if (
        request['_body'] === undefined &&
        !request.readableEnded &&
        !request.destroyed
      ) {
        request.resume();
        try {
          await finished(request);
        } catch {
          // 客户端断开等错误忽略
        }
      }
    },
  });
};

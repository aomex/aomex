import {
  validate,
  Validator,
  ValidateDeniedError,
  middleware,
  AllOfValidator,
  ArrayValidator,
  ObjectValidator,
  type OpenAPI,
  toDocument,
  toValidator,
  type ValidatorToken,
} from '@aomex/common';
import { FileValidator, type WebMiddleware } from '../override';
import {
  DEFAULT_MAX_FILES,
  internalEnsureBodyKey,
  type EnsureBodyOptions,
  type ParseBodyProps,
} from './parse-body';

/**
 * 字段上的文件配额。进入 `array` / `oneOf` / `anyOf` / `allOf`，不进入嵌套 `object`。
 * 组合分支的个数取较大值；`array` 的个数用自身 `length.max`。
 */
const getFileQuota = (
  validator: Validator,
): { maxFiles: number; maxSize?: number } | null => {
  if (validator instanceof FileValidator) {
    const maxSize = validator['config'].maxSize;
    return {
      maxFiles: 1,
      ...(maxSize !== undefined ? { maxSize } : null),
    };
  }

  // multipart 字段名平铺，嵌套 object 内的 file 对不上 part 名
  if (validator instanceof ObjectValidator) {
    return null;
  }

  if (validator instanceof ArrayValidator) {
    const item = validator['config'].itemValidator;
    if (!item) return null;
    const inner = getFileQuota(item);
    if (!inner) return null;
    return {
      maxFiles: validator['config'].lengthRange.max ?? DEFAULT_MAX_FILES,
      ...(inner.maxSize !== undefined ? { maxSize: inner.maxSize } : null),
    };
  }

  // 字段本身是 oneOf / anyOf / allOf：各分支里的 file 或 array(file) 都算这个字段，个数和 maxSize 取较大值
  let found = false;
  let maxFiles = 0;
  let maxSize: number | undefined;
  for (const child of validator['nested']()) {
    const quota = getFileQuota(child);
    if (!quota) continue;
    found = true;
    maxFiles = Math.max(maxFiles, quota.maxFiles);
    if (quota.maxSize !== undefined) {
      maxSize = Math.max(maxSize ?? 0, quota.maxSize);
    }
  }
  if (!found) return null;
  return {
    maxFiles: Math.max(1, maxFiles),
    ...(maxSize !== undefined ? { maxSize } : null),
  };
};

const emptyUploadOptions = (): EnsureBodyOptions => ({
  allowFileFields: [],
  maxFiles: 0,
});

/** 只扫这一层 object 的字段，不进入嵌套 object。 */
const getObjectUploadOptions = (root: ObjectValidator): EnsureBodyOptions => {
  const properties = root['config'].properties ?? {};
  const allowFileFields: string[] = [];
  let maxFileSize: number | undefined;
  let maxFiles = 0;

  for (const [key, validator] of Object.entries(properties)) {
    const quota = getFileQuota(validator);
    if (!quota) continue;
    allowFileFields.push(key);
    maxFiles += quota.maxFiles;
    if (quota.maxSize !== undefined) {
      maxFileSize = Math.max(maxFileSize ?? 0, quota.maxSize);
    }
  }

  if (!allowFileFields.length) return emptyUploadOptions();

  return {
    allowFileFields,
    maxFiles: Math.max(1, maxFiles),
    ...(maxFileSize !== undefined ? { maxFileSize } : null),
  };
};

/**
 * 合并多个分支的上传选项。字段名取并集。
 * `sumFiles` 为真时个数相加（`allOf`），否则取较大值（`oneOf` / `anyOf`）。
 */
const mergeBranchUploadOptions = (
  branches: EnsureBodyOptions[],
  sumFiles: boolean,
): EnsureBodyOptions => {
  const allowFileFields: string[] = [];
  const seen = new Set<string>();
  let maxFileSize: number | undefined;
  let maxFiles = 0;

  for (const branch of branches) {
    for (const field of branch.allowFileFields) {
      if (seen.has(field)) continue;
      seen.add(field);
      allowFileFields.push(field);
    }
    if (branch.maxFileSize !== undefined) {
      maxFileSize = Math.max(maxFileSize ?? 0, branch.maxFileSize);
    }
    maxFiles = sumFiles
      ? maxFiles + branch.maxFiles
      : Math.max(maxFiles, branch.maxFiles);
  }

  if (!allowFileFields.length) return emptyUploadOptions();

  return {
    allowFileFields,
    maxFiles: Math.max(1, maxFiles),
    ...(maxFileSize !== undefined ? { maxFileSize } : null),
  };
};

/**
 * 根为 object 时扫顶层字段。
 * 其余有 `nested()` 子节点就展开，包括 `array` / `oneOf` / `anyOf` / `allOf`。
 * `oneOf` / `anyOf` / `array` 个数取较大值，`allOf` 个数相加。
 */
const getRootUploadOptions = (validator: Validator): EnsureBodyOptions => {
  if (validator instanceof ObjectValidator) {
    return getObjectUploadOptions(validator);
  }

  const children = validator['nested']();
  if (!children.length) return emptyUploadOptions();

  return mergeBranchUploadOptions(
    children
      .map(getRootUploadOptions)
      .filter((branch) => branch.allowFileFields.length > 0),
    validator instanceof AllOfValidator,
  );
};

/**
 * 从 body schema 收集 multipart 文件白名单与体积/数量上限。
 * 字段名是平铺的，只认对象这一层的名字，不进入嵌套 object。
 *
 * `maxFileSize` 只在出现 `file().maxSize()` 时带出，多个取较大值；
 * 没写则交给 `ensureBody` / 应用 `formData` 上限。
 *
 * 会收集：
 * - `object({ avatar: file() })`：1 个
 * - `object({ photos: array(file()).length({ max }) })`：个数为 `max`，缺省为 `DEFAULT_MAX_FILES`
 * - 同一 object 上多个文件字段：名字都要，个数相加，`maxSize` 取较大值
 * - 字段上的 `oneOf` / `anyOf` / `allOf`（分支是 `file` 或 `array(file)`）：收录该字段，个数取各分支较大值
 *   `oneOf([file(), array(file()).length({ max: 3 })])` → 3
 *   `array(oneOf([file(), string()]))` → 用 array 的 `length.max`
 * - 根是 `oneOf` / `anyOf`，分支是 object（可再套组合）：字段名取并集，个数取各分支较大值
 *   `anyOf([object({ avatar: file() }), object({ name: string() })])` → `avatar`
 *   `oneOf([object({ avatar: file() }), object({ photos: array(file()).length({ max: 3 }) })])` → 3
 * - 根是 `allOf`，分支是 object：字段名取并集（同名只留一次），个数相加
 *   `allOf([object({ avatar: file() }), object({ cover: file() })])` → 2
 * - 根是 `array(object({ avatar: file() }))`：收录对象顶层的 `avatar`。
 *   外层 array 的 `length.max` 不参与个数
 *
 * 不收集：
 * - 根不是 object，也没有能展开出文件字段的子节点，如 `string()` / `array(file())` / `file()`
 * - 组合分支里没有带文件字段的 object
 * - 嵌套 object：`object({ profile: object({ avatar: file() }) })`
 * - 字段上的组合或 array 只含 object：`oneOf([object({ f: file() }), string()])`、
 *   `array(object({ file: file() }))`
 */
export const getFileUploadOptions = (fields: ValidatorToken): EnsureBodyOptions =>
  getRootUploadOptions(toValidator(fields));

/**
 * 验证请求实体。`multipart` 时按 schema 解析（仅白名单字段收文件）。
 */
export const body = <T extends ValidatorToken>(
  fields: T,
): WebMiddleware<{ readonly body: Validator.Infer<T> }> => {
  return middleware.web({
    fn: async (ctx, next) => {
      try {
        await (ctx as typeof ctx & ParseBodyProps)[internalEnsureBodyKey](
          getFileUploadOptions(fields),
        );
        ctx.body = await validate(ctx.request.body, fields);
        return next();
      } catch (e) {
        ctx.throw(e instanceof ValidateDeniedError ? 400 : 500, e as Error);
      }
    },
    openapi: {
      onMethod(methodItem) {
        const docs = toDocument(fields);
        const schema = docs.schema as OpenAPI.SchemaObject;
        const contentType = Validator.has(toValidator(fields), FileValidator)
          ? 'multipart/form-data'
          : 'application/json';

        methodItem.requestBody = {
          content: {
            [contentType]: { schema },
          },
          required:
            schema.type === 'object' ? !!schema.required?.length : !!docs.required,
        };
      },
    },
  });
};

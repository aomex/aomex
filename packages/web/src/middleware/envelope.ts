import { type OpenAPI, toDocument } from '@aomex/common';
import statuses from 'statuses';
import { WebMiddleware } from '../override';
import {
  EnvelopeBuiltinSlot,
  EnvelopeCustomSlot,
  X_SKIP_ENVELOPE,
  type EnvelopeContent,
  type EnvelopeOptions,
} from '../http/envelope';

const ENVELOPE_HTTP_STATUS = 200;

const isReferenceObject = (value: unknown): value is OpenAPI.ReferenceObject =>
  typeof value === 'object' && value !== null && '$ref' in value;

const resolveMediaType = (
  media: OpenAPI.MediaTypeObject | OpenAPI.ReferenceObject,
  document: OpenAPI.Document,
): OpenAPI.MediaTypeObject | undefined => {
  if (!isReferenceObject(media)) return media;
  const prefix = '#/components/mediaTypes/';
  if (!media.$ref.startsWith(prefix)) return undefined;
  const encodedName = media.$ref.slice(prefix.length);
  if (!encodedName || encodedName.includes('/')) return undefined;
  const name = decodeURIComponent(encodedName).replace(/~1/g, '/').replace(/~0/g, '~');
  if (name.includes('/')) return undefined;

  const target = document.components?.mediaTypes?.[name];
  if (!target || isReferenceObject(target)) return undefined;
  return {
    ...target,
    ...(media.summary === undefined ? {} : { summary: media.summary }),
    ...(media.description === undefined ? {} : { description: media.description }),
  };
};

const readSkipEnvelopeStatuses = (methodItem: OpenAPI.OperationObject): Set<number> => {
  const raw = (methodItem as Record<string, unknown>)[X_SKIP_ENVELOPE];
  if (!Array.isArray(raw)) return new Set();
  return new Set(raw.filter((n): n is number => typeof n === 'number'));
};

const isRedirectStatus = (code: number) => code >= 300 && code < 400;

const isEmptyStatus = (code: number): boolean => !!statuses.empty[code];

const parseResponseStatusKey = (key: string): number | 'default' | 'range' | null => {
  if (key === 'default') return 'default';
  if (/^[1-5]XX$/i.test(key)) return 'range';
  const n = Number(key);
  return Number.isInteger(n) && n >= 100 && n <= 599 ? n : null;
};

const isSuccessStatusKey = (key: string): boolean => {
  const parsed = parseResponseStatusKey(key);
  if (parsed === 'default') return false;
  if (parsed === 'range') return /^2XX$/i.test(key);
  if (parsed == null) return false;
  if (isEmptyStatus(parsed)) return false;
  return parsed >= 200 && parsed < 300;
};

const isErrorStatusKey = (key: string): boolean => {
  const parsed = parseResponseStatusKey(key);
  if (parsed === 'default') return true;
  if (parsed === 'range') return /^[45]XX$/i.test(key);
  if (parsed == null) return false;
  return parsed >= 400 && parsed < 600;
};

const isRedirectStatusKey = (key: string): boolean => {
  const parsed = parseResponseStatusKey(key);
  if (parsed === 'range') return /^3XX$/i.test(key);
  if (typeof parsed !== 'number') return false;
  return isRedirectStatus(parsed);
};

const isEmptyStatusKey = (key: string): boolean => {
  const parsed = parseResponseStatusKey(key);
  if (typeof parsed !== 'number') return false;
  return isEmptyStatus(parsed);
};

const pickMediaSchema = (
  response: OpenAPI.ResponseObject | OpenAPI.ReferenceObject | undefined,
  document: OpenAPI.Document,
): OpenAPI.SchemaObject | undefined => {
  if (!response || '$ref' in response) return undefined;
  const content = response.content;
  if (!content) return undefined;
  const json = content['application/json'];
  if (json) {
    const schema = resolveMediaType(json, document)?.schema;
    if (
      schema !== undefined &&
      typeof schema === 'object' &&
      schema !== null &&
      !isReferenceObject(schema)
    ) {
      return schema as OpenAPI.SchemaObject;
    }
  }
  for (const media of Object.values(content)) {
    const schema = resolveMediaType(media, document)?.schema;
    if (
      schema !== undefined &&
      typeof schema === 'object' &&
      schema !== null &&
      !isReferenceObject(schema)
    ) {
      return schema as OpenAPI.SchemaObject;
    }
  }
  return undefined;
};

const hasUnresolvedResponseReference = (
  response: OpenAPI.ResponseObject | OpenAPI.ReferenceObject,
  document: OpenAPI.Document,
): boolean => {
  if (isReferenceObject(response)) return true;
  for (const media of Object.values(response.content ?? {})) {
    const resolved = resolveMediaType(media, document);
    if (!resolved) return true;
    if (
      resolved.schema !== undefined &&
      (typeof resolved.schema === 'boolean' || isReferenceObject(resolved.schema))
    ) {
      return true;
    }
  }
  return false;
};

/**
 * 将套壳 schema 并入已 kept 的 skip `200`：保留 description / headers / 非 JSON media，
 * 仅在 `application/json` 上与裸 JSON schema 做 oneOf（无裸 JSON 则直接写入套壳）。
 */
const mergeEnvelopeIntoSkipped200 = (
  existing: OpenAPI.ResponseObject,
  envSchema: OpenAPI.SchemaObject,
  options: EnvelopeOptions,
  document: OpenAPI.Document,
): OpenAPI.ResponseObject => {
  const merged: OpenAPI.ResponseObject = structuredClone(existing);
  const envBranches =
    typeof envSchema === 'object' && envSchema !== null && envSchema.oneOf
      ? envSchema.oneOf.map((s) => structuredClone(s as OpenAPI.SchemaObject))
      : [structuredClone(envSchema)];
  const envOnly = envBranches.length === 1 ? envBranches[0]! : { oneOf: envBranches };

  merged.content = { ...merged.content };
  const prevJson = merged.content['application/json'];
  const resolvedPrevJson = prevJson && resolveMediaType(prevJson, document);

  if (prevJson && !resolvedPrevJson) {
    merged.content['application/json'] = prevJson;
  } else if (resolvedPrevJson && isReferenceObject(resolvedPrevJson.schema)) {
    merged.content['application/json'] = prevJson!;
  } else if (resolvedPrevJson?.schema !== undefined) {
    merged.content['application/json'] = {
      ...resolvedPrevJson,
      schema: { oneOf: [structuredClone(resolvedPrevJson.schema), ...envBranches] },
    };
  } else if (resolvedPrevJson) {
    merged.content['application/json'] = {
      ...resolvedPrevJson,
      schema: envOnly,
    };
  } else {
    merged.content['application/json'] = { schema: envOnly };
  }

  if (!merged.description && options.description !== undefined) {
    merged.description = options.description;
  }

  return merged;
};

const mergeSchemas = (
  schemas: OpenAPI.SchemaObject[],
): OpenAPI.SchemaObject | undefined => {
  if (schemas.length === 0) return undefined;
  if (schemas.length === 1) return structuredClone(schemas[0]!);
  return { oneOf: schemas.map((s) => structuredClone(s)) };
};

/**
 * 将声明树转为 OpenAPI schema。
 * - `success`：可带 `enum: [true|false]` 区分成败支
 * - `payload`：替换为收集到的内层 schema
 * - `statusCode`：integer
 * - 自定义槽：用其 schema
 */
const resolveOpenApiNode = (
  node: EnvelopeContent,
  payloadSchema: OpenAPI.SchemaObject,
  successConst?: boolean,
): OpenAPI.SchemaObject => {
  if (node instanceof EnvelopeBuiltinSlot) {
    switch (node.kind) {
      case 'success':
        return successConst === undefined
          ? { type: 'boolean' }
          : { type: 'boolean', enum: [successConst] };
      case 'payload':
        return structuredClone(payloadSchema);
      case 'statusCode':
        return { type: 'integer' };
      default: {
        const _kind: never = node.kind;
        void _kind;
      }
    }
  }
  if (node instanceof EnvelopeCustomSlot) {
    const schema = toDocument(node.schema).schema;
    if (!schema || '$ref' in schema) return {};
    return structuredClone(schema);
  }

  const properties: Record<string, OpenAPI.SchemaObject> = {};
  const required: string[] = [];
  for (const [key, child] of Object.entries(node)) {
    properties[key] = resolveOpenApiNode(child, payloadSchema, successConst);
    required.push(key);
  }
  return {
    type: 'object',
    properties,
    required,
    additionalProperties: false,
  };
};

/**
 * 供 `WebApp` 在配置 `envelope` 时自动插入全局链（最外层）。
 * 运行时仅 `next()`（真正套壳仍在 `flush`）；OpenAPI 经 `postMethod` 收口。
 * 文档侧依赖「每个 operation 的 postMethod 倒序」使本中间件最后执行。
 *
 * ```
 *                    postMethod
 *                        |
 *                        v
 *              遍历各状态响应声明
 *                        |
 *          +-------------+-------------+
 *          |             |             |
 *          v             v             v
 *   3xx/空/skip       成功/错误        其它
 *          |             |             |
 *          v             v             v
 *     原样留下(kept)   记入套壳支       丢弃
 *          |             |
 *          +------+------+
 *                 |
 *                 v
 *            遍历结束
 *                 |
 *                 v
 *            有套壳支?
 *            /        \
 *          有          无（全是原样留下或压根没声明）
 *          |           |
 *          |      有原样留下的状态?
 *          |      /              \
 *          |    是                否
 *          |    |                 |
 *          |  直接写回原样       路径完全空：
 *          |  留下的，结束       造一份空套壳形
 *          |  （不虚构 200）        |
 *          |                       |
 *          +-----------+-----------+
 *                      |
 *                      v
 *               得到 envSchema
 *                    |
 *                    v
 *            已有 skip 200?
 *            /            \
 *          是              否
 *          |               |
 *     并进该 200        新建套壳 200
 *     (保留裸响应)           |
 *          |               |
 *          +-------+-------+
 *                  |
 *                  v
 *        原样留下 + 套壳 200 写回
 * ```
 */
export const createEnvelopeMiddleware = (options: EnvelopeOptions): WebMiddleware =>
  new WebMiddleware({
    fn: async (_ctx, next) => next(),
    openapi: {
      postMethod: (methodItem, opts) => {
        methodItem.responses ||= {};
        const prev = methodItem.responses;
        // response({ skipEnvelope }) 在 onMethod 写入的状态码集合；非数组视为空
        const skipStatuses = readSkipEnvelopeStatuses(methodItem);
        // 需套壳的成败内层 schema（多状态合并为 oneOf 后塞进 payload 槽）
        const successSchemas: OpenAPI.SchemaObject[] = [];
        const errorSchemas: OpenAPI.SchemaObject[] = [];
        // 原样留下、不套壳的响应（变量名 kept）：3xx / 空状态码 / skip 登记状态
        const kept: OpenAPI.OperationObject['responses'] = {};
        // 无 media schema 时仍记入成败支（payload 用 {}），避免漏掉「仅 description」声明
        let hasSuccessToWrap = false;
        let hasErrorToWrap = false;

        for (const key of Object.keys(prev)) {
          const response = prev[key]!;
          // 运行时也不套壳：重定向、204/205/304
          if (isRedirectStatusKey(key) || isEmptyStatusKey(key)) {
            kept[key] = response;
            continue;
          }
          // 仅精确数字键可 skip；2XX/4XX/default 等范围键仍走套壳
          const parsed = parseResponseStatusKey(key);
          if (typeof parsed === 'number' && skipStatuses.has(parsed)) {
            kept[key] = response;
            continue;
          }
          // 优先 application/json，否则取第一个带 schema 的 media
          const schema = pickMediaSchema(response, opts.document);
          if (schema !== undefined) {
            if (isSuccessStatusKey(key)) {
              successSchemas.push(schema);
              hasSuccessToWrap = true;
            } else if (isErrorStatusKey(key)) {
              errorSchemas.push(schema);
              hasErrorToWrap = true;
            }
            // 其它键（如未识别状态）既不 kept 也不进套壳，等价于丢弃
          } else if (hasUnresolvedResponseReference(response, opts.document)) {
            kept[key] = response;
          } else if (isSuccessStatusKey(key)) {
            hasSuccessToWrap = true;
          } else if (isErrorStatusKey(key)) {
            hasErrorToWrap = true;
          }
        }

        // 套壳后 HTTP 固定 200：success=true / success=false 两支（可缺一）
        const branches: OpenAPI.SchemaObject[] = [];
        const successPayload = mergeSchemas(successSchemas) ?? {};
        const errorPayload = mergeSchemas(errorSchemas) ?? {};

        if (hasSuccessToWrap) {
          branches.push(resolveOpenApiNode(options.content, successPayload, true));
        }
        if (hasErrorToWrap) {
          branches.push(resolveOpenApiNode(options.content, errorPayload, false));
        }

        if (branches.length === 0) {
          // 全部被 kept（如仅 skip / 仅 3xx）时不虚构套壳 200
          if (Object.keys(kept).length > 0) {
            methodItem.responses = kept;
            return;
          }
          // 路径上完全没有 responses：仍给一份未区分成败的默认套壳形
          branches.push(resolveOpenApiNode(options.content, {}, undefined));
        }

        const envSchema = branches.length === 1 ? branches[0]! : { oneOf: branches };
        const envKey = String(ENVELOPE_HTTP_STATUS);
        // skip 200 已在 kept：按「是否存在该 ResponseObject」合并，而不是「是否有 schema」
        const existing = kept[envKey];

        if (existing && !('$ref' in existing)) {
          kept[envKey] = mergeEnvelopeIntoSkipped200(
            existing,
            envSchema,
            options,
            opts.document,
          );
        } else {
          // 无 skip 200：新建套壳 200
          kept[envKey] = {
            description: options.description ?? '',
            content: {
              'application/json': { schema: envSchema },
            },
          };
        }

        methodItem.responses = kept;
      },
    },
  });

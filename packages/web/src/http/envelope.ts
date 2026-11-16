import { Validator, type ValidatorToken, type OpenAPI, toDocument } from '@aomex/common';
import statuses from 'statuses';
import type { OpenApiInjector } from '../override';
import type { Body, BodyType, WebResponse } from './response';

/** 可被响应体套壳包裹的 body 形态（stream / buffer 不包） */
export type EnvelopeBodyType = Extract<BodyType, 'json' | 'string' | 'null'>;

/** 套壳时可读的内置变量（自定义 `slot` 的唯一入参） */
export interface EnvelopeVars {
  /** 原 `statusCode < 400` */
  success: boolean;
  /** 原响应 body（仅 json / string / null） */
  payload: object | string | null;
  /** 改写前的 HTTP 状态码 */
  statusCode: number;
}

declare const envelopeBuiltinBrand: unique symbol;
declare const envelopeCustomBrand: unique symbol;

/** 内置槽位：success / payload / statusCode */
export class EnvelopeBuiltinSlot<
  Kind extends 'success' | 'payload' | 'statusCode' =
    'success' | 'payload' | 'statusCode',
> {
  declare readonly [envelopeBuiltinBrand]: void;
  constructor(readonly kind: Kind) {}
}

/** 自定义槽位：OpenAPI 用 schema，运行时用 get */
export class EnvelopeCustomSlot<Schema extends ValidatorToken = ValidatorToken> {
  declare readonly [envelopeCustomBrand]: void;
  constructor(
    readonly schema: Schema,
    readonly get: (vars: EnvelopeVars) => Validator.Infer<Schema>,
  ) {}
}

/**
 * 响应体套壳声明树：只允许内置槽位、`envelope.slot`、以及嵌套普通对象。
 * 禁止直接塞 `rule.*`（无运行时取值来源）。
 */
export type EnvelopeContent =
  | EnvelopeBuiltinSlot<'success' | 'payload' | 'statusCode'>
  | EnvelopeCustomSlot<ValidatorToken>
  | { readonly [key: string]: EnvelopeContent };

export interface EnvelopeOptions {
  /**
   * 套壳结构（声明式）。用内置槽位与 `envelope.slot` 拼装；
   * OpenAPI / 运行时均遍历此树替换槽位，不执行用户工厂函数。
   */
  content: EnvelopeContent;
  description?: string;
}

const ENVELOPE_HTTP_STATUS = 200;

const isRedirectStatus = (code: number) => code >= 300 && code < 400;

/** 无响应体状态码：204 / 205 / 304（与 `statuses.empty` 对齐） */
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
): OpenAPI.SchemaObject | undefined => {
  if (!response || '$ref' in response) return undefined;
  const content = response.content;
  if (!content) return undefined;
  const json = content['application/json'];
  if (json?.schema && !('$ref' in json.schema)) return json.schema;
  for (const media of Object.values(content)) {
    if (media?.schema && !('$ref' in media.schema)) return media.schema;
  }
  return undefined;
};

const mergeSchemas = (
  schemas: OpenAPI.SchemaObject[],
): OpenAPI.SchemaObject | undefined => {
  if (schemas.length === 0) return undefined;
  if (schemas.length === 1) return structuredClone(schemas[0]!);
  return { oneOf: schemas.map((s) => structuredClone(s)) };
};

/** 将声明树转为运行时 body */
const resolveRuntimeNode = (node: EnvelopeContent, vars: EnvelopeVars): unknown => {
  if (node instanceof EnvelopeBuiltinSlot) {
    switch (node.kind) {
      case 'success':
        return vars.success;
      case 'payload':
        return vars.payload;
      case 'statusCode':
        return vars.statusCode;
      default: {
        const _kind: never = node.kind;
        void _kind;
      }
    }
  }
  if (node instanceof EnvelopeCustomSlot) {
    return node.get(vars);
  }
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(node)) {
    out[key] = resolveRuntimeNode(child, vars);
  }
  return out;
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

const canWrapResponse = (res: WebResponse): boolean => {
  if (res.headersSent) return false;
  if (isRedirectStatus(res.statusCode)) return false;
  if (isEmptyStatus(res.statusCode)) return false;
  if (res.contentType.includes('text/event-stream')) return false;

  const bodyType = res['_bodyType'] as BodyType;
  return bodyType === 'json' || bodyType === 'string' || bodyType === 'null';
};

/**
 * 运行时套壳：在 `flush` 写出前调用。
 * 固定 HTTP `200`；跳过 stream、buffer、SSE、3xx、无内容状态码（204/205/304）。
 */
export const applyResponseEnvelope = (
  res: WebResponse,
  options: EnvelopeOptions,
): void => {
  if (!canWrapResponse(res)) return;

  const statusCode = res.statusCode;
  const bodyType = res['_bodyType'] as BodyType;
  const payload = (bodyType === 'null' ? null : res.body) as object | string | null;
  const vars: EnvelopeVars = {
    success: statusCode < 400,
    payload,
    statusCode,
  };

  // 原 string 等可能已带 text/plain；套壳后必须是 JSON
  res.removeHeader('Content-Type');
  res.body = resolveRuntimeNode(options.content, vars) as Body;
  res.statusCode = ENVELOPE_HTTP_STATUS;
};

/**
 * OpenAPI：在其它中间件的 `postMethod` 之后调用，将 2xx / 4xx·5xx·default 收成 `200`。
 * 保留 3xx 与无内容状态码（204/205/304），与运行时跳过规则一致。
 */
export const createEnvelopeOpenApiInjector = (
  options: EnvelopeOptions,
): OpenApiInjector => ({
  postMethod: (methodItem) => {
    methodItem.responses ||= {};
    const prev = methodItem.responses;
    const successSchemas: OpenAPI.SchemaObject[] = [];
    const errorSchemas: OpenAPI.SchemaObject[] = [];
    const kept: OpenAPI.OperationObject['responses'] = {};

    for (const [key, response] of Object.entries(prev)) {
      if (isRedirectStatusKey(key) || isEmptyStatusKey(key)) {
        kept[key] = response;
        continue;
      }
      const schema = pickMediaSchema(response);
      if (schema) {
        if (isSuccessStatusKey(key)) successSchemas.push(schema);
        else if (isErrorStatusKey(key)) errorSchemas.push(schema);
      }
    }

    const branches: OpenAPI.SchemaObject[] = [];
    const successPayload = mergeSchemas(successSchemas) ?? {};
    const errorPayload = mergeSchemas(errorSchemas) ?? {};

    if (successSchemas.length > 0 || Object.keys(prev).some(isSuccessStatusKey)) {
      branches.push(resolveOpenApiNode(options.content, successPayload, true));
    }
    if (errorSchemas.length > 0 || Object.keys(prev).some(isErrorStatusKey)) {
      branches.push(resolveOpenApiNode(options.content, errorPayload, false));
    }

    if (branches.length === 0) {
      // 仅有 3xx / 无内容状态码时不虚构 200；完全无 responses 时仍给出套壳默认形
      if (Object.keys(kept).length > 0) {
        methodItem.responses = kept;
        return;
      }
      branches.push(resolveOpenApiNode(options.content, {}, undefined));
    }

    const schema = branches.length === 1 ? branches[0]! : { oneOf: branches };

    kept[String(ENVELOPE_HTTP_STATUS)] = {
      description: options.description ?? '',
      content: {
        'application/json': { schema },
      },
    };

    methodItem.responses = kept;
  },
});

/**
 * 响应体套壳槽位（配置给 `WebApp.envelope`）。
 *
 * - 内置：`envelope.success` / `envelope.payload` / `envelope.statusCode`
 * - 自定义：`envelope.slot(schema, get)`，`get` 只读 `{ success, payload, statusCode }`
 *
 * ```ts
 * new WebApp({
 *   envelope: {
 *     content: {
 *       success: envelope.success,
 *       statusCode: envelope.statusCode,
 *       data: envelope.payload,
 *       version: envelope.slot(rule.string(), () => '1.0'),
 *     },
 *   },
 *   mount: [formatError({ ... })],
 *   // ...
 * });
 * ```
 */
export const envelope = {
  /** 原请求是否业务成功（`statusCode < 400`）；OpenAPI 成败支分别固定为 `true` / `false` */
  success: new EnvelopeBuiltinSlot('success'),
  /** 套壳前的响应 body（仅 json / string / null）；OpenAPI 替换为对应状态支的内层 schema */
  payload: new EnvelopeBuiltinSlot('payload'),
  /** 套壳前的 HTTP 状态码（写出后仍固定为 200） */
  statusCode: new EnvelopeBuiltinSlot('statusCode'),
  /**
   * 自定义槽位：`schema` 供 OpenAPI；`get(vars)` 供运行时取值。
   * `vars` 仅含 `{ success, payload, statusCode }`，勿依赖其它上下文。
   */
  slot: <Schema extends ValidatorToken>(
    schema: Schema,
    get: (vars: EnvelopeVars) => Validator.Infer<Schema>,
  ) => new EnvelopeCustomSlot(schema, get),
};

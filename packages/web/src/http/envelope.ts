import { Validator, type ValidatorToken } from '@aomex/common';
import statuses from 'statuses';
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

/**
 * OpenAPI 临时约定：`response({ skipEnvelope: true })` 在 `onMethod` 写入对应状态码列表；
 * envelope 中间件的 `postMethod` 对这些状态保留原声明、不套壳；`parseFiles` 在全部 `postMethod` 之后删除。
 */
export const X_SKIP_ENVELOPE = 'x-skip-envelope';

const isRedirectStatus = (code: number) => code >= 300 && code < 400;

/** 无响应体状态码：204 / 205 / 304（与 `statuses.empty` 对齐） */
const isEmptyStatus = (code: number): boolean => !!statuses.empty[code];

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

const canWrapResponse = (res: WebResponse): boolean => {
  if (res.skipEnvelope) return false;
  if (res['skipEnvelopeStatuses'].has(res.statusCode)) return false;
  if (res.headersSent) return false;
  if (isRedirectStatus(res.statusCode)) return false;
  if (isEmptyStatus(res.statusCode)) return false;
  if (res.contentType.includes('text/event-stream')) return false;

  const bodyType = res['_bodyType'] as BodyType;
  return bodyType === 'json' || bodyType === 'string' || bodyType === 'null';
};

/**
 * 运行时套壳：在 `flush` 写出前调用。
 * 固定 HTTP `200`；跳过 `skipEnvelope` / 登记过的状态码、stream、buffer、SSE、3xx、无内容状态码（204/205/304）。
 */
export const applyResponseEnvelope = (
  res: WebResponse,
  options: EnvelopeOptions,
): void => {
  if (!canWrapResponse(res)) return;

  const statusCode = res.statusCode;
  const bodyType = res['_bodyType'] as BodyType;
  const vars: EnvelopeVars = {
    success: statusCode < 400,
    payload: resolveEnvelopePayload(res, bodyType),
    statusCode,
  };

  // 原 string 等可能已带 text/plain；套壳后必须是 JSON
  res.removeHeader('Content-Type');
  // body 已变，原 ETag 不再对应写出内容
  res.removeHeader('ETag');
  res.body = resolveRuntimeNode(options.content, vars) as Body;
  res.statusCode = ENVELOPE_HTTP_STATUS;
};

/**
 * 取出套壳用的内层 payload。
 * `Content-Type` 已是 JSON 但 body 仍是字符串时（如手动 `JSON.stringify`），解析回对象/数组，避免 `data` 变成 JSON 文本。
 */
const resolveEnvelopePayload = (
  res: WebResponse,
  bodyType: BodyType,
): object | string | null => {
  if (bodyType === 'null') return null;
  if (bodyType === 'string' && res.contentType === 'application/json') {
    try {
      return JSON.parse(res.body as string) as object | string;
    } catch {
      return res.body as string;
    }
  }
  return res.body as object | string;
};

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

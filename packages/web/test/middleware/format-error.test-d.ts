import { type TypeEqual, expectType } from 'ts-expect';
import {
  FormatErrorMiddleware,
  formatError,
  type FormatErrorHandlerResult,
  type FormatErrorPublic,
  type HttpError,
  type HttpErrorStatus,
} from '../../src';
import { StringValidator, rule, type ValidatorToken } from '@aomex/common';
import type { Body } from '../../src/http/response';

// FormatErrorHandlerResult：无 content → Body | void；有 content → Infer
{
  expectType<TypeEqual<Body | void, FormatErrorHandlerResult<ValidatorToken>>>(true);
  type WithContent = FormatErrorHandlerResult<{ code: StringValidator }>;
  expectType<TypeEqual<{ code: string }, WithContent>>(true);
}

// 有 content：返回值必须对齐；入参为 FormatErrorPublic（含 raw）
{
  const mdw = formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    handler(err) {
      expectType<FormatErrorPublic>(err);
      expectType<HttpErrorStatus>(err.statusCode);
      expectType<string | undefined>(err.code);
      expectType<string>(err.message);
      expectType<boolean>(err.expose);
      expectType<HttpError>(err.raw);
      return { code: err.code ?? 'X' };
    },
  });

  expectType<
    TypeEqual<
      FormatErrorMiddleware<{
        code: StringValidator;
        message: ReturnType<StringValidator['optional']>;
      }>,
      typeof mdw
    >
  >(true);

  // 只返回必填
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    handler() {
      return { code: 'A' };
    },
  });
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    async handler() {
      return { code: 'A' };
    },
  });

  // 可选字段显式 undefined / 有值
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    handler() {
      return { code: 'A', message: undefined };
    },
  });
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    async handler() {
      return { code: 'A', message: undefined };
    },
  });
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    handler() {
      return { code: 'A', message: 'x' };
    },
  });
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    async handler() {
      return { code: 'A', message: 'x' };
    },
  });

  // 缺字段 / 错类型 / 多余字段
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error 缺少必填 code
    handler() {
      return {};
    },
  });
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error 缺少必填 code
    handler() {
      return { message: 'x' };
    },
  });
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error 类型不匹配
    handler() {
      return { code: 1 };
    },
  });
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error 多余字段
    handler() {
      return { code: 'A', extra: 1 };
    },
  });
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error 多余字段 async
    async handler() {
      return { code: 'A', extra: 1 };
    },
  });
  formatError({
    content: { code: rule.string(), message: rule.string().optional() },
    // @ts-expect-error 多个多余字段
    handler() {
      return { code: 'A', foo: 1, bar: true };
    },
  });
}

// content 为嵌套对象：结构要对齐，多余键仍拦
{
  formatError({
    content: {
      error: rule.object({
        code: rule.string(),
        detail: rule.string().optional(),
      }),
    },
    handler() {
      return { error: { code: 'X' } };
    },
  });
  formatError({
    content: {
      error: rule.object({
        code: rule.string(),
        detail: rule.string().optional(),
      }),
    },
    handler() {
      return { error: { code: 'X', detail: 'd' } };
    },
  });
  formatError({
    content: {
      error: rule.object({ code: rule.string() }),
    },
    // @ts-expect-error 嵌套缺字段
    handler() {
      return { error: {} };
    },
  });
  formatError({
    content: {
      error: rule.object({ code: rule.string() }),
    },
    // @ts-expect-error 顶层多余字段
    handler() {
      return { error: { code: 'X' }, extra: 1 };
    },
  });
  formatError({
    content: {
      error: rule.object({ code: rule.string() }),
    },
    // @ts-expect-error 嵌套多余字段
    handler() {
      return {
        error: {
          code: 'X',
          extra: 1,
        },
      };
    },
  });
}

// content 为 string / array：原始与数组不做键级收紧
{
  formatError({
    content: rule.string(),
    handler() {
      return 'plain';
    },
  });
  formatError({
    content: rule.string(),
    // @ts-expect-error 类型不匹配
    handler() {
      return 1;
    },
  });
  formatError({
    content: rule.array(rule.string()),
    handler() {
      return ['a', 'b'];
    },
  });
  formatError({
    content: rule.array(rule.string()),
    async handler() {
      return ['a'];
    },
  });
  formatError({
    content: rule.array(rule.string()),
    // @ts-expect-error 元素类型不匹配
    handler() {
      return [1];
    },
  });
}

// content 为 rule.object 字段表
{
  formatError({
    content: rule.object({ id: rule.number(), name: rule.string().optional() }),
    handler() {
      return { id: 1 };
    },
  });
  formatError({
    content: rule.object({ id: rule.number() }),
    // @ts-expect-error 多余字段
    handler() {
      return { id: 1, extra: 'x' };
    },
  });
  formatError({
    content: rule.object({ id: rule.number() }).nullable(),
    handler() {
      return null;
    },
  });
  formatError({
    content: rule.object({ id: rule.number() }).nullable(),
    handler() {
      return { id: 1 };
    },
  });
  formatError({
    content: rule.object({ id: rule.number() }).nullable(),
    // @ts-expect-error nullable 对象不能 undefined
    handler() {
      return undefined;
    },
  });
  formatError({
    content: rule.array({ n: rule.number() }),
    handler() {
      return [{ n: 1 }];
    },
  });
  formatError({
    content: rule.array({ n: rule.number() }),
    // @ts-expect-error 数组元素多余键
    handler() {
      return [{ n: 1, x: true }];
    },
  });
  formatError({
    content: rule.allOf([{ a: rule.number() }, { b: rule.string() }]),
    handler() {
      return { a: 1, b: 'x' };
    },
  });
  formatError({
    content: rule.allOf([{ a: rule.number() }, { b: rule.string() }]),
    // @ts-expect-error 交叉多余键
    handler() {
      return { a: 1, b: 'x', z: 1 };
    },
  });
  const wider = { id: 1, extra: true };
  formatError({
    content: { id: rule.number() },
    // @ts-expect-error 变量带回多余键
    handler() {
      return wider;
    },
  });
}

// 无 content：可返回任意 Body 或 void（不做多余键收紧）
{
  formatError({
    handler() {
      return { any: 1, more: true };
    },
  });
  formatError({
    handler() {
      return 'text';
    },
  });
  formatError({
    handler() {
      return null;
    },
  });
  formatError({
    handler() {},
  });
  formatError({
    async handler() {
      return { loose: true };
    },
  });
}

// statusCodes 仅允许 HttpErrorStatus
{
  formatError({
    statusCodes: [400, 500, 411],
    handler() {},
  });
  formatError({
    // @ts-expect-error 非错误状态码
    statusCodes: [200],
    handler() {},
  });
  formatError({
    // @ts-expect-error 已剔除的非法码
    statusCodes: [427],
    handler() {},
  });
  formatError({
    // @ts-expect-error 非法状态码
    statusCodes: [999],
    handler() {},
  });
}

// WebResponseMediaOptions：contentType / headers / example / description
{
  formatError({
    content: { code: rule.string() },
    contentType: 'json',
    headers: { 'x-error-id': rule.string() },
    example: { code: 'X' },
    description: '业务错误',
    handler(err) {
      return { code: err.code ?? 'X' };
    },
  });
}

// FormatErrorPublic：顶层已净化；完整 HttpError 在 raw
{
  const err = null as unknown as FormatErrorPublic;
  expectType<string>(err.message);
  expectType<boolean>(err.expose);
  expectType<HttpError>(err.raw);
  // @ts-expect-error 无 stack（在 raw 上）
  err.stack;
  // @ts-expect-error 无 cause（在 raw 上）
  err.cause;
  // @ts-expect-error 无 headers（已由中间件写入响应）
  err.headers;
  expectType<string | undefined>(err.raw.stack);
  expectType<string>(err.raw.message);
}

// handler 必填；有 content 时不能省略返回
{
  // @ts-expect-error
  formatError({});
  // @ts-expect-error
  formatError({ content: { code: rule.string() } });
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error 有 content 时不能省略返回
    handler() {},
  });
  formatError({
    content: { code: rule.string() },
    // @ts-expect-error async 也必须返回
    async handler() {},
  });
}

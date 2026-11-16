import { rule, type ValidatorToken } from '@aomex/common';
import { expectType, type TypeEqual } from 'ts-expect';
import {
  envelope,
  EnvelopeBuiltinSlot,
  EnvelopeCustomSlot,
  type EnvelopeContent,
  type EnvelopeOptions,
  type EnvelopeVars,
} from '../../src';

// 内置槽位
{
  expectType<EnvelopeBuiltinSlot<'success'>>(envelope.success);
  expectType<EnvelopeBuiltinSlot<'payload'>>(envelope.payload);
  expectType<EnvelopeBuiltinSlot<'statusCode'>>(envelope.statusCode);
  expectType<TypeEqual<'success', (typeof envelope.success)['kind']>>(true);
  expectType<TypeEqual<'payload', (typeof envelope.payload)['kind']>>(true);
  expectType<TypeEqual<'statusCode', (typeof envelope.statusCode)['kind']>>(true);
}

// slot：get 入参为 EnvelopeVars，返回值对齐 schema
{
  const s = envelope.slot(rule.string(), (vars) => {
    expectType<EnvelopeVars>(vars);
    expectType<boolean>(vars.success);
    expectType<object | string | null>(vars.payload);
    expectType<number>(vars.statusCode);
    return '1.0';
  });
  expectType<EnvelopeCustomSlot<ReturnType<typeof rule.string>>>(s);

  // @ts-expect-error 返回值必须是 number
  envelope.slot(rule.number(), (vars) => String(vars.statusCode));
}

// content 声明树 / WebApp.envelope 配置
{
  const content: EnvelopeContent = {
    success: envelope.success,
    data: envelope.payload,
    meta: {
      code: envelope.statusCode,
      version: envelope.slot(rule.string(), () => '1'),
    },
  };
  const options: EnvelopeOptions = { content };
  void options;

  const badOptions: EnvelopeOptions = {
    content: {
      // @ts-expect-error 禁止直接塞 rule（无运行时取值）
      bad: rule.string(),
    },
  };
  void badOptions;

  // @ts-expect-error content 必填
  const missing: EnvelopeOptions = {
    description: 'x',
  };
  void missing;
}

// envelope 不再是可调用中间件工厂
{
  // @ts-expect-error 非中间件，不可调用
  envelope({
    content: {
      success: envelope.success,
      data: envelope.payload,
    },
  });
}

// ValidatorToken 占位：确保 slot schema 泛型贯通
{
  const schema = { id: rule.number() } satisfies ValidatorToken;
  envelope.slot(schema, () => ({ id: 1 }));
  // @ts-expect-error 缺少 id
  envelope.slot(schema, () => ({}));
}

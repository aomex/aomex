import { expectType } from 'ts-expect';
import { ConsoleError, type ConsoleErrorProperties } from '../../src';

// ConsoleError 构造
{
  const a = new ConsoleError();
  expectType<ConsoleError>(a);
  expectType<string | undefined>(a.code);

  new ConsoleError('msg');
  new ConsoleError('msg', { code: 'X', cause: new Error() });

  // @ts-expect-error properties 不可为任意键
  const bad: ConsoleErrorProperties = { foo: 1 };
  void bad;
  // @ts-expect-error 已移除 exitCode
  const bad2: ConsoleErrorProperties = { exitCode: 1 };
  void bad2;
}

// ConsoleError.from
{
  expectType<ConsoleError>(ConsoleError.from(new Error('x')));
  expectType<ConsoleError>(ConsoleError.from(new ConsoleError('x')));
  expectType<ConsoleError>(ConsoleError.from('msg'));
  expectType<ConsoleError>(ConsoleError.from(null));
}

// ConsoleError.isError 收窄为本类
{
  const v: unknown = null;
  if (ConsoleError.isError(v)) {
    expectType<ConsoleError>(v);
    expectType<string | undefined>(v.code);
  }
  if (Error.isError(v)) {
    expectType<Error>(v);
    // @ts-expect-error 上游 isError 不收窄到 ConsoleError
    v.code;
  }
}

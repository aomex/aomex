import { rule } from '@aomex/common';
import { ConsoleMiddleware, options } from '../../src';
import { type TypeEqual, expectType } from 'ts-expect';

// 返回值
{
  const opts = options({
    test: rule.string(),
  });
  expectType<
    TypeEqual<
      ConsoleMiddleware<{
        readonly options: { test: string };
      }>,
      typeof opts
    >
  >(true);
}

// 别名
{
  options(
    {
      test: rule.string(),
    },
    {
      test: ['t'],
    },
  );

  options(
    {
      test: rule.string(),
    },
    {
      // @ts-expect-error
      test1: ['t'],
    },
  );
}

// 无效参数
{
  // @ts-expect-error
  options();
  // @ts-expect-error
  options(rule.object());
}

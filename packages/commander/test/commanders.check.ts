import { type TypeEqual, expectType } from 'ts-expect';
import { Commander, commanders } from '../src';
import type { ConsoleMiddleware } from '@aomex/console';

// 参数
{
  commanders('/path/to');
  commanders(['/path/to', 'path/to']);
  commanders([new Commander(), new Commander()]);
  commanders([]);
  // @ts-expect-error
  commanders();
  // @ts-expect-error
  commanders(['/path/to', new Commander()]);
}

// 返回值
{
  const md = commanders('/');
  expectType<TypeEqual<ConsoleMiddleware, typeof md>>(true);
}

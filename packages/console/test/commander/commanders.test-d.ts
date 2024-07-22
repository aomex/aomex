import { type TypeEqual, expectType } from 'ts-expect';
import { Commander, commanders, ConsoleMiddleware } from '../../src';

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

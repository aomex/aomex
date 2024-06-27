import { type TypeEqual, expectType } from 'ts-expect';
import { getFileValues } from '../src';

// 结果检测
{
  const result = await getFileValues(['/']);
  expectType<TypeEqual<unknown[], typeof result>>(true);
}

// 使用泛型
{
  const result = await getFileValues<string>(['/'], (item) => {
    expectType<TypeEqual<unknown, typeof item>>(true);
    return true;
  });
  expectType<TypeEqual<string[], typeof result>>(true);
}

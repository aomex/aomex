import { type TypeEqual, expectType } from 'ts-expect';
import { type GlobPathFullOptions, normalizeGlobPath } from '../src';

// 字符串
normalizeGlobPath('/path/to');

// 字符串数组
normalizeGlobPath(['/path/to', '/path/to']);

// 对象
normalizeGlobPath({
  pattern: ['/path/to'],
});

// 对象数组
normalizeGlobPath([
  {
    pattern: ['/path/to'],
  },
]);

{
  // 结果对比
  const result = normalizeGlobPath('/path/to');
  expectType<TypeEqual<GlobPathFullOptions[], typeof result>>(true);
}

// 字符串和对象不可混用
normalizeGlobPath([
  // @ts-expect-error
  '/path/to',
  {
    pattern: ['/path/to'],
  },
]);

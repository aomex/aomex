import type { WebContext } from '@aomex/web';
import { cors, type CorsOptions } from '../src';

// 合法：字符串 / 数组 / 同步函数 / 异步函数
{
  const options: CorsOptions[] = [
    { origin: '*' },
    { origin: 'https://aomex.js.org' },
    { origin: ['https://aomex.js.org', 'https://example.com'] },
    { origin: [] },
    { origin: () => '*' },
    { origin: () => 'https://aomex.js.org' },
    { origin: () => undefined },
    { origin: async () => '*' },
    { origin: async () => undefined },
    {
      origin: (_ctx: WebContext) => 'https://aomex.js.org',
    },
  ];
  void options;
  void cors({ origin: ['https://aomex.js.org'] });
}

// 非法形态
{
  // @ts-expect-error 不允许 number
  cors({ origin: 1 });
  // @ts-expect-error 不允许 boolean
  cors({ origin: true });
  // @ts-expect-error 不允许嵌套数组
  cors({ origin: [['https://aomex.js.org']] });
  // @ts-expect-error 不允许 RegExp
  cors({ origin: /aomex/ });
  // @ts-expect-error 函数不得返回 number
  cors({ origin: () => 1 });
  // @ts-expect-error 函数不得返回 boolean
  cors({ origin: () => true });
  // @ts-expect-error 函数不得返回数组
  cors({ origin: () => ['https://aomex.js.org'] });
  // @ts-expect-error 异步函数不得返回 number
  cors({ origin: async () => 1 });
  // @ts-expect-error 异步函数不得返回数组
  cors({ origin: async () => ['https://aomex.js.org'] });
  // @ts-expect-error 数组元素必须是 string
  cors({ origin: [1, 'https://aomex.js.org'] });
  // @ts-expect-error 不允许 null
  cors({ origin: null });
}

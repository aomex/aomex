import type { WebContext, WebMiddleware } from '@aomex/web';
import { csrf, type Csrf } from '../src';
import { expectType } from 'ts-expect';

// 合法 Options
{
  const options: Csrf.Options[] = [
    {},
    { headerName: 'x-xsrf-token' },
    { ignoreMethods: [] },
    { ignoreMethods: ['GET', 'head'] },
    { cookie: { name: 'csrf', sameSite: 'lax', path: '/', maxAge: 60, secure: true } },
    { cookie: { sameSite: true } },
    { cookie: { sameSite: false } },
    { ignore: () => true },
    { ignore: async () => false },
    {
      ignore: (_ctx: WebContext) => true,
    },
  ];
  void options;
  void csrf();
  void csrf({});
}

// 中间件注入 csrfToken
{
  const md = csrf();
  expectType<WebMiddleware<{ readonly csrfToken: string }>>(md);

  type Ctx = WebContext & { readonly csrfToken: string };
  const ctx = {} as Ctx;
  expectType<string>(ctx.csrfToken);
}

// 非法形态
{
  // @ts-expect-error 不允许 number
  csrf({ headerName: 1 });
  // @ts-expect-error 不允许 boolean
  csrf({ headerName: true });
  // @ts-expect-error ignoreMethods 元素必须是 string
  csrf({ ignoreMethods: [1] });
  // @ts-expect-error ignore 不得返回 number
  csrf({ ignore: () => 1 });
  // @ts-expect-error 不支持从 body 取 token
  csrf({ getToken: () => 'x' });
  // @ts-expect-error 不支持 verify 开关
  csrf({ verify: false });
  // @ts-expect-error cookie 禁止配置 httpOnly（强制可读）
  csrf({ cookie: { httpOnly: true } });
  // @ts-expect-error cookie 禁止配置 httpOnly: false（类型上已省略该字段）
  csrf({ cookie: { httpOnly: false } });
  // @ts-expect-error cookie 禁止 encode
  csrf({ cookie: { encode: (v: string) => v } });
  // @ts-expect-error 不允许 null
  csrf({ cookie: null });
  // @ts-expect-error 不支持自定义 errorMessage
  csrf({ errorMessage: 'x' });
}

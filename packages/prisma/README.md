# @aomex/prisma

从 Prisma schema 生成 aomex 校验用的 `schema`，经 `definePrismaSchema` 解包后使用。

## 安装

```bash
pnpm add @aomex/prisma
```

## 配置

```prisma
generator aomex {
  provider = "aomex-prisma"
  // 默认输出：src/generated/aomex/prisma
}
```

```bash
npx prisma generate
```

## 业务入口

创建 `src/schemas/prisma.schema.ts`（不要直接用生成文件）：

```ts
import { definePrismaSchema } from '@aomex/prisma';
import { rule } from '@aomex/common';
import { generated } from '../generated/aomex/prisma';

export const { prismaInput, prismaOutput, prismaEnum } = definePrismaSchema(generated, {
  user: {
    input: (s) => s.extend({ password: rule.string() }),
    output: (s) => s.omit('password'),
  },
});
```

路由里使用 `prismaInput` / `prismaOutput` / `prismaEnum`。模型与 enum 的键名为 Prisma 原始名称。

已测引擎：mysql / postgresql / mongodb / sqlite。

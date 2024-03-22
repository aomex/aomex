# aomex

流畅的 node.js 框架，启发自[koa](https://github.com/koajs/koa)和[yii](https://github.com/yiisoft/yii2)

[![node version](https://img.shields.io/node/v/@aomex/core?logo=node.js)](https://nodejs.org)
[![npm peer typescript version](https://img.shields.io/npm/dependency-version/@aomex/core/peer/typescript?logo=typescript)](https://github.com/microsoft/TypeScript)
[![GitHub Workflow Status (lint)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/lint.yml?branch=main&label=lint&logo=eslint)](https://github.com/aomex/aomex/actions/workflows/lint.yml)
[![GitHub Workflow Status (test)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/test.yml?branch=main&label=test&logo=vitest)](https://github.com/aomex/aomex/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/aomex/aomex?logo=codecov)](https://codecov.io/gh/aomex/aomex)
[![License](https://img.shields.io/github/license/aomex/aomex?logo=open-source-initiative)](https://github.com/aomex/aomex/blob/main/LICENSE)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)](https://github.com/prettier/prettier)

# 特性

- Web应用（接口，静态文件）
- 终端应用（命令行，计划任务）
- 中间件 & 链条
- 数据验证
- Openapi/Swagger 文档生成器
- 缓存
- 强大的 TypeScript 类型提示

# 安装

```bash
pnpm create aomex
# OR
yarn create aomex
# OR
npm create aomex
```

# 应用平台

| Name                                 | Version                                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [@aomex/web](./packages/web)         | [![npm](https://img.shields.io/npm/v/@aomex/web)](https://www.npmjs.com/package/@aomex/web)         |
| [@aomex/console](./packages/console) | [![npm](https://img.shields.io/npm/v/@aomex/console)](https://www.npmjs.com/package/@aomex/console) |

# 中间件和核心库

| Name                                             | Version                                                                                                         | Platform |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------- |
| [@aomex/router](./packages/router)               | [![npm](https://img.shields.io/npm/v/@aomex/router)](https://www.npmjs.com/package/@aomex/router)               | web      |
| [@aomex/compress](./packages/compress)           | [![npm](https://img.shields.io/npm/v/@aomex/compress)](https://www.npmjs.com/package/@aomex/compress)           | web      |
| [@aomex/cors](./packages/cors)                   | [![npm](https://img.shields.io/npm/v/@aomex/cors)](https://www.npmjs.com/package/@aomex/cors)                   | web      |
| [@aomex/jwt](./packages/jwt)                     | [![npm](https://img.shields.io/npm/v/@aomex/jwt)](https://www.npmjs.com/package/@aomex/jwt)                     | web      |
| [@aomex/logger](./packages/logger)               | [![npm](https://img.shields.io/npm/v/@aomex/logger)](https://www.npmjs.com/package/@aomex/logger)               | web      |
| [@aomex/helmet](./packages/helmet)               | [![npm](https://img.shields.io/npm/v/@aomex/helmet)](https://www.npmjs.com/package/@aomex/helmet)               | web      |
| [@aomex/pretty-json](./packages/pretty-json)     | [![npm](https://img.shields.io/npm/v/@aomex/pretty-json)](https://www.npmjs.com/package/@aomex/pretty-json)     | web      |
| [@aomex/response-time](./packages/response-time) | [![npm](https://img.shields.io/npm/v/@aomex/response-time)](https://www.npmjs.com/package/@aomex/response-time) | web      |
| [@aomex/rate-limit](./packages/rate-limit)       | [![npm](https://img.shields.io/npm/v/@aomex/rate-limit)](https://www.npmjs.com/package/@aomex/rate-limit)       | web      |
| [@aomex/etag](./packages/etag)                   | [![npm](https://img.shields.io/npm/v/@aomex/etag)](https://www.npmjs.com/package/@aomex/etag)                   | web      |
| [@aomex/static](./packages/static)               | [![npm](https://img.shields.io/npm/v/@aomex/static)](https://www.npmjs.com/package/@aomex/static)               | web      |
| [@aomex/commander](./packages/commander)         | [![npm](https://img.shields.io/npm/v/@aomex/commander)](https://www.npmjs.com/package/@aomex/commander)         | console  |
| [@aomex/openapi](./packages/openapi)             | [![npm](https://img.shields.io/npm/v/@aomex/openapi)](https://www.npmjs.com/package/@aomex/openapi)             | console  |
| [@aomex/cron](./packages/cron)                   | [![npm](https://img.shields.io/npm/v/@aomex/cron)](https://www.npmjs.com/package/@aomex/cron)                   | console  |
| [@aomex/prisma](./packages/prisma)               | [![npm](https://img.shields.io/npm/v/@aomex/prisma)](https://www.npmjs.com/package/@aomex/prisma)               | -        |
| [@aomex/service](./packages/service)             | [![npm](https://img.shields.io/npm/v/@aomex/service)](https://www.npmjs.com/package/@aomex/service)             | -        |
| [@aomex/redis-cache](./packages/redis-cache)     | [![npm](https://img.shields.io/npm/v/@aomex/redis-cache)](https://www.npmjs.com/package/@aomex/redis-cache)     | -        |

# 第三方推荐

| Name                                             | Version                                                                               | Description                |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- | -------------------------- |
| [prisma](https://github.com/prisma/prisma)       | [![npm](https://img.shields.io/npm/v/prisma)](https://www.npmjs.com/package/prisma)   | 数据库 ORM                 |
| [vitest](https://github.com/vitest-dev/vitest)   | [![npm](https://img.shields.io/npm/v/vitest)](https://www.npmjs.com/package/vitest)   | 测试框架                   |
| [ts-node](https://github.com/TypeStrong/ts-node) | [![npm](https://img.shields.io/npm/v/ts-node)](https://www.npmjs.com/package/ts-node) | 执行 TS 文件               |
| [nodemon](https://github.com/remy/nodemon)       | [![npm](https://img.shields.io/npm/v/nodemon)](https://www.npmjs.com/package/nodemon) | 开发时修改代码自动重启服务 |

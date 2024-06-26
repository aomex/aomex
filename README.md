# aomex

流畅的 node.js 框架，启发自[koa](https://github.com/koajs/koa)和[yii](https://github.com/yiisoft/yii2)

[![node version](https://img.shields.io/node/v/@aomex/core?logo=node.js)](https://nodejs.org)
[![npm peer typescript version](https://img.shields.io/npm/dependency-version/@aomex/core/peer/typescript?logo=typescript)](https://github.com/microsoft/TypeScript)
[![GitHub Workflow Status (lint)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/lint.yml?branch=main&label=lint&logo=eslint)](https://github.com/aomex/aomex/actions/workflows/lint.yml)
[![GitHub Workflow Status (test)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/test.yml?branch=main&label=test&logo=vitest)](https://github.com/aomex/aomex/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/aomex/aomex?logo=codecov)](https://codecov.io/gh/aomex/aomex)
[![License](https://img.shields.io/github/license/aomex/aomex?logo=open-source-initiative)](https://github.com/aomex/aomex/blob/main/LICENSE)

# 特性

- HTTP接口
- 终端指令
- 中间件
- 数据验证
- 缓存
- 国际化
- 定时任务
- 接口文档生成器
- 极限TS类型提示

# 安装

```bash
npm create aomex --project my-aomex --pnpm
```

# 应用平台

| Name                                 | Version                                                                                             |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- |
| [@aomex/web](./packages/web)         | [![npm](https://img.shields.io/npm/v/@aomex/web)](https://www.npmjs.com/package/@aomex/web)         |
| [@aomex/console](./packages/console) | [![npm](https://img.shields.io/npm/v/@aomex/console)](https://www.npmjs.com/package/@aomex/console) |

# 中间件

| Name                                                               | Version                                                                                                                           | Platform    | Desc                 |
| ------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------- | -------------------- |
| [@aomex/router](./packages/router)                                 | [![npm](https://img.shields.io/npm/v/@aomex/router)](https://www.npmjs.com/package/@aomex/router)                                 | web         | 接口路由             |
| [@aomex/compress](./packages/compress)                             | [![npm](https://img.shields.io/npm/v/@aomex/compress)](https://www.npmjs.com/package/@aomex/compress)                             | web         | 压缩响应内容         |
| [@aomex/cors](./packages/cors)                                     | [![npm](https://img.shields.io/npm/v/@aomex/cors)](https://www.npmjs.com/package/@aomex/cors)                                     | web         | 跨域请求共享         |
| [@aomex/jwt](./packages/jwt)                                       | [![npm](https://img.shields.io/npm/v/@aomex/jwt)](https://www.npmjs.com/package/@aomex/jwt)                                       | web         | 认证令牌             |
| [@aomex/http-logger](./packages/http-logger)                       | [![npm](https://img.shields.io/npm/v/@aomex/http-logger)](https://www.npmjs.com/package/@aomex/http-logger)                       | web         | http请求日志         |
| [@aomex/helmet](./packages/helmet)                                 | [![npm](https://img.shields.io/npm/v/@aomex/helmet)](https://www.npmjs.com/package/@aomex/helmet)                                 | web         | 设置安全报文         |
| [@aomex/pretty-json](./packages/pretty-json)                       | [![npm](https://img.shields.io/npm/v/@aomex/pretty-json)](https://www.npmjs.com/package/@aomex/pretty-json)                       | web         | 美化响应输出         |
| [@aomex/serve-static](./packages/serve-static)                     | [![npm](https://img.shields.io/npm/v/@aomex/serve-static)](https://www.npmjs.com/package/@aomex/serve-static)                     | web         | 静态文件服务         |
| [@aomex/response-time](./packages/response-time)                   | [![npm](https://img.shields.io/npm/v/@aomex/response-time)](https://www.npmjs.com/package/@aomex/response-time)                   | web         | 设置服务响应时长报文 |
| [@aomex/rate-limit](./packages/rate-limit)                         | [![npm](https://img.shields.io/npm/v/@aomex/rate-limit)](https://www.npmjs.com/package/@aomex/rate-limit)                         | web         | 请求限速             |
| [@aomex/rate-limit-redis-store](./packages/rate-limit-redis-store) | [![npm](https://img.shields.io/npm/v/@aomex/rate-limit-redis-store)](https://www.npmjs.com/package/@aomex/rate-limit-redis-store) | web         | 请求限速Redis存储    |
| [@aomex/etag](./packages/etag)                                     | [![npm](https://img.shields.io/npm/v/@aomex/etag)](https://www.npmjs.com/package/@aomex/etag)                                     | web         | 设置etag报文         |
| [@aomex/commander](./packages/commander)                           | [![npm](https://img.shields.io/npm/v/@aomex/commander)](https://www.npmjs.com/package/@aomex/commander)                           | console     | 指令路由             |
| [@aomex/openapi](./packages/openapi)                               | [![npm](https://img.shields.io/npm/v/@aomex/openapi)](https://www.npmjs.com/package/@aomex/openapi)                               | console     | 生成接口文档         |
| [@aomex/cron](./packages/cron)                                     | [![npm](https://img.shields.io/npm/v/@aomex/cron)](https://www.npmjs.com/package/@aomex/cron)                                     | console     | 定时任务             |
| [@aomex/async-trace](./packages/async-trace)                       | [![npm](https://img.shields.io/npm/v/@aomex/async-trace)](https://www.npmjs.com/package/@aomex/async-trace)                       | web/console | 异步逻辑链路追踪     |

# 缓存库

| Name                                           | Version                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [@aomex/memory-cache](./packages/memory-cache) | [![npm](https://img.shields.io/npm/v/@aomex/memory-cache)](https://www.npmjs.com/package/@aomex/memory-cache) |
| [@aomex/file-cache](./packages/file-cache)     | [![npm](https://img.shields.io/npm/v/@aomex/file-cache)](https://www.npmjs.com/package/@aomex/file-cache)     |
| [@aomex/redis-cache](./packages/redis-cache)   | [![npm](https://img.shields.io/npm/v/@aomex/redis-cache)](https://www.npmjs.com/package/@aomex/redis-cache)   |

# 第三方推荐搭配

| Name                                                 | Version                                                                                   | Desc          |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------- |
| [tsx](https://github.com/privatenumber/tsx)          | [![npm](https://img.shields.io/npm/v/tsx)](https://www.npmjs.com/package/tsx)             | 执行 TS 文件  |
| [prisma](https://github.com/prisma/prisma)           | [![npm](https://img.shields.io/npm/v/prisma)](https://www.npmjs.com/package/prisma)       | 数据库 ORM    |
| [winston](https://github.com/winstonjs/winston)      | [![npm](https://img.shields.io/npm/v/winston)](https://www.npmjs.com/package/winston)     | 通用的日志库  |
| [vitest](https://github.com/vitest-dev/vitest)       | [![npm](https://img.shields.io/npm/v/vitest)](https://www.npmjs.com/package/vitest)       | 测试框架      |
| [tsc-alias](https://github.com/justkey007/tsc-alias) | [![npm](https://img.shields.io/npm/v/tsc-alias)](https://www.npmjs.com/package/tsc-alias) | 补全`.js`后缀 |

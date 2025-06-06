# aomex

流畅的 node.js 框架

[![node version](https://img.shields.io/node/v/%40aomex%2Fcommon?logo=node.js)](https://nodejs.org)
[![npm peer typescript version](https://img.shields.io/npm/dependency-version/%40aomex%2Fcommon/peer/typescript?logo=typescript)](https://github.com/microsoft/TypeScript)
[![GitHub Workflow Status (lint)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/lint.yml?branch=main&label=lint&logo=eslint)](https://github.com/aomex/aomex/actions/workflows/lint.yml)
[![GitHub Workflow Status (test)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/test.yml?branch=main&label=test&logo=vitest)](https://github.com/aomex/aomex/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/aomex/aomex?logo=codecov)](https://codecov.io/gh/aomex/aomex)
[![License](https://img.shields.io/github/license/aomex/aomex?logo=open-source-initiative)](https://github.com/aomex/aomex/blob/main/LICENSE)

# 特性

- HTTP接口
- 终端指令
- 中间件
- 数据验证
- 日志
- 缓存
- i18n
- 定时任务

# 安装

使用脚手架一键安装

```bash
npx create-aomex@latest
```

# 应用平台

| Name                          | Version                                                                                             | Desc           |
| ----------------------------- | --------------------------------------------------------------------------------------------------- | -------------- |
| [web](./packages/web)         | [![npm](https://img.shields.io/npm/v/@aomex/web)](https://www.npmjs.com/package/@aomex/web)         | web接口服务    |
| [console](./packages/console) | [![npm](https://img.shields.io/npm/v/@aomex/console)](https://www.npmjs.com/package/@aomex/console) | 控制台指令服务 |

# 核心库

| Name                                      | Version                                                                                                         | Platform    | Desc                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------- | -------------------- |
| [compress](./packages/compress)           | [![npm](https://img.shields.io/npm/v/@aomex/compress)](https://www.npmjs.com/package/@aomex/compress)           | web         | 压缩响应内容         |
| [cors](./packages/cors)                   | [![npm](https://img.shields.io/npm/v/@aomex/cors)](https://www.npmjs.com/package/@aomex/cors)                   | web         | 跨域请求共享         |
| [http-logger](./packages/http-logger)     | [![npm](https://img.shields.io/npm/v/@aomex/http-logger)](https://www.npmjs.com/package/@aomex/http-logger)     | web         | http请求日志         |
| [helmet](./packages/helmet)               | [![npm](https://img.shields.io/npm/v/@aomex/helmet)](https://www.npmjs.com/package/@aomex/helmet)               | web         | 设置安全报文         |
| [pretty-json](./packages/pretty-json)     | [![npm](https://img.shields.io/npm/v/@aomex/pretty-json)](https://www.npmjs.com/package/@aomex/pretty-json)     | web         | 美化响应输出         |
| [serve-static](./packages/serve-static)   | [![npm](https://img.shields.io/npm/v/@aomex/serve-static)](https://www.npmjs.com/package/@aomex/serve-static)   | web         | 静态文件服务         |
| [response-time](./packages/response-time) | [![npm](https://img.shields.io/npm/v/@aomex/response-time)](https://www.npmjs.com/package/@aomex/response-time) | web         | 设置服务响应时长报文 |
| [rate-limit](./packages/rate-limit)       | [![npm](https://img.shields.io/npm/v/@aomex/rate-limit)](https://www.npmjs.com/package/@aomex/rate-limit)       | web         | 请求限速             |
| [etag](./packages/etag)                   | [![npm](https://img.shields.io/npm/v/@aomex/etag)](https://www.npmjs.com/package/@aomex/etag)                   | web         | 设置etag报文         |
| [cron](./packages/cron)                   | [![npm](https://img.shields.io/npm/v/@aomex/cron)](https://www.npmjs.com/package/@aomex/cron)                   | console     | 定时任务             |
| [async-trace](./packages/async-trace)     | [![npm](https://img.shields.io/npm/v/@aomex/async-trace)](https://www.npmjs.com/package/@aomex/async-trace)     | web/console | 异步逻辑链路追踪     |

# 缓存

| Name                                                  | Version                                                                                                                     | Desc        |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------- |
| [cache](./packages/cache)                             | [![npm](https://img.shields.io/npm/v/@aomex/cache)](https://www.npmjs.com/package/@aomex/cache)                             | 缓存库入口  |
| [cache-redis-adapter](./packages/cache-redis-adapter) | [![npm](https://img.shields.io/npm/v/@aomex/cache-redis-adapter)](https://www.npmjs.com/package/@aomex/cache-redis-adapter) | redis适配器 |

# 文档服务

| Name                                                    | Version                                                                                                   | Desc                                                   |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| [openapi](./packages/openapi)                           | [![npm](https://img.shields.io/npm/v/@aomex/openapi)](https://www.npmjs.com/package/@aomex/openapi)       | 根据接口生成 openapi{.json,.yaml} 文件                 |
| [foca-openapi](https://github.com/foca-js/foca-openapi) | [![npm](https://img.shields.io/npm/v/foca-openapi)](https://www.npmjs.com/package/foca-openapi)           | 根据 openapi{.json,.yaml} 文件生成Typescript请求客户端 |
| [swagger-ui](./packages/swagger-ui)                     | [![npm](https://img.shields.io/npm/v/@aomex/swagger-ui)](https://www.npmjs.com/package/@aomex/swagger-ui) | swagger文档渲染网页                                    |
| [redoc-ui](./packages/redoc-ui)                         | [![npm](https://img.shields.io/npm/v/@aomex/redoc-ui)](https://www.npmjs.com/package/@aomex/redoc-ui)     | redoc文档渲染网页                                      |

# 身份认证

| Name                                                    | Version                                                                                                                       | Desc                |
| ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| [auth](./packages/auth)                                 | [![npm](https://img.shields.io/npm/v/@aomex/auth)](https://www.npmjs.com/package/@aomex/auth)                                 | 身份认证统一入口    |
| [auth-bearer-strategy](./packages/auth-bearer-strategy) | [![npm](https://img.shields.io/npm/v/@aomex/auth-bearer-strategy)](https://www.npmjs.com/package/@aomex/auth-bearer-strategy) | Bearer Token 方案   |
| [auth-jwt-strategy](./packages/auth-jwt-strategy)       | [![npm](https://img.shields.io/npm/v/@aomex/auth-jwt-strategy)](https://www.npmjs.com/package/@aomex/auth-jwt-strategy)       | Json Web Token 方案 |

# 第三方搭配

| Name                                                 | Version                                                                                   | Desc                                |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| [tsx](https://github.com/privatenumber/tsx)          | [![npm](https://img.shields.io/npm/v/tsx)](https://www.npmjs.com/package/tsx)             | 执行 TS 文件                        |
| [prisma](https://github.com/prisma/prisma)           | [![npm](https://img.shields.io/npm/v/prisma)](https://www.npmjs.com/package/prisma)       | 数据库 ORM                          |
| [mongoose](https://github.com/Automattic/mongoose)   | [![npm](https://img.shields.io/npm/v/mongoose)](https://www.npmjs.com/package/mongoose)   | 数据库 ORM                          |
| [vitest](https://github.com/vitest-dev/vitest)       | [![npm](https://img.shields.io/npm/v/vitest)](https://www.npmjs.com/package/vitest)       | 测试框架                            |
| [tsc-alias](https://github.com/justkey007/tsc-alias) | [![npm](https://img.shields.io/npm/v/tsc-alias)](https://www.npmjs.com/package/tsc-alias) | 补全`.js`后缀                       |
| [volta](https://volta.sh/)                           |                                                                                           | 不同项目自动切换node和pnpm/yarn版本 |

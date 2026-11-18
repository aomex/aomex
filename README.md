# aomex

类型安全的 Node.js 框架。同一套中间件，同时写 Web 与 Console。

文档：https://aomex.js.org

![node version](https://img.shields.io/node/v/%40aomex%2Fcommon?logo=node.js)
![npm peer typescript version](https://img.shields.io/npm/dependency-version/%40aomex%2Fcommon/peer/typescript?logo=typescript)
![GitHub Workflow Status (lint)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/lint.yml?branch=main&label=lint&logo=eslint)
![GitHub Workflow Status (test)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/test.yml?branch=main&label=test&logo=vitest)
![Codecov](https://img.shields.io/codecov/c/github/aomex/aomex?logo=codecov)
![License](https://img.shields.io/github/license/aomex/aomex?logo=open-source-initiative)

# 特性

- **TypeScript 贯穿**：路由参数、请求体、中间件上下文到业务代码，类型可推导、可跳转
- **同一套中间件模型**：Web HTTP 与 Console 指令共用组合与挂载方式
- **开箱能力**：校验、鉴权、缓存、日志出口、限流、压缩、CORS、OpenAPI 等按需安装
- **定时与运维**：Cron 调度、访问日志、异步链路追踪，和业务服务生命周期对齐
- **i18n**：错误与文案可多语言，框架内置能力同样走语言包

# 安装

使用脚手架一键安装

```bash
npx create-aomex@latest
```

# 应用平台

| Name                          | Version                                             | Desc           |
| ----------------------------- | --------------------------------------------------- | -------------- |
| [web](./packages/web)         | ![npm](https://img.shields.io/npm/v/@aomex/web)     | Web 接口服务   |
| [console](./packages/console) | ![npm](https://img.shields.io/npm/v/@aomex/console) | 控制台指令服务 |

# 中间件

| Name                                                        | Version                                                            | Platform    | Desc                 |
| ----------------------------------------------------------- | ------------------------------------------------------------------ | ----------- | -------------------- |
| [compress](./packages/compress)                             | ![npm](https://img.shields.io/npm/v/@aomex/compress)               | web         | 压缩响应内容         |
| [cors](./packages/cors)                                     | ![npm](https://img.shields.io/npm/v/@aomex/cors)                   | web         | 跨域请求共享         |
| [helmet](./packages/helmet)                                 | ![npm](https://img.shields.io/npm/v/@aomex/helmet)                 | web         | 设置安全报文         |
| [pretty-json](./packages/pretty-json)                       | ![npm](https://img.shields.io/npm/v/@aomex/pretty-json)            | web         | 美化响应输出         |
| [serve-static](./packages/serve-static)                     | ![npm](https://img.shields.io/npm/v/@aomex/serve-static)           | web         | 静态文件服务         |
| [response-time](./packages/response-time)                   | ![npm](https://img.shields.io/npm/v/@aomex/response-time)          | web         | 设置服务响应时长报文 |
| [rate-limit](./packages/rate-limit)                         | ![npm](https://img.shields.io/npm/v/@aomex/rate-limit)             | web         | 请求限速             |
| [rate-limit-redis-store](./packages/rate-limit-redis-store) | ![npm](https://img.shields.io/npm/v/@aomex/rate-limit-redis-store) | web         | 请求限速 Redis 存储  |
| [etag](./packages/etag)                                     | ![npm](https://img.shields.io/npm/v/@aomex/etag)                   | web         | 设置 etag 报文       |
| [cron](./packages/cron)                                     | ![npm](https://img.shields.io/npm/v/@aomex/cron)                   | console     | 定时任务             |
| [async-trace](./packages/async-trace)                       | ![npm](https://img.shields.io/npm/v/@aomex/async-trace)            | web/console | 异步逻辑链路追踪     |

# 日志

| Name                                          | Version                                                     | Desc               |
| --------------------------------------------- | ----------------------------------------------------------- | ------------------ |
| [logger](./packages/logger)                   | ![npm](https://img.shields.io/npm/v/@aomex/logger)          | 日志服务与内置出口 |
| [logger-sentry](./packages/logger-sentry)     | ![npm](https://img.shields.io/npm/v/@aomex/logger-sentry)   | Sentry 出口        |
| [logger-telegram](./packages/logger-telegram) | ![npm](https://img.shields.io/npm/v/@aomex/logger-telegram) | Telegram Bot 出口  |
| [http-access-log](./packages/http-access-log) | ![npm](https://img.shields.io/npm/v/@aomex/http-access-log) | HTTP 访问日志      |

# 缓存

| Name                                                                  | Version                                                         | Desc         |
| --------------------------------------------------------------------- | --------------------------------------------------------------- | ------------ |
| [cache](./packages/cache)                                             | ![npm](https://img.shields.io/npm/v/@aomex/cache)               | 缓存服务     |
| [cache-memory](./packages/cache/src/adapters/cache-memory-adapter.ts) | `@aomex/cache/memory`                                           | 内存适配器   |
| [cache-file](./packages/cache/src/adapters/cache-file-adapter.ts)     | `@aomex/cache/file`                                             | 文件适配器   |
| [cache-redis](./packages/cache-redis-adapter)                         | ![npm](https://img.shields.io/npm/v/@aomex/cache-redis-adapter) | Redis 适配器 |

# 身份认证

| Name                                                                    | Version                                                       | Desc                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------- |
| [auth](./packages/auth)                                                 | ![npm](https://img.shields.io/npm/v/@aomex/auth)              | 身份认证统一入口    |
| [auth-bearer](./packages/auth/src/strategies/auth-bearer-strategy.ts)   | `@aomex/auth/bearer`                                          | Bearer Token 策略   |
| [auth-api-key](./packages/auth/src/strategies/auth-api-key-strategy.ts) | `@aomex/auth/api-key`                                         | API Key 策略        |
| [auth-jwt](./packages/auth-jwt-strategy)                                | ![npm](https://img.shields.io/npm/v/@aomex/auth-jwt-strategy) | Json Web Token 策略 |

# 文档

| Name                                                    | Version                                                | Desc                                                     |
| ------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------------- |
| [openapi](./packages/openapi)                           | ![npm](https://img.shields.io/npm/v/@aomex/openapi)    | 根据接口生成 openapi{.json,.yaml} 文件                   |
| [swagger-ui](./packages/swagger-ui)                     | ![npm](https://img.shields.io/npm/v/@aomex/swagger-ui) | swagger 文档渲染网页                                     |
| [redoc-ui](./packages/redoc-ui)                         | ![npm](https://img.shields.io/npm/v/@aomex/redoc-ui)   | redoc 文档渲染网页                                       |
| [scalar-ui](./packages/scalar-ui)                       | ![npm](https://img.shields.io/npm/v/@aomex/scalar-ui)  | scalar 文档渲染网页                                      |
| [foca-openapi](https://github.com/foca-js/foca-openapi) | ![npm](https://img.shields.io/npm/v/foca-openapi)      | 根据 openapi{.json,.yaml} 文件生成 TypeScript 请求客户端 |

# 数据

| Name                            | Version                                              | Desc                       |
| ------------------------------- | ---------------------------------------------------- | -------------------------- |
| [prisma](./packages/prisma)     | ![npm](https://img.shields.io/npm/v/@aomex/prisma)   | 从 Prisma 表结构生成验证器 |
| [mongoose](./packages/mongoose) | ![npm](https://img.shields.io/npm/v/@aomex/mongoose) | 与 mongoose 深度集成       |

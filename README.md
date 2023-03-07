# aomex

A fluent node.js framework, Inspired by [koa](https://github.com/koajs/koa) and [yii](https://github.com/yiisoft/yii2).

[![node version](https://img.shields.io/node/v/@aomex/core?logo=node.js)](https://nodejs.org)
[![npm peer typescript version](https://img.shields.io/npm/dependency-version/@aomex/core/peer/typescript?logo=typescript)](https://github.com/microsoft/TypeScript)
[![GitHub Workflow Status (lint)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/lint.yml?branch=main&label=lint&logo=eslint)](https://github.com/aomex/aomex/actions/workflows/lint.yml)
[![GitHub Workflow Status (test)](https://img.shields.io/github/actions/workflow/status/aomex/aomex/test.yml?branch=main&label=test&logo=vitest)](https://github.com/aomex/aomex/actions/workflows/test.yml)
[![Codecov](https://img.shields.io/codecov/c/github/aomex/aomex?logo=codecov)](https://codecov.io/gh/aomex/aomex)
[![License](https://img.shields.io/github/license/aomex/aomex?logo=open-source-initiative)](https://github.com/aomex/aomex/blob/main/LICENSE)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?logo=prettier)](https://github.com/prettier/prettier)

# Features

- Web server platform
- Console schedule platform
- Koa-like middleware
- Middleware manager - chain
- Data validator
- Openapi/Swagger document generator
- Cache engine
- Out-of-box TypeScript support

# Core packages

| Name                                 | Version                                                                                             | Description               |
| ------------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------- |
| [@aomex/core](./packages/core)       | [![npm](https://img.shields.io/npm/v/@aomex/core)](https://www.npmjs.com/package/@aomex/core)       | The base application      |
| [@aomex/web](./packages/web)         | [![npm](https://img.shields.io/npm/v/@aomex/web)](https://www.npmjs.com/package/@aomex/web)         | Web server platform       |
| [@aomex/console](./packages/console) | [![npm](https://img.shields.io/npm/v/@aomex/console)](https://www.npmjs.com/package/@aomex/console) | Console schedule platform |

# Middleware

| Name                                               | Version                                                                                                           | Platform |
| -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| [@aomex/web-router](./packages/web-router)         | [![npm](https://img.shields.io/npm/v/@aomex/web-router)](https://www.npmjs.com/package/@aomex/web-router)         | web      |
| [@aomex/compress](./packages/compress)             | [![npm](https://img.shields.io/npm/v/@aomex/compress)](https://www.npmjs.com/package/@aomex/compress)             | web      |
| [@aomex/cors](./packages/cors)                     | [![npm](https://img.shields.io/npm/v/@aomex/cors)](https://www.npmjs.com/package/@aomex/cors)                     | web      |
| [@aomex/jwt](./packages/jwt)                       | [![npm](https://img.shields.io/npm/v/@aomex/jwt)](https://www.npmjs.com/package/@aomex/jwt)                       | web      |
| [@aomex/logger](./packages/logger)                 | [![npm](https://img.shields.io/npm/v/@aomex/logger)](https://www.npmjs.com/package/@aomex/logger)                 | web      |
| [@aomex/helmet](./packages/helmet)                 | [![npm](https://img.shields.io/npm/v/@aomex/helmet)](https://www.npmjs.com/package/@aomex/helmet)                 | web      |
| [@aomex/pretty-json](./packages/pretty-json)       | [![npm](https://img.shields.io/npm/v/@aomex/pretty-json)](https://www.npmjs.com/package/@aomex/pretty-json)       | web      |
| [@aomex/response-time](./packages/response-time)   | [![npm](https://img.shields.io/npm/v/@aomex/response-time)](https://www.npmjs.com/package/@aomex/response-time)   | web      |
| [@aomex/rate-limit](./packages/rate-limit)         | [![npm](https://img.shields.io/npm/v/@aomex/rate-limit)](https://www.npmjs.com/package/@aomex/rate-limit)         | web      |
| [@aomex/etag](./packages/etag)                     | [![npm](https://img.shields.io/npm/v/@aomex/etag)](https://www.npmjs.com/package/@aomex/etag)                     | web      |
| [@aomex/console-router](./packages/console-router) | [![npm](https://img.shields.io/npm/v/@aomex/console-router)](https://www.npmjs.com/package/@aomex/console-router) | console  |
| [@aomex/openapi](./packages/openapi)               | [![npm](https://img.shields.io/npm/v/@aomex/openapi)](https://www.npmjs.com/package/@aomex/openapi)               | console  |
| [@aomex/cron](./packages/cron)                     | [![npm](https://img.shields.io/npm/v/@aomex/cron)](https://www.npmjs.com/package/@aomex/cron)                     | console  |
| [@aomex/redis-cache](./packages/redis-cache)       | [![npm](https://img.shields.io/npm/v/@aomex/redis-cache)](https://www.npmjs.com/package/@aomex/redis-cache)       | -        |
| [@aomex/ioredis-cache](./packages/ioredis-cache)   | [![npm](https://img.shields.io/npm/v/@aomex/ioredis-cache)](https://www.npmjs.com/package/@aomex/ioredis-cache)   | -        |

# Third recommended

| Name                                           | Version                                                                             | Description                |
| ---------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------- |
| [prisma](https://github.com/prisma/prisma)     | [![npm](https://img.shields.io/npm/v/prisma)](https://www.npmjs.com/package/prisma) | Next-generation ORM        |
| [vitest](https://github.com/vitest-dev/vitest) | [![npm](https://img.shields.io/npm/v/vitest)](https://www.npmjs.com/package/vitest) | Vite-native test framework |

# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.8.0](https://github.com/aomex/aomex/compare/v4.7.0...v4.8.0) (2026-11-26)

**Note:** Version bump only for package @aomex/web





# [4.7.0](https://github.com/aomex/aomex/compare/v4.6.0...v4.7.0) (2026-11-25)

### Features

* **logger:** 以 Logger 替代 BaseLoggerService，并统一 lifecycle 失败清门闩 ([6a750d3](https://github.com/aomex/aomex/commit/6a750d3af7068a5ff9805f6cc6549a0da0092bfd))


# [4.6.0](https://github.com/aomex/aomex/compare/v4.5.0...v4.6.0) (2026-11-24)

### Features

* **web,websocket:** 新增 Exact 类型并统一 slot/response/emit/formatError 出站精确匹配 ([cecde1f](https://github.com/aomex/aomex/commit/cecde1fb569b16f518d61efe3c66819622c533b3))
* **web:** envelope.slot 的 get 回调增加 ctx 入参 ([1b4ca75](https://github.com/aomex/aomex/commit/1b4ca756d4023ddd8bc5087dde80c7e18b69ca3e))


# [4.5.0](https://github.com/aomex/aomex/compare/v4.4.0...v4.5.0) (2026-11-24)

### Features

* **web:** 关停钩子与 Server 关闭并行 ([2fbf4b6](https://github.com/aomex/aomex/commit/2fbf4b6ef5ae4eb2f5451c1f6ac15b9f6466d423))


# [4.4.0](https://github.com/aomex/aomex/compare/v4.3.0...v4.4.0) (2026-11-22)

**Note:** Version bump only for package @aomex/web





# [4.3.0](https://github.com/aomex/aomex/compare/v4.2.0...v4.3.0) (2026-11-21)

**Note:** Version bump only for package @aomex/web





# [4.2.0](https://github.com/aomex/aomex/compare/v4.1.0...v4.2.0) (2026-11-20)

### Features

* **auth:** 新增 Cookie Session 认证策略 ([9f31c1d](https://github.com/aomex/aomex/commit/9f31c1d591d3fe670d6c3d45c36bedbef595f9ce))
* **web:** 增强 HttpError header支持，允许 Set-Cookie 数组类型 ([80b4971](https://github.com/aomex/aomex/commit/80b49713a08a68ae8c190ac9ea3020b83250450f))


# [4.1.0](https://github.com/aomex/aomex/compare/v4.0.0...v4.1.0) (2026-11-18)

### Bug Fixes

* **web:** 删除响应中的ETag头以确保内容一致性 ([b539c15](https://github.com/aomex/aomex/commit/b539c159192361dcc434c2d4a5bfb5e4ea5b1efa))
* **web:** 统一套壳时有部分场景会把JSON当成字符串填充 ([d5bac04](https://github.com/aomex/aomex/commit/d5bac04039691423f6c336fac8e5e21d87774e30))

### Features

* **web:** 支持 skipEnvelope 跳过响应套壳 ([738bd27](https://github.com/aomex/aomex/commit/738bd271255230a63a0e9d60ee848b1da281fbd3))


# [4.0.0](https://github.com/aomex/aomex/compare/v3.30.7...v4.0.0) (2026-11-17)

* chore!: 升级依赖至最新 ([9a679fa](https://github.com/aomex/aomex/commit/9a679faf0a4e2b313e8ce9081c1ecc65356b844c))
* feat(service)!: 服务改为懒加载代理 ([6e68e80](https://github.com/aomex/aomex/commit/6e68e80ffc33ff3cdc11216bbdb50badaf485566))
* feat(prisma)!: 生成 schema 并通过 definePrismaSchema 作为唯一业务入口 ([7dad8a4](https://github.com/aomex/aomex/commit/7dad8a478eaf3a9b4953aca19c5a2294986a7e36))
* chore!: 升级至 TypeScript 7 并将构建工具迁移到 tsdown ([a111409](https://github.com/aomex/aomex/commit/a111409021e2ee81ee5fb20ccc75480c9b5fa4c0))

### Bug Fixes

* **web:** 升级 path-to-regexp 到 8.4.2 以修复潜在漏洞 ([a0ac817](https://github.com/aomex/aomex/commit/a0ac8173d8a477b36d322f15ab8ee6134e50ed7e))
* **web:** 补充法语语言包字段 ([e668d44](https://github.com/aomex/aomex/commit/e668d4458ca04c3dbb4ca135f45f40e152dcc80f))
* **web:** 请求响应后未及时清理上传的附件 ([f06d3e6](https://github.com/aomex/aomex/commit/f06d3e6245cf96a4e01fbe46d61aa61b6b7682da))
* **web:** 限制 multipart 上传文件数量并拒绝空文件 ([058a285](https://github.com/aomex/aomex/commit/058a285a85b12f4d1bc9a3cec426413a143e910d))

### Features

* **middleware:** 新增 dependsOn 借用上游中间件类型提示 ([8066ac0](https://github.com/aomex/aomex/commit/8066ac0a92bf740e17f75a2c39033c9ff807eefb))
* **validator:** schema 增加 required 方法 ([003745d](https://github.com/aomex/aomex/commit/003745d655b955d951190a5bac45d189a51ef863))
* **validator:** 抽出 toDocument 并为 object schema 写入 x-ref ([3dceddc](https://github.com/aomex/aomex/commit/3dceddc675eb9c15ab96794fbea744ab95d1576a))
* **validator:** 新增 Validator.has 探测是否包含指定验证器 ([6dc867c](https://github.com/aomex/aomex/commit/6dc867c78cda9fca7f760398f0290870ab13800c))
* **validator:** 规则允许深度嵌套对象字面量 ([356495c](https://github.com/aomex/aomex/commit/356495cf73c0954986351bfb3f5e625f7f8fd6ff))
* **validator:** 验证器规则入口支持传入schema ([7f0be2e](https://github.com/aomex/aomex/commit/7f0be2e027ad8e527989850ca331cde1d31830e0))
* **web:** body中间件允许验证基础数据类型 ([b7d44f4](https://github.com/aomex/aomex/commit/b7d44f40b317d7e72bdc2737c11e0453956daa5d))
* **web:** multipart 按校验器收紧上传配额，并以文件签名校验类型 ([c29a331](https://github.com/aomex/aomex/commit/c29a331231f0f90984da87475e3be69cf78423cc))
* **web:** webApp 退出时支持超时强制断开 ([cba07c3](https://github.com/aomex/aomex/commit/cba07c3345a6e6604e3bfd898dfe147d89621857))
* **web:** 传参中间件支持传入schema ([9534123](https://github.com/aomex/aomex/commit/953412380e6b9a6d01954e737371b94a5b50887c))
* **web:** 修改下载方法以返回 Promise，确保响应结束后清理临时文件 ([59eb9ee](https://github.com/aomex/aomex/commit/59eb9eeafb13cae06864deb75ed3b07184badee0))
* **web:** 响应支持SSE消息类型 ([ffbcf87](https://github.com/aomex/aomex/commit/ffbcf875b5d88270bb22b556fd0f75e49241e052))
* **web:** 引入 formatError 中间件响应异常内容 ([9adec57](https://github.com/aomex/aomex/commit/9adec5751648635332528871ef9570dd40e38805))
* **web:** 新增响应体套壳 envelope，统一为 HTTP 200 与声明式结构 ([e691a27](https://github.com/aomex/aomex/commit/e691a2725811149302c9c51a95d608eda94a7bef))
* **web:** 添加 clusterListen 函数以支持多进程监听端口 ([1030873](https://github.com/aomex/aomex/commit/1030873adbdb28d13ef27dece6ca109328843ae2))
* **web:** 添加客户端 IP 解析支持，允许配置代理头和跳转层数 ([9f94acd](https://github.com/aomex/aomex/commit/9f94acd62f8e90ff8aa2dc5f81202dfdfbf4a5b6))

### BREAKING CHANGES

* `destroyServices` 改为内部 API
* combineServices 仅接受 `() => import(...)` 工厂，不再直接传 Class
* mongoose 最低版本为v9
* Node.js 最低版本提升至 `>=24.0.0`。
* 最低 TypeScript 版本为 7。
* 对外服务方法一律返回 Promise；字段不再对外暴露
* 服务生命周期 `init`/`destroy` 重命名为 `onInit`/`onDestroy`
* 移除 Service 构造注入的 `services`，类内互调改为直接 import
* 请改用 definePrismaSchema(generated) 获取 prismaInput/prismaOutput/prismaEnum


## [3.30.7](https://github.com/aomex/aomex/compare/v3.30.6...v3.30.7) (2026-11-01)

**Note:** Version bump only for package @aomex/web





## [3.30.6](https://github.com/aomex/aomex/compare/v3.30.5...v3.30.6) (2026-10-19)

**Note:** Version bump only for package @aomex/web





## [3.30.5](https://github.com/aomex/aomex/compare/v3.30.4...v3.30.5) (2026-06-16)

**Note:** Version bump only for package @aomex/web





## [3.30.4](https://github.com/aomex/aomex/compare/v3.30.3...v3.30.4) (2026-01-21)

**Note:** Version bump only for package @aomex/web





## [3.30.3](https://github.com/aomex/aomex/compare/v3.30.2...v3.30.3) (2025-12-01)

**Note:** Version bump only for package @aomex/web





## [3.30.2](https://github.com/aomex/aomex/compare/v3.30.1...v3.30.2) (2025-12-01)

**Note:** Version bump only for package @aomex/web





## [3.30.1](https://github.com/aomex/aomex/compare/v3.30.0...v3.30.1) (2025-12-01)

**Note:** Version bump only for package @aomex/web





# [3.30.0](https://github.com/aomex/aomex/compare/v3.29.2...v3.30.0) (2025-11-30)

**Note:** Version bump only for package @aomex/web





## [3.29.2](https://github.com/aomex/aomex/compare/v3.29.1...v3.29.2) (2025-08-25)


### Bug Fixes

* **web:** 请求体限制从1mb增加到32mb ([dc38862](https://github.com/aomex/aomex/commit/dc38862f57548f7211b6ba7bf9b0a60333c9c346))





## [3.29.1](https://github.com/aomex/aomex/compare/v3.29.0...v3.29.1) (2025-07-26)

**Note:** Version bump only for package @aomex/web





# [3.29.0](https://github.com/aomex/aomex/compare/v3.28.3...v3.29.0) (2025-07-17)

**Note:** Version bump only for package @aomex/web





## [3.28.3](https://github.com/aomex/aomex/compare/v3.28.2...v3.28.3) (2025-07-10)

**Note:** Version bump only for package @aomex/web





## [3.28.2](https://github.com/aomex/aomex/compare/v3.28.1...v3.28.2) (2025-07-09)


### Bug Fixes

* **web:** 上传文件指定后缀名为媒体类型时无法正确识别 ([574a3df](https://github.com/aomex/aomex/commit/574a3df76d773bd131f6d5cae8506e4a9e580f92))





## [3.28.1](https://github.com/aomex/aomex/compare/v3.28.0...v3.28.1) (2025-07-08)

**Note:** Version bump only for package @aomex/web





# [3.28.0](https://github.com/aomex/aomex/compare/v3.27.4...v3.28.0) (2025-07-08)

**Note:** Version bump only for package @aomex/web





## [3.27.4](https://github.com/aomex/aomex/compare/v3.27.3...v3.27.4) (2025-06-29)

**Note:** Version bump only for package @aomex/web





## [3.27.3](https://github.com/aomex/aomex/compare/v3.27.2...v3.27.3) (2025-06-29)

**Note:** Version bump only for package @aomex/web





## [3.27.2](https://github.com/aomex/aomex/compare/v3.27.1...v3.27.2) (2025-06-04)

**Note:** Version bump only for package @aomex/web





## [3.27.1](https://github.com/aomex/aomex/compare/v3.27.0...v3.27.1) (2025-05-22)

**Note:** Version bump only for package @aomex/web





# [3.27.0](https://github.com/aomex/aomex/compare/v3.26.0...v3.27.0) (2025-05-03)

**Note:** Version bump only for package @aomex/web





# [3.26.0](https://github.com/aomex/aomex/compare/v3.25.0...v3.26.0) (2025-05-03)

**Note:** Version bump only for package @aomex/web





# [3.25.0](https://github.com/aomex/aomex/compare/v3.24.0...v3.25.0) (2025-04-22)

**Note:** Version bump only for package @aomex/web





# [3.24.0](https://github.com/aomex/aomex/compare/v3.23.3...v3.24.0) (2025-04-20)

**Note:** Version bump only for package @aomex/web





## [3.23.3](https://github.com/aomex/aomex/compare/v3.23.2...v3.23.3) (2025-04-18)

**Note:** Version bump only for package @aomex/web





## [3.23.2](https://github.com/aomex/aomex/compare/v3.23.1...v3.23.2) (2025-04-18)

**Note:** Version bump only for package @aomex/web





## [3.23.1](https://github.com/aomex/aomex/compare/v3.23.0...v3.23.1) (2025-04-18)

**Note:** Version bump only for package @aomex/web





# [3.23.0](https://github.com/aomex/aomex/compare/v3.22.0...v3.23.0) (2025-04-16)

**Note:** Version bump only for package @aomex/web





# [3.22.0](https://github.com/aomex/aomex/compare/v3.21.1...v3.22.0) (2025-04-07)

**Note:** Version bump only for package @aomex/web





## [3.21.1](https://github.com/aomex/aomex/compare/v3.21.0...v3.21.1) (2025-04-06)

**Note:** Version bump only for package @aomex/web





# [3.21.0](https://github.com/aomex/aomex/compare/v3.20.0...v3.21.0) (2025-04-06)

**Note:** Version bump only for package @aomex/web





# [3.20.0](https://github.com/aomex/aomex/compare/v3.19.2...v3.20.0) (2025-04-05)

**Note:** Version bump only for package @aomex/web





## [3.19.2](https://github.com/aomex/aomex/compare/v3.19.1...v3.19.2) (2025-04-05)

**Note:** Version bump only for package @aomex/web





## [3.19.1](https://github.com/aomex/aomex/compare/v3.19.0...v3.19.1) (2025-04-05)

**Note:** Version bump only for package @aomex/web





# [3.19.0](https://github.com/aomex/aomex/compare/v3.18.0...v3.19.0) (2025-04-05)

**Note:** Version bump only for package @aomex/web





# [3.18.0](https://github.com/aomex/aomex/compare/v3.17.3...v3.18.0) (2025-04-03)

**Note:** Version bump only for package @aomex/web





## [3.17.3](https://github.com/aomex/aomex/compare/v3.17.2...v3.17.3) (2025-03-26)


### Bug Fixes

* 内部依赖使用固定版本号 ([aa70c2a](https://github.com/aomex/aomex/commit/aa70c2ad444414ec6619b9579ad8037a7191a86f))





## [3.17.2](https://github.com/aomex/aomex/compare/v3.17.1...v3.17.2) (2025-03-26)

**Note:** Version bump only for package @aomex/web





## [3.17.1](https://github.com/aomex/aomex/compare/v3.17.0...v3.17.1) (2025-03-09)

**Note:** Version bump only for package @aomex/web





# [3.17.0](https://github.com/aomex/aomex/compare/v3.16.0...v3.17.0) (2025-03-09)

**Note:** Version bump only for package @aomex/web





# [3.16.0](https://github.com/aomex/aomex/compare/v3.15.1...v3.16.0) (2025-03-09)

**Note:** Version bump only for package @aomex/web





## [3.15.1](https://github.com/aomex/aomex/compare/v3.15.0...v3.15.1) (2025-02-09)

**Note:** Version bump only for package @aomex/web





# [3.15.0](https://github.com/aomex/aomex/compare/v3.14.2...v3.15.0) (2025-02-09)

**Note:** Version bump only for package @aomex/web





## [3.14.2](https://github.com/aomex/aomex/compare/v3.14.1...v3.14.2) (2025-01-14)

**Note:** Version bump only for package @aomex/web





## [3.14.1](https://github.com/aomex/aomex/compare/v3.14.0...v3.14.1) (2025-01-09)


### Bug Fixes

* **web:** 内置的querystring字符串无法解析数组 ([27fed26](https://github.com/aomex/aomex/commit/27fed26f4e81d7182bcc0aee8142923cb0380732))





# [3.14.0](https://github.com/aomex/aomex/compare/v3.13.1...v3.14.0) (2025-01-02)

**Note:** Version bump only for package @aomex/web





## [3.13.1](https://github.com/aomex/aomex/compare/v3.13.0...v3.13.1) (2024-12-29)

**Note:** Version bump only for package @aomex/web





# [3.13.0](https://github.com/aomex/aomex/compare/v3.12.1...v3.13.0) (2024-12-27)


### Bug Fixes

* **web:** response未设置content时需省略运行时body参数 ([402c7e2](https://github.com/aomex/aomex/commit/402c7e2ca2a479ccee2f0baf0953a9b325ea3247))
* **web:** 打印错误日志时误删错误栈信息 ([58328ed](https://github.com/aomex/aomex/commit/58328ed806ff5df0b35832751ca6d4f1f84595e2))





## [3.12.1](https://github.com/aomex/aomex/compare/v3.12.0...v3.12.1) (2024-12-19)

**Note:** Version bump only for package @aomex/web





# [3.12.0](https://github.com/aomex/aomex/compare/v3.11.0...v3.12.0) (2024-11-07)

**Note:** Version bump only for package @aomex/web





# [3.11.0](https://github.com/aomex/aomex/compare/v3.10.0...v3.11.0) (2024-11-07)

**Note:** Version bump only for package @aomex/web





# [3.10.0](https://github.com/aomex/aomex/compare/v3.9.0...v3.10.0) (2024-11-02)

**Note:** Version bump only for package @aomex/web





# [3.9.0](https://github.com/aomex/aomex/compare/v3.8.1...v3.9.0) (2024-10-30)

**Note:** Version bump only for package @aomex/web





## [3.8.1](https://github.com/aomex/aomex/compare/v3.8.0...v3.8.1) (2024-10-26)


### Bug Fixes

* **core:** 验证器哈希表复合类型丢失 ([f280f3f](https://github.com/aomex/aomex/commit/f280f3f4ba1ef70ed7c612d422d22b1982f4d762))





# [3.8.0](https://github.com/aomex/aomex/compare/v3.7.2...v3.8.0) (2024-10-26)

**Note:** Version bump only for package @aomex/web





## [3.7.2](https://github.com/aomex/aomex/compare/v3.7.1...v3.7.2) (2024-10-22)


### Performance Improvements

* **core:** 字面量对象验证器也共享问号修饰符 ([b21e6f3](https://github.com/aomex/aomex/commit/b21e6f3806f525cf5030cd32aab2cac5cfe87da6))





## [3.7.1](https://github.com/aomex/aomex/compare/v3.7.0...v3.7.1) (2024-10-22)

**Note:** Version bump only for package @aomex/web





# [3.7.0](https://github.com/aomex/aomex/compare/v3.6.0...v3.7.0) (2024-10-19)


### Bug Fixes

* **web:** setHeaders是node.js内置方法 ([e53d569](https://github.com/aomex/aomex/commit/e53d5699cd24d5e8dba330eba224ff00853bca1b))


### Features

* **core:** 对象验证器支持动态字段 ([f189415](https://github.com/aomex/aomex/commit/f189415ca0fa65d0f61a279ed0a06cb47bcd67dd))





# [3.6.0](https://github.com/aomex/aomex/compare/v3.5.0...v3.6.0) (2024-10-17)

**Note:** Version bump only for package @aomex/web





# [3.5.0](https://github.com/aomex/aomex/compare/v3.4.2...v3.5.0) (2024-10-16)

**Note:** Version bump only for package @aomex/web





## [3.4.2](https://github.com/aomex/aomex/compare/v3.4.1...v3.4.2) (2024-10-07)

**Note:** Version bump only for package @aomex/web





## [3.4.1](https://github.com/aomex/aomex/compare/v3.4.0...v3.4.1) (2024-10-06)

**Note:** Version bump only for package @aomex/web





# [3.4.0](https://github.com/aomex/aomex/compare/v3.3.0...v3.4.0) (2024-10-04)


### Features

* **web:** request暴露headers和rawHeaders属性 ([3f15488](https://github.com/aomex/aomex/commit/3f154882429860c1a6100194c9d42af40f077728))





# [3.3.0](https://github.com/aomex/aomex/compare/v3.2.4...v3.3.0) (2024-09-26)

**Note:** Version bump only for package @aomex/web





## [3.2.4](https://github.com/aomex/aomex/compare/v3.2.3...v3.2.4) (2024-09-25)


### Bug Fixes

* **web:** 设置单个i18n语言没有意义 ([2e1b977](https://github.com/aomex/aomex/commit/2e1b977f4d496850662ea76de00c42367ea429f8))





## [3.2.3](https://github.com/aomex/aomex/compare/v3.2.2...v3.2.3) (2024-09-25)

**Note:** Version bump only for package @aomex/web





## [3.2.2](https://github.com/aomex/aomex/compare/v3.2.1...v3.2.2) (2024-09-19)

**Note:** Version bump only for package @aomex/web





## [3.2.1](https://github.com/aomex/aomex/compare/v3.2.0...v3.2.1) (2024-09-17)

**Note:** Version bump only for package @aomex/web





# [3.2.0](https://github.com/aomex/aomex/compare/v3.1.1...v3.2.0) (2024-09-17)

**Note:** Version bump only for package @aomex/web





## [3.1.1](https://github.com/aomex/aomex/compare/v3.1.0...v3.1.1) (2024-09-13)

**Note:** Version bump only for package @aomex/web





# [3.1.0](https://github.com/aomex/aomex/compare/v3.0.0...v3.1.0) (2024-09-13)


### Bug Fixes

* update peer deps ([98b7c10](https://github.com/aomex/aomex/commit/98b7c10068a3c62a0361b1b43a86728a7d445ab5))






# [2.2.0](https://github.com/aomex/aomex/compare/v2.1.0...v2.2.0) (2024-08-05)

**Note:** Version bump only for package @aomex/web





# [2.1.0](https://github.com/aomex/aomex/compare/v2.0.2...v2.1.0) (2024-07-28)

**Note:** Version bump only for package @aomex/web





## [2.0.2](https://github.com/aomex/aomex/compare/v2.0.1...v2.0.2) (2024-07-27)

**Note:** Version bump only for package @aomex/web





## [2.0.1](https://github.com/aomex/aomex/compare/v2.0.0...v2.0.1) (2024-07-26)


### Bug Fixes

* 未更新peerDependencies ([0492453](https://github.com/aomex/aomex/commit/0492453d5a748aa6dd2047622a19a86dc7b6036e))





# [2.0.0](https://github.com/aomex/aomex/compare/v1.7.0...v2.0.0) (2024-07-26)


### Features

* **web:** router库合并到web库 ([7268973](https://github.com/aomex/aomex/commit/72689738b9a7eb1eb77c9b0bb651d47e58ed5532))


### BREAKING CHANGES

* **web:** @aomex/router已被删除





# [1.7.0](https://github.com/aomex/aomex/compare/v1.6.0...v1.7.0) (2024-07-13)


### Features

* **web:** 请求实体包含二进制类型时，采用multipart/form-data的文档格式 ([59f5c74](https://github.com/aomex/aomex/commit/59f5c74b2a4e23599042eb8f9ead860a10436298))





# [1.6.0](https://github.com/aomex/aomex/compare/v1.5.1...v1.6.0) (2024-07-05)


### Features

* **web:** response.download修改签名 ([849b150](https://github.com/aomex/aomex/commit/849b1509f8eee7687189339ee4b77588f6451890))





## [1.5.1](https://github.com/aomex/aomex/compare/v1.5.0...v1.5.1) (2024-07-04)

**Note:** Version bump only for package @aomex/web





# [1.5.0](https://github.com/aomex/aomex/compare/v1.4.0...v1.5.0) (2024-07-04)


### Features

* **web:** request.body改为同步获取 ([bbc2075](https://github.com/aomex/aomex/commit/bbc207535cb97ebb8e928ca07f8d51056259cfd2))





# [1.4.0](https://github.com/aomex/aomex/compare/v1.3.0...v1.4.0) (2024-06-29)


### Features

* **web:** 开启debug时如实响应5xx错误信息 ([f6b0c82](https://github.com/aomex/aomex/commit/f6b0c82bf1123962e0848fc89c7179f0656c20fa))





# [1.3.0](https://github.com/aomex/aomex/compare/v1.2.0...v1.3.0) (2024-06-28)


### Bug Fixes

* 打包时遇到类型报错 ([486f4e5](https://github.com/aomex/aomex/commit/486f4e56fa663dba757c0f3a5fb7e37210f03ab8))


### Features

* **core:** 删除中间件链条概念 ([12f42e6](https://github.com/aomex/aomex/commit/12f42e6ba15f3118b98f5ff31832121b1b2b9896))





# [1.2.0](https://github.com/aomex/aomex/compare/v1.1.0...v1.2.0) (2024-06-27)

**Note:** Version bump only for package @aomex/web





# 1.1.0 (2024-06-27)


### Features

* 初始化 ([3350159](https://github.com/aomex/aomex/commit/3350159454ad230e6d910405f907293b059b1f49))

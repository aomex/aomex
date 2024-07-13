# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [1.7.0](https://github.com/aomex/aomex/compare/v1.6.0...v1.7.0) (2024-07-13)


### Features

* **async-trace:** traceMiddleware的记录回调函数增加ctx参数 ([7fbf5db](https://github.com/aomex/aomex/commit/7fbf5db76e6bf425c5d390bd1ede47c6d03600dc))
* **web:** 请求实体包含二进制类型时，采用multipart/form-data的文档格式 ([59f5c74](https://github.com/aomex/aomex/commit/59f5c74b2a4e23599042eb8f9ead860a10436298))





# [1.6.0](https://github.com/aomex/aomex/compare/v1.5.1...v1.6.0) (2024-07-05)


### Features

* **async-trace:** 追踪方法时允许不传参数 ([9aecbb4](https://github.com/aomex/aomex/commit/9aecbb4e88e20e58a26d8227e4fc98e1448ec998))
* **router:** 删除路径数组格式 ([f9a9a00](https://github.com/aomex/aomex/commit/f9a9a0022cbf387acc9d96d78d05019511046986))
* **web:** response.download修改签名 ([849b150](https://github.com/aomex/aomex/commit/849b1509f8eee7687189339ee4b77588f6451890))


### Performance Improvements

* **router:** 多个method共享匹配逻辑 ([b238d64](https://github.com/aomex/aomex/commit/b238d6418f0bcedc9867d38a6accabee66a81830))
* **router:** 路由细分为动静态路由，加速匹配 ([be9324f](https://github.com/aomex/aomex/commit/be9324f73da5132f50dbbeebe537a8e55b9d9c28))





## [1.5.1](https://github.com/aomex/aomex/compare/v1.5.0...v1.5.1) (2024-07-04)

**Note:** Version bump only for package aomex





# [1.5.0](https://github.com/aomex/aomex/compare/v1.4.0...v1.5.0) (2024-07-04)


### Bug Fixes

* **serve-static:** 发送压缩文件时不能设置content-length ([93ee4d6](https://github.com/aomex/aomex/commit/93ee4d6a4de930eee798d0bfe4819657a1a7d577))


### Features

* **openapi:** 增加generateOpenapi函数快速生成文档 ([b048aac](https://github.com/aomex/aomex/commit/b048aacc5ff8a21be499b2f3af42aa61f6209697))
* **router:** 路由增加文档属性 showInOpenapi ([cff6b01](https://github.com/aomex/aomex/commit/cff6b01834d1e5f3c07e1b9e2b903cf11138e51e))
* **web:** request.body改为同步获取 ([bbc2075](https://github.com/aomex/aomex/commit/bbc207535cb97ebb8e928ca07f8d51056259cfd2))





# [1.4.0](https://github.com/aomex/aomex/compare/v1.3.0...v1.4.0) (2024-06-29)


### Features

* **openapi:** 允许自定义指令名称 ([3b3a81b](https://github.com/aomex/aomex/commit/3b3a81b97f2b843810bb5bb8d2be58ee4175e398))
* **serve-static:** 增加静态文件服务 ([4eb67c0](https://github.com/aomex/aomex/commit/4eb67c03657afc0ec4a11b15b0b2d16685481c43))
* **web:** 开启debug时如实响应5xx错误信息 ([f6b0c82](https://github.com/aomex/aomex/commit/f6b0c82bf1123962e0848fc89c7179f0656c20fa))





# [1.3.0](https://github.com/aomex/aomex/compare/v1.2.0...v1.3.0) (2024-06-28)


### Bug Fixes

* 打包时遇到类型报错 ([486f4e5](https://github.com/aomex/aomex/commit/486f4e56fa663dba757c0f3a5fb7e37210f03ab8))


### Features

* **core:** 删除中间件链条概念 ([12f42e6](https://github.com/aomex/aomex/commit/12f42e6ba15f3118b98f5ff31832121b1b2b9896))





# [1.2.0](https://github.com/aomex/aomex/compare/v1.1.0...v1.2.0) (2024-06-27)


### Features

* **console:** 未找到指令时，只提示最匹配的一个指令 ([f0f42ca](https://github.com/aomex/aomex/commit/f0f42ca22cb3fd9a79a4f22aee7bdaa246866d10))
* **core:** 数字验证器增加precision方法 ([a565de1](https://github.com/aomex/aomex/commit/a565de18adf9015eea7abddf98927d08371763ac))





# 1.1.0 (2024-06-27)


### Features

* 初始化 ([3350159](https://github.com/aomex/aomex/commit/3350159454ad230e6d910405f907293b059b1f49))

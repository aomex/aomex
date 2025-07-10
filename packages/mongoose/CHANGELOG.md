# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.28.3](https://github.com/aomex/aomex/compare/v3.28.2...v3.28.3) (2025-07-10)

**Note:** Version bump only for package @aomex/mongoose





## [3.28.2](https://github.com/aomex/aomex/compare/v3.28.1...v3.28.2) (2025-07-09)

**Note:** Version bump only for package @aomex/mongoose





## [3.28.1](https://github.com/aomex/aomex/compare/v3.28.0...v3.28.1) (2025-07-08)

**Note:** Version bump only for package @aomex/mongoose





# [3.28.0](https://github.com/aomex/aomex/compare/v3.27.4...v3.28.0) (2025-07-08)

**Note:** Version bump only for package @aomex/mongoose





## [3.27.4](https://github.com/aomex/aomex/compare/v3.27.3...v3.27.4) (2025-06-29)

**Note:** Version bump only for package @aomex/mongoose





## [3.27.3](https://github.com/aomex/aomex/compare/v3.27.2...v3.27.3) (2025-06-29)

**Note:** Version bump only for package @aomex/mongoose





## [3.27.2](https://github.com/aomex/aomex/compare/v3.27.1...v3.27.2) (2025-06-04)


### Bug Fixes

* **mongoose:** 修改迁移表名为__aomex_migration ([5f12d41](https://github.com/aomex/aomex/commit/5f12d4199d466da5ddd7676bfbe554b39c1fef2a))





## [3.27.1](https://github.com/aomex/aomex/compare/v3.27.0...v3.27.1) (2025-05-22)

**Note:** Version bump only for package @aomex/mongoose





# [3.27.0](https://github.com/aomex/aomex/compare/v3.26.0...v3.27.0) (2025-05-03)

**Note:** Version bump only for package @aomex/mongoose





# [3.26.0](https://github.com/aomex/aomex/compare/v3.25.0...v3.26.0) (2025-05-03)

**Note:** Version bump only for package @aomex/mongoose





# [3.25.0](https://github.com/aomex/aomex/compare/v3.24.0...v3.25.0) (2025-04-22)


### Features

* **mongoose:** 增加迁移文件创建成功提示信息 ([3631ae2](https://github.com/aomex/aomex/commit/3631ae23743c7fe0a51e73f2a28612475d4f0d67))





# [3.24.0](https://github.com/aomex/aomex/compare/v3.23.3...v3.24.0) (2025-04-20)


### Features

* **mongoose:** decimal123和objectid验证器的默认值支持传入字符串 ([e954d56](https://github.com/aomex/aomex/commit/e954d5653af0854aa8e1f84fbf57da4a3b77e572))
* **mongoose:** 创建迁移文件时，支持使用对话输入文件名 ([9261a31](https://github.com/aomex/aomex/commit/9261a314539532f01d96049be9b31c4856ba36ec))
* **mongoose:** 回滚指令增加--all参数回滚全部 ([2136394](https://github.com/aomex/aomex/commit/213639407dc232f60fd53251e0a1d040011b87a1))





## [3.23.3](https://github.com/aomex/aomex/compare/v3.23.2...v3.23.3) (2025-04-18)

**Note:** Version bump only for package @aomex/mongoose





## [3.23.2](https://github.com/aomex/aomex/compare/v3.23.1...v3.23.2) (2025-04-18)


### Bug Fixes

* **mongoose:** 记录迁移文件时未删除扩展名 ([d051232](https://github.com/aomex/aomex/commit/d051232516d5cb5535dafbae964b6782ea54d155))





## [3.23.1](https://github.com/aomex/aomex/compare/v3.23.0...v3.23.1) (2025-04-18)


### Bug Fixes

* **mongoose:** 无效的导出模块 Connection ([af06e45](https://github.com/aomex/aomex/commit/af06e450318d07ae0489779443fe610b18aea709))
* **mongoose:** 迁移目录可能目录不存在 ([bcdb986](https://github.com/aomex/aomex/commit/bcdb9869318062097b5a31d501cdfb8a51b53910))





# [3.23.0](https://github.com/aomex/aomex/compare/v3.22.0...v3.23.0) (2025-04-16)


### Features

* **mongoose:** 支持数据迁移 ([5e24813](https://github.com/aomex/aomex/commit/5e24813b5a7d0b87688e3cf4f666f7a9dcb2748e))
* **mongoose:** 模型名称和集合名称保持一致 ([6cbb02f](https://github.com/aomex/aomex/commit/6cbb02fcdb59a64207e5029585d517453043a465))





# [3.22.0](https://github.com/aomex/aomex/compare/v3.21.1...v3.22.0) (2025-04-07)


### Bug Fixes

* **mongoose:** 泛型 ModelInput 推导的可选属性无法跳过 ([29f60b7](https://github.com/aomex/aomex/commit/29f60b7d3d4a100faa934681be183e2cecebd135))





## [3.21.1](https://github.com/aomex/aomex/compare/v3.21.0...v3.21.1) (2025-04-06)


### Bug Fixes

* **mongoose:** 忘记导出ModelInput类型 ([b3dce65](https://github.com/aomex/aomex/commit/b3dce656571bb7d1c448dc77d091e198716b7e81))





# [3.21.0](https://github.com/aomex/aomex/compare/v3.20.0...v3.21.0) (2025-04-06)


### Features

* **mongoose:** 增加模型输入和输出两种类型提示 ([0cf2e7b](https://github.com/aomex/aomex/commit/0cf2e7bd6efe614011b38a1534d251e13074fd46))
* **mongoose:** 模型使用nullable时代表设置 default: null ([31d15fa](https://github.com/aomex/aomex/commit/31d15fac9c44e957ad6046832a5d1402d5d22a65))





# [3.20.0](https://github.com/aomex/aomex/compare/v3.19.2...v3.20.0) (2025-04-05)


### Features

* **mongoose:** 函数 formatMongoResult 支持选择是否删除扩展字段 ([94ec6f0](https://github.com/aomex/aomex/commit/94ec6f070ba92c5843021b18027f246a972a2d9b))





## [3.19.2](https://github.com/aomex/aomex/compare/v3.19.1...v3.19.2) (2025-04-05)

**Note:** Version bump only for package @aomex/mongoose





## [3.19.1](https://github.com/aomex/aomex/compare/v3.19.0...v3.19.1) (2025-04-05)

**Note:** Version bump only for package @aomex/mongoose





# [3.19.0](https://github.com/aomex/aomex/compare/v3.18.0...v3.19.0) (2025-04-05)


### Features

* **mongoose:** 创建mongoose模型帮助函数 ([0908337](https://github.com/aomex/aomex/commit/0908337706be04d68a56860bb95de09d45b1d35a))

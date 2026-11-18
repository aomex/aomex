# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.1.0](https://github.com/aomex/aomex/compare/v4.0.0...v4.1.0) (2026-11-18)

**Note:** Version bump only for package @aomex/common-validator





# [4.0.0](https://github.com/aomex/aomex/compare/v3.30.7...v4.0.0) (2026-11-17)

* chore!: 升级依赖至最新 ([9a679fa](https://github.com/aomex/aomex/commit/9a679faf0a4e2b313e8ce9081c1ecc65356b844c))
* feat(prisma)!: 生成 schema 并通过 definePrismaSchema 作为唯一业务入口 ([7dad8a4](https://github.com/aomex/aomex/commit/7dad8a478eaf3a9b4953aca19c5a2294986a7e36))
* chore!: 升级至 TypeScript 7 并将构建工具迁移到 tsdown ([a111409](https://github.com/aomex/aomex/commit/a111409021e2ee81ee5fb20ccc75480c9b5fa4c0))

### Features

* **validator:** rule.enum 支持传入 TS enum / 枚举对象 ([c9ba327](https://github.com/aomex/aomex/commit/c9ba327c52d53a0339ed9d8f6795a4d843f8635b))
* **validator:** schema 增加 required 方法 ([003745d](https://github.com/aomex/aomex/commit/003745d655b955d951190a5bac45d189a51ef863))
* **validator:** validate 支持 throwOnError: false 返回 data/errors ([64975c7](https://github.com/aomex/aomex/commit/64975c7d61287009aade8b32183b6738d841715b))
* **validator:** 增加 rule.record 别名 ([2a70fdf](https://github.com/aomex/aomex/commit/2a70fdf07fd9ba9f2ecb1c129d6e2833d2edcb8a))
* **validator:** 抽出 toDocument 并为 object schema 写入 x-ref ([3dceddc](https://github.com/aomex/aomex/commit/3dceddc675eb9c15ab96794fbea744ab95d1576a))
* **validator:** 数组验证器增加唯一性验证 ([b0b0e4e](https://github.com/aomex/aomex/commit/b0b0e4e6e31e429881fa8c5a94eb2519b5a7c9c6))
* **validator:** 新增 decimal 验证器 ([defac31](https://github.com/aomex/aomex/commit/defac314df697cf5b5cc061ea4ef6ceef1a5186d))
* **validator:** 新增 schema() 以支持字段集派生与复用 ([83ff898](https://github.com/aomex/aomex/commit/83ff8982c81521242bd1a2835c68dd09b3175ed2))
* **validator:** 新增 Validator.has 探测是否包含指定验证器 ([6dc867c](https://github.com/aomex/aomex/commit/6dc867c78cda9fca7f760398f0290870ab13800c))
* **validator:** 添加 enum 验证器的 pick 和 omit 方法以支持值的选择与排除 ([6473fde](https://github.com/aomex/aomex/commit/6473fde4d640af7c00078b17ca3d1ed1623970f4))
* **validator:** 添加 LiteralValidator 支持字面量验证 ([bd50533](https://github.com/aomex/aomex/commit/bd505331c08784e974b6f0f10c877141add8c7fb))
* **validator:** 规则允许深度嵌套对象字面量 ([356495c](https://github.com/aomex/aomex/commit/356495cf73c0954986351bfb3f5e625f7f8fd6ff))
* **validator:** 验证器规则入口支持传入schema ([7f0be2e](https://github.com/aomex/aomex/commit/7f0be2e027ad8e527989850ca331cde1d31830e0))

### BREAKING CHANGES

* mongoose 最低版本为v9
* Node.js 最低版本提升至 `>=24.0.0`。
* 最低 TypeScript 版本为 7。
* 请改用 definePrismaSchema(generated) 获取 prismaInput/prismaOutput/prismaEnum


## [3.30.7](https://github.com/aomex/aomex/compare/v3.30.6...v3.30.7) (2026-11-01)

**Note:** Version bump only for package @aomex/common-validator





## [3.30.6](https://github.com/aomex/aomex/compare/v3.30.5...v3.30.6) (2026-10-19)

**Note:** Version bump only for package @aomex/common-validator





## [3.30.5](https://github.com/aomex/aomex/compare/v3.30.4...v3.30.5) (2026-06-16)

**Note:** Version bump only for package @aomex/common-validator





## [3.30.4](https://github.com/aomex/aomex/compare/v3.30.3...v3.30.4) (2026-01-21)

**Note:** Version bump only for package @aomex/common-validator





## [3.30.3](https://github.com/aomex/aomex/compare/v3.30.2...v3.30.3) (2025-12-01)

**Note:** Version bump only for package @aomex/common-validator





## [3.30.2](https://github.com/aomex/aomex/compare/v3.30.1...v3.30.2) (2025-12-01)

**Note:** Version bump only for package @aomex/common-validator





## [3.30.1](https://github.com/aomex/aomex/compare/v3.30.0...v3.30.1) (2025-12-01)

**Note:** Version bump only for package @aomex/common-validator





# [3.30.0](https://github.com/aomex/aomex/compare/v3.29.2...v3.30.0) (2025-11-30)

**Note:** Version bump only for package @aomex/common-validator





## [3.29.2](https://github.com/aomex/aomex/compare/v3.29.1...v3.29.2) (2025-08-25)


### Bug Fixes

* **validator:** 支持布尔值作为枚举值 ([a00920d](https://github.com/aomex/aomex/commit/a00920d3cfb7cc33bf9c6c8b2223662f4f41215b))





## [3.29.1](https://github.com/aomex/aomex/compare/v3.29.0...v3.29.1) (2025-07-26)

**Note:** Version bump only for package @aomex/common-validator





# [3.29.0](https://github.com/aomex/aomex/compare/v3.28.3...v3.29.0) (2025-07-17)


### Bug Fixes

* **validator:** 枚举未正确识别字符串0 ([49580bb](https://github.com/aomex/aomex/commit/49580bb38b52debaa1052a1e6fc1424cbc97c4da))





## [3.28.3](https://github.com/aomex/aomex/compare/v3.28.2...v3.28.3) (2025-07-10)

**Note:** Version bump only for package @aomex/common-validator





## [3.28.2](https://github.com/aomex/aomex/compare/v3.28.1...v3.28.2) (2025-07-09)

**Note:** Version bump only for package @aomex/common-validator





## [3.28.1](https://github.com/aomex/aomex/compare/v3.28.0...v3.28.1) (2025-07-08)

**Note:** Version bump only for package @aomex/common-validator





# [3.28.0](https://github.com/aomex/aomex/compare/v3.27.4...v3.28.0) (2025-07-08)

**Note:** Version bump only for package @aomex/common-validator





## [3.27.4](https://github.com/aomex/aomex/compare/v3.27.3...v3.27.4) (2025-06-29)

**Note:** Version bump only for package @aomex/common-validator





## [3.27.3](https://github.com/aomex/aomex/compare/v3.27.2...v3.27.3) (2025-06-29)

**Note:** Version bump only for package @aomex/common-validator





## [3.27.2](https://github.com/aomex/aomex/compare/v3.27.1...v3.27.2) (2025-06-04)

**Note:** Version bump only for package @aomex/common-validator





## [3.27.1](https://github.com/aomex/aomex/compare/v3.27.0...v3.27.1) (2025-05-22)

**Note:** Version bump only for package @aomex/common-validator





# [3.27.0](https://github.com/aomex/aomex/compare/v3.26.0...v3.27.0) (2025-05-03)

**Note:** Version bump only for package @aomex/common-validator





# [3.26.0](https://github.com/aomex/aomex/compare/v3.25.0...v3.26.0) (2025-05-03)

**Note:** Version bump only for package @aomex/common-validator





# [3.25.0](https://github.com/aomex/aomex/compare/v3.24.0...v3.25.0) (2025-04-22)

**Note:** Version bump only for package @aomex/common-validator





# [3.24.0](https://github.com/aomex/aomex/compare/v3.23.3...v3.24.0) (2025-04-20)

**Note:** Version bump only for package @aomex/common-validator





## [3.23.3](https://github.com/aomex/aomex/compare/v3.23.2...v3.23.3) (2025-04-18)

**Note:** Version bump only for package @aomex/common-validator





## [3.23.2](https://github.com/aomex/aomex/compare/v3.23.1...v3.23.2) (2025-04-18)

**Note:** Version bump only for package @aomex/common-validator





## [3.23.1](https://github.com/aomex/aomex/compare/v3.23.0...v3.23.1) (2025-04-18)

**Note:** Version bump only for package @aomex/common-validator





# [3.23.0](https://github.com/aomex/aomex/compare/v3.22.0...v3.23.0) (2025-04-16)

**Note:** Version bump only for package @aomex/common-validator





# [3.22.0](https://github.com/aomex/aomex/compare/v3.21.1...v3.22.0) (2025-04-07)


### Bug Fixes

* **mongoose:** 泛型 ModelInput 推导的可选属性无法跳过 ([29f60b7](https://github.com/aomex/aomex/commit/29f60b7d3d4a100faa934681be183e2cecebd135))





## [3.21.1](https://github.com/aomex/aomex/compare/v3.21.0...v3.21.1) (2025-04-06)

**Note:** Version bump only for package @aomex/common-validator





# [3.21.0](https://github.com/aomex/aomex/compare/v3.20.0...v3.21.0) (2025-04-06)

**Note:** Version bump only for package @aomex/common-validator





# [3.20.0](https://github.com/aomex/aomex/compare/v3.19.2...v3.20.0) (2025-04-05)

**Note:** Version bump only for package @aomex/common-validator





## [3.19.2](https://github.com/aomex/aomex/compare/v3.19.1...v3.19.2) (2025-04-05)

**Note:** Version bump only for package @aomex/common-validator





## [3.19.1](https://github.com/aomex/aomex/compare/v3.19.0...v3.19.1) (2025-04-05)

**Note:** Version bump only for package @aomex/common-validator





# [3.19.0](https://github.com/aomex/aomex/compare/v3.18.0...v3.19.0) (2025-04-05)


### Features

* **validator:** 使用date验证器 ([c088886](https://github.com/aomex/aomex/commit/c088886edbf13437ca444336818579f03f382e8b))





# [3.18.0](https://github.com/aomex/aomex/compare/v3.17.3...v3.18.0) (2025-04-03)

**Note:** Version bump only for package @aomex/common-validator





## [3.17.3](https://github.com/aomex/aomex/compare/v3.17.2...v3.17.3) (2025-03-26)


### Bug Fixes

* 内部依赖使用固定版本号 ([aa70c2a](https://github.com/aomex/aomex/commit/aa70c2ad444414ec6619b9579ad8037a7191a86f))





## [3.17.2](https://github.com/aomex/aomex/compare/v3.17.1...v3.17.2) (2025-03-26)

**Note:** Version bump only for package @aomex/common-validator





## [3.17.1](https://github.com/aomex/aomex/compare/v3.17.0...v3.17.1) (2025-03-09)

**Note:** Version bump only for package @aomex/common-validator





# [3.17.0](https://github.com/aomex/aomex/compare/v3.16.0...v3.17.0) (2025-03-09)

**Note:** Version bump only for package @aomex/common-validator





# [3.16.0](https://github.com/aomex/aomex/compare/v3.15.1...v3.16.0) (2025-03-09)

**Note:** Version bump only for package @aomex/common-validator





## [3.15.1](https://github.com/aomex/aomex/compare/v3.15.0...v3.15.1) (2025-02-09)

**Note:** Version bump only for package @aomex/common-validator





# [3.15.0](https://github.com/aomex/aomex/compare/v3.14.2...v3.15.0) (2025-02-09)

**Note:** Version bump only for package @aomex/common-validator





## [3.14.2](https://github.com/aomex/aomex/compare/v3.14.1...v3.14.2) (2025-01-14)

**Note:** Version bump only for package @aomex/common-validator





## [3.14.1](https://github.com/aomex/aomex/compare/v3.14.0...v3.14.1) (2025-01-09)

**Note:** Version bump only for package @aomex/common-validator





# [3.14.0](https://github.com/aomex/aomex/compare/v3.13.1...v3.14.0) (2025-01-02)

**Note:** Version bump only for package @aomex/common-validator





## [3.13.1](https://github.com/aomex/aomex/compare/v3.13.0...v3.13.1) (2024-12-29)

**Note:** Version bump only for package @aomex/common-validator





# [3.13.0](https://github.com/aomex/aomex/compare/v3.12.1...v3.13.0) (2024-12-27)


### Features

* **validator:** any-of,all-of,one-of 增加optional和nullable方法 ([a5c52fc](https://github.com/aomex/aomex/commit/a5c52fc3768afea20eaf30213f1d847a0122b449))





## [3.12.1](https://github.com/aomex/aomex/compare/v3.12.0...v3.12.1) (2024-12-19)

**Note:** Version bump only for package @aomex/common-validator





# [3.12.0](https://github.com/aomex/aomex/compare/v3.11.0...v3.12.0) (2024-11-07)

**Note:** Version bump only for package @aomex/common-validator





# [3.11.0](https://github.com/aomex/aomex/compare/v3.10.0...v3.11.0) (2024-11-07)

**Note:** Version bump only for package @aomex/common-validator





# [3.10.0](https://github.com/aomex/aomex/compare/v3.9.0...v3.10.0) (2024-11-02)

**Note:** Version bump only for package @aomex/common-validator





# [3.9.0](https://github.com/aomex/aomex/compare/v3.8.1...v3.9.0) (2024-10-30)

**Note:** Version bump only for package @aomex/common-validator

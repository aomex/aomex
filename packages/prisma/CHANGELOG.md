# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.8.0](https://github.com/aomex/aomex/compare/v4.7.0...v4.8.0) (2026-11-26)

**Note:** Version bump only for package @aomex/prisma





# [4.7.0](https://github.com/aomex/aomex/compare/v4.6.0...v4.7.0) (2026-11-25)

**Note:** Version bump only for package @aomex/prisma





# [4.6.0](https://github.com/aomex/aomex/compare/v4.5.0...v4.6.0) (2026-11-24)

**Note:** Version bump only for package @aomex/prisma





# [4.5.0](https://github.com/aomex/aomex/compare/v4.4.0...v4.5.0) (2026-11-24)

**Note:** Version bump only for package @aomex/prisma





# [4.4.0](https://github.com/aomex/aomex/compare/v4.3.0...v4.4.0) (2026-11-22)

**Note:** Version bump only for package @aomex/prisma





# [4.3.0](https://github.com/aomex/aomex/compare/v4.2.0...v4.3.0) (2026-11-21)

**Note:** Version bump only for package @aomex/prisma





# [4.2.0](https://github.com/aomex/aomex/compare/v4.1.0...v4.2.0) (2026-11-20)

**Note:** Version bump only for package @aomex/prisma





# [4.1.0](https://github.com/aomex/aomex/compare/v4.0.0...v4.1.0) (2026-11-18)

**Note:** Version bump only for package @aomex/prisma





# [4.0.0](https://github.com/aomex/aomex/compare/v3.30.7...v4.0.0) (2026-11-17)

* chore!: 升级依赖至最新 ([9a679fa](https://github.com/aomex/aomex/commit/9a679faf0a4e2b313e8ce9081c1ecc65356b844c))
* feat(prisma)!: 生成 schema 并通过 definePrismaSchema 作为唯一业务入口 ([7dad8a4](https://github.com/aomex/aomex/commit/7dad8a478eaf3a9b4953aca19c5a2294986a7e36))
* chore!: 升级至 TypeScript 7 并将构建工具迁移到 tsdown ([a111409](https://github.com/aomex/aomex/commit/a111409021e2ee81ee5fb20ccc75480c9b5fa4c0))

### Features

* **validator:** 新增 decimal 验证器 ([defac31](https://github.com/aomex/aomex/commit/defac314df697cf5b5cc061ea4ef6ceef1a5186d))
* **validator:** 验证器规则入口支持传入schema ([7f0be2e](https://github.com/aomex/aomex/commit/7f0be2e027ad8e527989850ca331cde1d31830e0))

### BREAKING CHANGES

* mongoose 最低版本为v9
* Node.js 最低版本提升至 `>=24.0.0`。
* 最低 TypeScript 版本为 7。
* 请改用 definePrismaSchema(generated) 获取 prismaInput/prismaOutput/prismaEnum


## [3.30.7](https://github.com/aomex/aomex/compare/v3.30.6...v3.30.7) (2026-11-01)

**Note:** Version bump only for package @aomex/prisma





## [3.30.6](https://github.com/aomex/aomex/compare/v3.30.5...v3.30.6) (2026-10-19)

**Note:** Version bump only for package @aomex/prisma





## [3.30.5](https://github.com/aomex/aomex/compare/v3.30.4...v3.30.5) (2026-06-16)

**Note:** Version bump only for package @aomex/prisma





## [3.30.4](https://github.com/aomex/aomex/compare/v3.30.3...v3.30.4) (2026-01-21)

**Note:** Version bump only for package @aomex/prisma





## [3.30.3](https://github.com/aomex/aomex/compare/v3.30.2...v3.30.3) (2025-12-01)


### Bug Fixes

* **prisma:** 带空字符串默认值的字段允许传入空字符串 ([65b698f](https://github.com/aomex/aomex/commit/65b698f0a45b88539e34c7c41d2ac59281599452))
* **prisma:** 非必填字段允许传入null值 ([5187a53](https://github.com/aomex/aomex/commit/5187a533169d844db88100b31aa2d6fd098e1113))





## [3.30.2](https://github.com/aomex/aomex/compare/v3.30.1...v3.30.2) (2025-12-01)


### Bug Fixes

* **prisma:** 覆盖字段未区分input和output ([a2a7b5f](https://github.com/aomex/aomex/commit/a2a7b5f4df2510d6084bf4115e943fe7cdb62123))





## [3.30.1](https://github.com/aomex/aomex/compare/v3.30.0...v3.30.1) (2025-12-01)


### Bug Fixes

* **prisma:** 导出路径从文件名变成目录 ([597b18e](https://github.com/aomex/aomex/commit/597b18ede0a4106bde32c6d9d2966a16b9a0635e))





# [3.30.0](https://github.com/aomex/aomex/compare/v3.29.2...v3.30.0) (2025-11-30)


### Features

* **prisma:** prisma版本升级到7.0 ([a8c9880](https://github.com/aomex/aomex/commit/a8c98808303ac6ba2ac5bc0a9322d90b0097fd65))
* **prisma:** 支持覆盖字段规则 ([13f2aee](https://github.com/aomex/aomex/commit/13f2aeea730a0715a5d601e48dd51ba70c41bcd8))





## [3.29.2](https://github.com/aomex/aomex/compare/v3.29.1...v3.29.2) (2025-08-25)

**Note:** Version bump only for package @aomex/prisma





## [3.29.1](https://github.com/aomex/aomex/compare/v3.29.0...v3.29.1) (2025-07-26)

**Note:** Version bump only for package @aomex/prisma





# [3.29.0](https://github.com/aomex/aomex/compare/v3.28.3...v3.29.0) (2025-07-17)

**Note:** Version bump only for package @aomex/prisma





## [3.28.3](https://github.com/aomex/aomex/compare/v3.28.2...v3.28.3) (2025-07-10)

**Note:** Version bump only for package @aomex/prisma





## [3.28.2](https://github.com/aomex/aomex/compare/v3.28.1...v3.28.2) (2025-07-09)

**Note:** Version bump only for package @aomex/prisma





## [3.28.1](https://github.com/aomex/aomex/compare/v3.28.0...v3.28.1) (2025-07-08)

**Note:** Version bump only for package @aomex/prisma





# [3.28.0](https://github.com/aomex/aomex/compare/v3.27.4...v3.28.0) (2025-07-08)

**Note:** Version bump only for package @aomex/prisma





## [3.27.4](https://github.com/aomex/aomex/compare/v3.27.3...v3.27.4) (2025-06-29)

**Note:** Version bump only for package @aomex/prisma





## [3.27.3](https://github.com/aomex/aomex/compare/v3.27.2...v3.27.3) (2025-06-29)

**Note:** Version bump only for package @aomex/prisma





## [3.27.2](https://github.com/aomex/aomex/compare/v3.27.1...v3.27.2) (2025-06-04)

**Note:** Version bump only for package @aomex/prisma





## [3.27.1](https://github.com/aomex/aomex/compare/v3.27.0...v3.27.1) (2025-05-22)

**Note:** Version bump only for package @aomex/prisma





# [3.27.0](https://github.com/aomex/aomex/compare/v3.26.0...v3.27.0) (2025-05-03)

**Note:** Version bump only for package @aomex/prisma





# [3.26.0](https://github.com/aomex/aomex/compare/v3.25.0...v3.26.0) (2025-05-03)

**Note:** Version bump only for package @aomex/prisma





# [3.25.0](https://github.com/aomex/aomex/compare/v3.24.0...v3.25.0) (2025-04-22)

**Note:** Version bump only for package @aomex/prisma





# [3.24.0](https://github.com/aomex/aomex/compare/v3.23.3...v3.24.0) (2025-04-20)

**Note:** Version bump only for package @aomex/prisma





## [3.23.3](https://github.com/aomex/aomex/compare/v3.23.2...v3.23.3) (2025-04-18)

**Note:** Version bump only for package @aomex/prisma





## [3.23.2](https://github.com/aomex/aomex/compare/v3.23.1...v3.23.2) (2025-04-18)

**Note:** Version bump only for package @aomex/prisma





## [3.23.1](https://github.com/aomex/aomex/compare/v3.23.0...v3.23.1) (2025-04-18)

**Note:** Version bump only for package @aomex/prisma





# [3.23.0](https://github.com/aomex/aomex/compare/v3.22.0...v3.23.0) (2025-04-16)

**Note:** Version bump only for package @aomex/prisma





# [3.22.0](https://github.com/aomex/aomex/compare/v3.21.1...v3.22.0) (2025-04-07)

**Note:** Version bump only for package @aomex/prisma





## [3.21.1](https://github.com/aomex/aomex/compare/v3.21.0...v3.21.1) (2025-04-06)

**Note:** Version bump only for package @aomex/prisma





# [3.21.0](https://github.com/aomex/aomex/compare/v3.20.0...v3.21.0) (2025-04-06)

**Note:** Version bump only for package @aomex/prisma





# [3.20.0](https://github.com/aomex/aomex/compare/v3.19.2...v3.20.0) (2025-04-05)

**Note:** Version bump only for package @aomex/prisma





## [3.19.2](https://github.com/aomex/aomex/compare/v3.19.1...v3.19.2) (2025-04-05)

**Note:** Version bump only for package @aomex/prisma





## [3.19.1](https://github.com/aomex/aomex/compare/v3.19.0...v3.19.1) (2025-04-05)

**Note:** Version bump only for package @aomex/prisma





# [3.19.0](https://github.com/aomex/aomex/compare/v3.18.0...v3.19.0) (2025-04-05)


### Features

* **validator:** 使用date验证器 ([c088886](https://github.com/aomex/aomex/commit/c088886edbf13437ca444336818579f03f382e8b))





# [3.18.0](https://github.com/aomex/aomex/compare/v3.17.3...v3.18.0) (2025-04-03)

**Note:** Version bump only for package @aomex/prisma





## [3.17.3](https://github.com/aomex/aomex/compare/v3.17.2...v3.17.3) (2025-03-26)


### Bug Fixes

* 内部依赖使用固定版本号 ([aa70c2a](https://github.com/aomex/aomex/commit/aa70c2ad444414ec6619b9579ad8037a7191a86f))





## [3.17.2](https://github.com/aomex/aomex/compare/v3.17.1...v3.17.2) (2025-03-26)

**Note:** Version bump only for package @aomex/prisma





## [3.17.1](https://github.com/aomex/aomex/compare/v3.17.0...v3.17.1) (2025-03-09)

**Note:** Version bump only for package @aomex/prisma





# [3.17.0](https://github.com/aomex/aomex/compare/v3.16.0...v3.17.0) (2025-03-09)

**Note:** Version bump only for package @aomex/prisma





# [3.16.0](https://github.com/aomex/aomex/compare/v3.15.1...v3.16.0) (2025-03-09)

**Note:** Version bump only for package @aomex/prisma





## [3.15.1](https://github.com/aomex/aomex/compare/v3.15.0...v3.15.1) (2025-02-09)

**Note:** Version bump only for package @aomex/prisma





# [3.15.0](https://github.com/aomex/aomex/compare/v3.14.2...v3.15.0) (2025-02-09)

**Note:** Version bump only for package @aomex/prisma





## [3.14.2](https://github.com/aomex/aomex/compare/v3.14.1...v3.14.2) (2025-01-14)

**Note:** Version bump only for package @aomex/prisma





## [3.14.1](https://github.com/aomex/aomex/compare/v3.14.0...v3.14.1) (2025-01-09)

**Note:** Version bump only for package @aomex/prisma





# [3.14.0](https://github.com/aomex/aomex/compare/v3.13.1...v3.14.0) (2025-01-02)

**Note:** Version bump only for package @aomex/prisma





## [3.13.1](https://github.com/aomex/aomex/compare/v3.13.0...v3.13.1) (2024-12-29)


### Bug Fixes

* **prisma:** win系统下未生成.d.ts内容 ([c774914](https://github.com/aomex/aomex/commit/c7749142a6ad3df8a828e26e4bc9762648488d61))
* **prisma:** 兼容prisma ([0dfcc07](https://github.com/aomex/aomex/commit/0dfcc0746e1fe4c59bad9cff9aeff878591b22da))





# [3.13.0](https://github.com/aomex/aomex/compare/v3.12.1...v3.13.0) (2024-12-27)


### Features

* **prisma:** 基于prisma生成输入输出规则 ([8041a24](https://github.com/aomex/aomex/commit/8041a240183e87541f3b81a3046126f55f037232))

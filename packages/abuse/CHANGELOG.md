# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [4.7.0](https://github.com/aomex/aomex/compare/v4.6.0...v4.7.0) (2026-11-25)

### Features

* **cache:** 以共享 Caching 替代 BaseCacheService，createRemember 绑定实例 ([58595bc](https://github.com/aomex/aomex/commit/58595bcb61e149faa988d4479c3be3b0673ed1eb))
* **logger:** 以 Logger 替代 BaseLoggerService，并统一 lifecycle 失败清门闩 ([6a750d3](https://github.com/aomex/aomex/commit/6a750d3af7068a5ff9805f6cc6549a0da0092bfd))


# [4.6.0](https://github.com/aomex/aomex/compare/v4.5.0...v4.6.0) (2026-11-24)

**Note:** Version bump only for package @aomex/abuse





# [4.5.0](https://github.com/aomex/aomex/compare/v4.4.0...v4.5.0) (2026-11-24)

### Bug Fixes

* **abuse:** socket 封禁时回推 error 后以 1008 断开连接 ([bd473a5](https://github.com/aomex/aomex/commit/bd473a516c8b7920f9438e24c82c59b8f58cd7cf))

### Features

* **abuse:** createAbuse 拆为 .web()/.socket() 并增加 socket-events 策略 ([3798757](https://github.com/aomex/aomex/commit/37987575bbe13e9f3046f762c9efafab07ed3f75))


# [4.4.0](https://github.com/aomex/aomex/compare/v4.3.0...v4.4.0) (2026-11-22)

**Note:** Version bump only for package @aomex/abuse





# [4.3.0](https://github.com/aomex/aomex/compare/v4.2.0...v4.3.0) (2026-11-21)

### Features

* **abuse:** 新增滥用计数与封禁中间件 ([6e0c8ef](https://github.com/aomex/aomex/commit/6e0c8ef7a151b23087591fea2d8ec1ec0bc9642f))

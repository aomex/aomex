# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.30.4](https://github.com/aomex/aomex/compare/v3.30.3...v3.30.4) (2026-01-21)


### Bug Fixes

* **cron:** 任务早于waitingTimeout结束，会导致排队任务获得执行权 ([8e26cfb](https://github.com/aomex/aomex/commit/8e26cfb9eb8db49db14cc29ca54fd97b0c589c1c))





## [3.30.3](https://github.com/aomex/aomex/compare/v3.30.2...v3.30.3) (2025-12-01)

**Note:** Version bump only for package @aomex/cron





## [3.30.2](https://github.com/aomex/aomex/compare/v3.30.1...v3.30.2) (2025-12-01)

**Note:** Version bump only for package @aomex/cron





## [3.30.1](https://github.com/aomex/aomex/compare/v3.30.0...v3.30.1) (2025-12-01)

**Note:** Version bump only for package @aomex/cron





# [3.30.0](https://github.com/aomex/aomex/compare/v3.29.2...v3.30.0) (2025-11-30)


### Bug Fixes

* **cron:** 防止定时任务变成僵尸进程 ([3a83e48](https://github.com/aomex/aomex/commit/3a83e48cb7c902bf20dc31457b6300e09d8e0be6))





## [3.29.2](https://github.com/aomex/aomex/compare/v3.29.1...v3.29.2) (2025-08-25)

**Note:** Version bump only for package @aomex/cron





## [3.29.1](https://github.com/aomex/aomex/compare/v3.29.0...v3.29.1) (2025-07-26)


### Bug Fixes

* **cron:** 部分场景下未能按任务时间准时执行 ([fe3cb88](https://github.com/aomex/aomex/commit/fe3cb8801641cb1aca09bf071e58c89af70bb25f))





# [3.29.0](https://github.com/aomex/aomex/compare/v3.28.3...v3.29.0) (2025-07-17)

**Note:** Version bump only for package @aomex/cron





## [3.28.3](https://github.com/aomex/aomex/compare/v3.28.2...v3.28.3) (2025-07-10)

**Note:** Version bump only for package @aomex/cron





## [3.28.2](https://github.com/aomex/aomex/compare/v3.28.1...v3.28.2) (2025-07-09)

**Note:** Version bump only for package @aomex/cron





## [3.28.1](https://github.com/aomex/aomex/compare/v3.28.0...v3.28.1) (2025-07-08)

**Note:** Version bump only for package @aomex/cron





# [3.28.0](https://github.com/aomex/aomex/compare/v3.27.4...v3.28.0) (2025-07-08)

**Note:** Version bump only for package @aomex/cron





## [3.27.4](https://github.com/aomex/aomex/compare/v3.27.3...v3.27.4) (2025-06-29)


### Bug Fixes

* **cron:** 任务结束前可能未设置过期时间导致缓存无法释放 ([6bc0b7f](https://github.com/aomex/aomex/commit/6bc0b7fb8b961c13394bfb183a28dc0ff9afc3d9))





## [3.27.3](https://github.com/aomex/aomex/compare/v3.27.2...v3.27.3) (2025-06-29)


### Bug Fixes

* **cron:** cjs包使用了具名导出 ([2b0f37c](https://github.com/aomex/aomex/commit/2b0f37cc3e11699ea44257223b19985d3126745d))
* **cron:** 非正常退出时可能导致不可重叠任务一直无法触发 ([b063df4](https://github.com/aomex/aomex/commit/b063df47269ac50f1899e329dade02c88caaede9))





## [3.27.2](https://github.com/aomex/aomex/compare/v3.27.1...v3.27.2) (2025-06-04)

**Note:** Version bump only for package @aomex/cron





## [3.27.1](https://github.com/aomex/aomex/compare/v3.27.0...v3.27.1) (2025-05-22)

**Note:** Version bump only for package @aomex/cron





# [3.27.0](https://github.com/aomex/aomex/compare/v3.26.0...v3.27.0) (2025-05-03)


### Bug Fixes

* **cron:** 子进程初始化状态可能会遗漏cron:stop事件 ([d6759b1](https://github.com/aomex/aomex/commit/d6759b150e61088d4460ef93def411c129e9c245))
* **cron:** 延迟发送停止指令以确保子进程正确处理cron:stop指令 ([98fd2c9](https://github.com/aomex/aomex/commit/98fd2c9f2523e5c87911404adcb056f9558ad509))


### Features

* **cron:** 指令增加isCurrentTime方法 ([54057b6](https://github.com/aomex/aomex/commit/54057b6b845476c2d30e313f31506fb87547b65a))





# [3.26.0](https://github.com/aomex/aomex/compare/v3.25.0...v3.26.0) (2025-05-03)


### Features

* **cron:** 指令运行时允许使用`ctx.cron.isAlive()`半永久执行 ([a91f228](https://github.com/aomex/aomex/commit/a91f228234fe0960c38550a38fb241b970e9bb12))





# [3.25.0](https://github.com/aomex/aomex/compare/v3.24.0...v3.25.0) (2025-04-22)


### Bug Fixes

* **cron:** 运行时cron属性设置为一定存在 ([5786dc0](https://github.com/aomex/aomex/commit/5786dc0848974880be050da427040c97bd4c7aff))





# [3.24.0](https://github.com/aomex/aomex/compare/v3.23.3...v3.24.0) (2025-04-20)

**Note:** Version bump only for package @aomex/cron





## [3.23.3](https://github.com/aomex/aomex/compare/v3.23.2...v3.23.3) (2025-04-18)

**Note:** Version bump only for package @aomex/cron





## [3.23.2](https://github.com/aomex/aomex/compare/v3.23.1...v3.23.2) (2025-04-18)

**Note:** Version bump only for package @aomex/cron





## [3.23.1](https://github.com/aomex/aomex/compare/v3.23.0...v3.23.1) (2025-04-18)

**Note:** Version bump only for package @aomex/cron





# [3.23.0](https://github.com/aomex/aomex/compare/v3.22.0...v3.23.0) (2025-04-16)

**Note:** Version bump only for package @aomex/cron





# [3.22.0](https://github.com/aomex/aomex/compare/v3.21.1...v3.22.0) (2025-04-07)

**Note:** Version bump only for package @aomex/cron





## [3.21.1](https://github.com/aomex/aomex/compare/v3.21.0...v3.21.1) (2025-04-06)

**Note:** Version bump only for package @aomex/cron





# [3.21.0](https://github.com/aomex/aomex/compare/v3.20.0...v3.21.0) (2025-04-06)

**Note:** Version bump only for package @aomex/cron





# [3.20.0](https://github.com/aomex/aomex/compare/v3.19.2...v3.20.0) (2025-04-05)

**Note:** Version bump only for package @aomex/cron





## [3.19.2](https://github.com/aomex/aomex/compare/v3.19.1...v3.19.2) (2025-04-05)

**Note:** Version bump only for package @aomex/cron





## [3.19.1](https://github.com/aomex/aomex/compare/v3.19.0...v3.19.1) (2025-04-05)

**Note:** Version bump only for package @aomex/cron





# [3.19.0](https://github.com/aomex/aomex/compare/v3.18.0...v3.19.0) (2025-04-05)


### Bug Fixes

* **task:** 排队的任务在下达停止服务后未被清理 ([3773a16](https://github.com/aomex/aomex/commit/3773a164af24ce2d8bc077a0209a35f0a5dfca82))





# [3.18.0](https://github.com/aomex/aomex/compare/v3.17.3...v3.18.0) (2025-04-03)

**Note:** Version bump only for package @aomex/cron





## [3.17.3](https://github.com/aomex/aomex/compare/v3.17.2...v3.17.3) (2025-03-26)


### Bug Fixes

* 内部依赖使用固定版本号 ([aa70c2a](https://github.com/aomex/aomex/commit/aa70c2ad444414ec6619b9579ad8037a7191a86f))





## [3.17.2](https://github.com/aomex/aomex/compare/v3.17.1...v3.17.2) (2025-03-26)

**Note:** Version bump only for package @aomex/cron





## [3.17.1](https://github.com/aomex/aomex/compare/v3.17.0...v3.17.1) (2025-03-09)

**Note:** Version bump only for package @aomex/cron





# [3.17.0](https://github.com/aomex/aomex/compare/v3.16.0...v3.17.0) (2025-03-09)

**Note:** Version bump only for package @aomex/cron





# [3.16.0](https://github.com/aomex/aomex/compare/v3.15.1...v3.16.0) (2025-03-09)

**Note:** Version bump only for package @aomex/cron





## [3.15.1](https://github.com/aomex/aomex/compare/v3.15.0...v3.15.1) (2025-02-09)

**Note:** Version bump only for package @aomex/cron





# [3.15.0](https://github.com/aomex/aomex/compare/v3.14.2...v3.15.0) (2025-02-09)


### Features

* **cron:** 增加serves参数控制服务数量 ([fb275f7](https://github.com/aomex/aomex/commit/fb275f704376e78a8a4eed224160c0962188abb3))
* **cron:** 指令增加cron属性 ([5978936](https://github.com/aomex/aomex/commit/5978936ce238d0b5c84aaaf03eb60af0c3fb7830))





## [3.14.2](https://github.com/aomex/aomex/compare/v3.14.1...v3.14.2) (2025-01-14)

**Note:** Version bump only for package @aomex/cron





## [3.14.1](https://github.com/aomex/aomex/compare/v3.14.0...v3.14.1) (2025-01-09)

**Note:** Version bump only for package @aomex/cron





# [3.14.0](https://github.com/aomex/aomex/compare/v3.13.1...v3.14.0) (2025-01-02)


### Features

* **cron:** 非重叠任务允许等待旧任务完成直到等待超时 ([8b75762](https://github.com/aomex/aomex/commit/8b75762bcb249e783a15cb7da0228dd3bd6d50f4))





## [3.13.1](https://github.com/aomex/aomex/compare/v3.13.0...v3.13.1) (2024-12-29)

**Note:** Version bump only for package @aomex/cron





# [3.13.0](https://github.com/aomex/aomex/compare/v3.12.1...v3.13.0) (2024-12-27)

**Note:** Version bump only for package @aomex/cron





## [3.12.1](https://github.com/aomex/aomex/compare/v3.12.0...v3.12.1) (2024-12-19)


### Bug Fixes

* **cron:** 子进程退出时可能不触发close事件 ([0eb5e71](https://github.com/aomex/aomex/commit/0eb5e719566e8dc889711c5bde617af0638c13aa))





# [3.12.0](https://github.com/aomex/aomex/compare/v3.11.0...v3.12.0) (2024-11-07)

**Note:** Version bump only for package @aomex/cron





# [3.11.0](https://github.com/aomex/aomex/compare/v3.10.0...v3.11.0) (2024-11-07)

**Note:** Version bump only for package @aomex/cron





# [3.10.0](https://github.com/aomex/aomex/compare/v3.9.0...v3.10.0) (2024-11-02)

**Note:** Version bump only for package @aomex/cron





# [3.9.0](https://github.com/aomex/aomex/compare/v3.8.1...v3.9.0) (2024-10-30)

**Note:** Version bump only for package @aomex/cron





## [3.8.1](https://github.com/aomex/aomex/compare/v3.8.0...v3.8.1) (2024-10-26)

**Note:** Version bump only for package @aomex/cron





# [3.8.0](https://github.com/aomex/aomex/compare/v3.7.2...v3.8.0) (2024-10-26)

**Note:** Version bump only for package @aomex/cron





## [3.7.2](https://github.com/aomex/aomex/compare/v3.7.1...v3.7.2) (2024-10-22)

**Note:** Version bump only for package @aomex/cron





## [3.7.1](https://github.com/aomex/aomex/compare/v3.7.0...v3.7.1) (2024-10-22)

**Note:** Version bump only for package @aomex/cron





# [3.7.0](https://github.com/aomex/aomex/compare/v3.6.0...v3.7.0) (2024-10-19)

**Note:** Version bump only for package @aomex/cron





# [3.6.0](https://github.com/aomex/aomex/compare/v3.5.0...v3.6.0) (2024-10-17)

**Note:** Version bump only for package @aomex/cron





# [3.5.0](https://github.com/aomex/aomex/compare/v3.4.2...v3.5.0) (2024-10-16)


### Features

* **cron:** 子任务支持source-maps ([968b44d](https://github.com/aomex/aomex/commit/968b44d08132f0d6d379ff84c5fe56f033965ee0))
* **cron:** 子任务支持输出颜色 ([58a7530](https://github.com/aomex/aomex/commit/58a75303a037aef2bf5c416fe8c9a7356809de45))





## [3.4.2](https://github.com/aomex/aomex/compare/v3.4.1...v3.4.2) (2024-10-07)

**Note:** Version bump only for package @aomex/cron





## [3.4.1](https://github.com/aomex/aomex/compare/v3.4.0...v3.4.1) (2024-10-06)

**Note:** Version bump only for package @aomex/cron





# [3.4.0](https://github.com/aomex/aomex/compare/v3.3.0...v3.4.0) (2024-10-04)

**Note:** Version bump only for package @aomex/cron





# [3.3.0](https://github.com/aomex/aomex/compare/v3.2.4...v3.3.0) (2024-09-26)


### Features

* **cron:** 增加overlap属性 ([8853059](https://github.com/aomex/aomex/commit/885305937608e0b92182ebac09e10a4226a33ae7))





## [3.2.4](https://github.com/aomex/aomex/compare/v3.2.3...v3.2.4) (2024-09-25)

**Note:** Version bump only for package @aomex/cron





## [3.2.3](https://github.com/aomex/aomex/compare/v3.2.2...v3.2.3) (2024-09-25)

**Note:** Version bump only for package @aomex/cron





## [3.2.2](https://github.com/aomex/aomex/compare/v3.2.1...v3.2.2) (2024-09-19)

**Note:** Version bump only for package @aomex/cron





## [3.2.1](https://github.com/aomex/aomex/compare/v3.2.0...v3.2.1) (2024-09-17)


### Performance Improvements

* **cron:** 美化终端列表 ([5b18187](https://github.com/aomex/aomex/commit/5b18187b1c8f94fa290c52ad74c0a15d791ea4dc))





# [3.2.0](https://github.com/aomex/aomex/compare/v3.1.1...v3.2.0) (2024-09-17)

**Note:** Version bump only for package @aomex/cron





## [3.1.1](https://github.com/aomex/aomex/compare/v3.1.0...v3.1.1) (2024-09-13)

**Note:** Version bump only for package @aomex/cron





# [3.1.0](https://github.com/aomex/aomex/compare/v3.0.0...v3.1.0) (2024-09-13)


### Bug Fixes

* update peer deps ([98b7c10](https://github.com/aomex/aomex/commit/98b7c10068a3c62a0361b1b43a86728a7d445ab5))






# [2.2.0](https://github.com/aomex/aomex/compare/v2.1.0...v2.2.0) (2024-08-05)


### Features

* **cache:** 适配器模式 ([ac8c318](https://github.com/aomex/aomex/commit/ac8c318ec67d6f880c8d291fc341f5156a6b47d9))





# [2.1.0](https://github.com/aomex/aomex/compare/v2.0.2...v2.1.0) (2024-07-28)

**Note:** Version bump only for package @aomex/cron





## [2.0.2](https://github.com/aomex/aomex/compare/v2.0.1...v2.0.2) (2024-07-27)


### Bug Fixes

* **cron:** overlap和concurrent概念重叠 ([5453764](https://github.com/aomex/aomex/commit/5453764284d0c6d4143267b0694a530a29432b96))





## [2.0.1](https://github.com/aomex/aomex/compare/v2.0.0...v2.0.1) (2024-07-26)


### Bug Fixes

* 未更新peerDependencies ([0492453](https://github.com/aomex/aomex/commit/0492453d5a748aa6dd2047622a19a86dc7b6036e))





# [2.0.0](https://github.com/aomex/aomex/compare/v1.7.0...v2.0.0) (2024-07-26)


### Features

* **cache:** 新的缓存库 ([cca0b52](https://github.com/aomex/aomex/commit/cca0b52d86029fb1303cd9bd1f362d2dd8b406b6))
* **console:** commander合并到console库 ([e41df73](https://github.com/aomex/aomex/commit/e41df73517ddefbad253d1decede8cc938e31f26))


### BREAKING CHANGES

* **cache:** 1. 删除了memory-cache,redis-cache,file-cache
2. 采用适配器形式创建缓存实例
* **console:** @aomex/commander已被删除





# [1.7.0](https://github.com/aomex/aomex/compare/v1.6.0...v1.7.0) (2024-07-13)

**Note:** Version bump only for package @aomex/cron





# [1.6.0](https://github.com/aomex/aomex/compare/v1.5.1...v1.6.0) (2024-07-05)

**Note:** Version bump only for package @aomex/cron





## [1.5.1](https://github.com/aomex/aomex/compare/v1.5.0...v1.5.1) (2024-07-04)

**Note:** Version bump only for package @aomex/cron





# [1.5.0](https://github.com/aomex/aomex/compare/v1.4.0...v1.5.0) (2024-07-04)

**Note:** Version bump only for package @aomex/cron





# [1.4.0](https://github.com/aomex/aomex/compare/v1.3.0...v1.4.0) (2024-06-29)

**Note:** Version bump only for package @aomex/cron





# [1.3.0](https://github.com/aomex/aomex/compare/v1.2.0...v1.3.0) (2024-06-28)


### Features

* **core:** 删除中间件链条概念 ([12f42e6](https://github.com/aomex/aomex/commit/12f42e6ba15f3118b98f5ff31832121b1b2b9896))





# [1.2.0](https://github.com/aomex/aomex/compare/v1.1.0...v1.2.0) (2024-06-27)

**Note:** Version bump only for package @aomex/cron





# 1.1.0 (2024-06-27)


### Features

* 初始化 ([3350159](https://github.com/aomex/aomex/commit/3350159454ad230e6d910405f907293b059b1f49))

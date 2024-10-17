# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [3.6.0](https://github.com/aomex/aomex/compare/v3.5.0...v3.6.0) (2024-10-17)


### Features

* **async-trace:** 方法追踪时，默认标签优先使用displayName属性 ([4458c39](https://github.com/aomex/aomex/commit/4458c397da7498a51323f45e874e1689fb6ac81b))
* **async-trace:** 记录报错信息 ([4861ee0](https://github.com/aomex/aomex/commit/4861ee03b09869b395f26b2aa3e3aa70dc27fe1f))
* **core:** 服务层displayName自动去掉service后缀 ([581017f](https://github.com/aomex/aomex/commit/581017f98405b23d0d1827a3fd7b8d0fb3898bfd))





# [3.5.0](https://github.com/aomex/aomex/compare/v3.4.2...v3.5.0) (2024-10-16)


### Features

* **cron:** 子任务支持source-maps ([968b44d](https://github.com/aomex/aomex/commit/968b44d08132f0d6d379ff84c5fe56f033965ee0))
* **cron:** 子任务支持输出颜色 ([58a7530](https://github.com/aomex/aomex/commit/58a75303a037aef2bf5c416fe8c9a7356809de45))





## [3.4.2](https://github.com/aomex/aomex/compare/v3.4.1...v3.4.2) (2024-10-07)


### Bug Fixes

* **auth:** contextKey在路由层无法使用类型推导 ([2d787df](https://github.com/aomex/aomex/commit/2d787df16256c669b26b221359834a380ec2b6ed))





## [3.4.1](https://github.com/aomex/aomex/compare/v3.4.0...v3.4.1) (2024-10-06)


### Bug Fixes

* **core:** 中间件skip返回类型无法使用在app ([801b791](https://github.com/aomex/aomex/commit/801b791247d6f74b61fe4c513866c759dc5c9f84))





# [3.4.0](https://github.com/aomex/aomex/compare/v3.3.0...v3.4.0) (2024-10-04)


### Bug Fixes

* **cache:** key转为hash导致无法快速查找 ([09bf73e](https://github.com/aomex/aomex/commit/09bf73eb34c7fcb7477e01572f19ed2bdf7ef11e))
* **console:** terminal无法打印字符串以外的值 ([622bd85](https://github.com/aomex/aomex/commit/622bd85bed5878faa274b02ece6607c59aa44e9b))


### Features

* **cache:** 支持存储Map和Set类型 ([4cf2943](https://github.com/aomex/aomex/commit/4cf2943e87fd4511472e516a243154e0eb0ec8ae))
* **core:** date-time规则增加解析格式 ([3b2ab20](https://github.com/aomex/aomex/commit/3b2ab20daccbd0a637f9e3950035d4e3bea018b5))
* **web:** request暴露headers和rawHeaders属性 ([3f15488](https://github.com/aomex/aomex/commit/3f154882429860c1a6100194c9d42af40f077728))





# [3.3.0](https://github.com/aomex/aomex/compare/v3.2.4...v3.3.0) (2024-09-26)


### Features

* **cron:** 增加overlap属性 ([8853059](https://github.com/aomex/aomex/commit/885305937608e0b92182ebac09e10a4226a33ae7))





## [3.2.4](https://github.com/aomex/aomex/compare/v3.2.3...v3.2.4) (2024-09-25)


### Bug Fixes

* **console:** 设置单个i18n语言没有意义 ([1984782](https://github.com/aomex/aomex/commit/198478221c5822cd9c6b4179238e03a314a0ad2e))
* **web:** 设置单个i18n语言没有意义 ([2e1b977](https://github.com/aomex/aomex/commit/2e1b977f4d496850662ea76de00c42367ea429f8))





## [3.2.3](https://github.com/aomex/aomex/compare/v3.2.2...v3.2.3) (2024-09-25)

**Note:** Version bump only for package aomex





## [3.2.2](https://github.com/aomex/aomex/compare/v3.2.1...v3.2.2) (2024-09-19)


### Bug Fixes

* **console:** terminal.runTasks 设置标题无效 ([bd6aa81](https://github.com/aomex/aomex/commit/bd6aa81983c0c88c5955436f4b5e485e85afe018))





## [3.2.1](https://github.com/aomex/aomex/compare/v3.2.0...v3.2.1) (2024-09-17)


### Bug Fixes

* **console:** generateTable结尾多生成了一个换行符 ([0c1f145](https://github.com/aomex/aomex/commit/0c1f145bfa03017add8f3f59a1372ace5f85555c))


### Performance Improvements

* **cron:** 美化终端列表 ([5b18187](https://github.com/aomex/aomex/commit/5b18187b1c8f94fa290c52ad74c0a15d791ea4dc))





# [3.2.0](https://github.com/aomex/aomex/compare/v3.1.1...v3.2.0) (2024-09-17)


### Bug Fixes

* **console:** typescript@5.4在filter场景无法收窄类型 ([f8bbe56](https://github.com/aomex/aomex/commit/f8bbe56b4d7098f26e01e6db8dfd7a332c1a616c))


### Features

* **cache-redis-adapter:** redis启用延迟连接 ([9a72142](https://github.com/aomex/aomex/commit/9a721421e6b8db273b052a3678ee6daaef12f5da))
* **console:** 增加终端实用函数 ([1a172f6](https://github.com/aomex/aomex/commit/1a172f654b049eb3e975dbc08c883de708f02869))





## [3.1.1](https://github.com/aomex/aomex/compare/v3.1.0...v3.1.1) (2024-09-13)


### Bug Fixes

* **cache-redis-adapter:** 依赖了需要用户安装的库 ([cb8ae3c](https://github.com/aomex/aomex/commit/cb8ae3c3c08a875b9ba2b6b5cc4ab65216152093))
* **core:** 打包后相对路径定义的模块无效 ([8b6e705](https://github.com/aomex/aomex/commit/8b6e7055814efd2f6743700b7718d03b7a1ff0df))
* **rate-limit-redis-store:** 依赖了需要用户安装的库 ([0bf9dff](https://github.com/aomex/aomex/commit/0bf9dff627a769e9d8181e61efb954381a9d59c1))





# [3.1.0](https://github.com/aomex/aomex/compare/v3.0.0...v3.1.0) (2024-09-13)


### Bug Fixes

* update peer deps ([98b7c10](https://github.com/aomex/aomex/commit/98b7c10068a3c62a0361b1b43a86728a7d445ab5))


### Features

* **auth-jwt-adapter:** 泛型支持处理过的数据 ([6417891](https://github.com/aomex/aomex/commit/641789178f6b87cf50e0d6ff451ffbe912ba3257))
* **auth:** 适配器使用函数入口 ([913314c](https://github.com/aomex/aomex/commit/913314cbb5dc23236fa4e6f71b46208dfd22f941))
* **cache:** 适配器提供函数入口 ([f626b13](https://github.com/aomex/aomex/commit/f626b13bdc6a6740ef6da29e75d60e7510793c0c))





# 3.0.0 (2024-08-10)

### Features

* **core:** uuid增加6/7/8三个版本 ([d37c2b0](https://github.com/aomex/aomex/commit/d37c2b09744a747c692b8c48dd2968e1315cbfb4))





# [2.2.0](https://github.com/aomex/aomex/compare/v2.1.0...v2.2.0) (2024-08-05)


### Bug Fixes

* **core:** rule.allOf返回了联合类型 ([061121c](https://github.com/aomex/aomex/commit/061121cd42f6f326a367e98434391aa3e1664379))


### Features

* **auth:** 身份认证中间件 ([03d0f43](https://github.com/aomex/aomex/commit/03d0f436e8bf51ee8100dbb7d44f9cb96089cffb))
* **cache:** 适配器模式 ([ac8c318](https://github.com/aomex/aomex/commit/ac8c318ec67d6f880c8d291fc341f5156a6b47d9))





# [2.1.0](https://github.com/aomex/aomex/compare/v2.0.2...v2.1.0) (2024-07-28)


### Bug Fixes

* **console:** 帮助信息未国际化 ([d68370f](https://github.com/aomex/aomex/commit/d68370fa8c248d207db819d5cdda90b26981bb2f))
* **core:** rule.oneOf验证器匹配超过一个规则未报错 ([9052e20](https://github.com/aomex/aomex/commit/9052e2099fa0516c40d7824c898293563d2d4407))


### Features

* **core:** 增加allOf验证器 ([d74feb1](https://github.com/aomex/aomex/commit/d74feb1c463d4febbcf0980e314b2fc15373911d))
* **core:** 增加allOf验证器 ([81e24cc](https://github.com/aomex/aomex/commit/81e24cc78c11d5122b92b4ee6f47132e894e5e4b))





## [2.0.2](https://github.com/aomex/aomex/compare/v2.0.1...v2.0.2) (2024-07-27)


### Bug Fixes

* **cron:** overlap和concurrent概念重叠 ([5453764](https://github.com/aomex/aomex/commit/5453764284d0c6d4143267b0694a530a29432b96))





## [2.0.1](https://github.com/aomex/aomex/compare/v2.0.0...v2.0.1) (2024-07-26)


### Bug Fixes

* **cache-redis-store:** 包名错误 ([b6839f8](https://github.com/aomex/aomex/commit/b6839f89a7291ba0cfa765c5acd79233d789d052))
* **swagger-ui:** 网页资源加载失败 ([4e4526b](https://github.com/aomex/aomex/commit/4e4526b7fd6bbcf1b8f35851fde4f7032ab9e081))
* **swagger-ui:** 静态文件未发布到npm ([2abebca](https://github.com/aomex/aomex/commit/2abebca6cbb747a693476e0be0907424f1389826))
* 未更新peerDependencies ([0492453](https://github.com/aomex/aomex/commit/0492453d5a748aa6dd2047622a19a86dc7b6036e))





# [2.0.0](https://github.com/aomex/aomex/compare/v1.7.0...v2.0.0) (2024-07-26)


### Bug Fixes

* **openapi:** generateOpenapi返回了错误的类型 ([8850020](https://github.com/aomex/aomex/commit/88500207da300caf8bfaa2fffe717bc63e1ca73d))
* **openapi:** 保存文件时使用更严格的方式判断后缀 ([a69ae0f](https://github.com/aomex/aomex/commit/a69ae0f791e18d6b322313709b3874e4efffd128))


### Features

* **cache:** 新的缓存库 ([cca0b52](https://github.com/aomex/aomex/commit/cca0b52d86029fb1303cd9bd1f362d2dd8b406b6))
* **console:** commander合并到console库 ([e41df73](https://github.com/aomex/aomex/commit/e41df73517ddefbad253d1decede8cc938e31f26))
* **serve-static:** 增加formatPath参数 ([226d8cd](https://github.com/aomex/aomex/commit/226d8cd914b907679bf0b68e0b00e21bc25cf42e))
* **swagger-ui:** swagger服务 ([c024922](https://github.com/aomex/aomex/commit/c02492206a9c7bc38964ee7a687a7e8bcf9b3f65))
* **swagger-ui:** 识别.yml后缀 ([bd8b716](https://github.com/aomex/aomex/commit/bd8b71642c93bb3a5e60412d73f6c5d4d4351907))
* **web:** router库合并到web库 ([7268973](https://github.com/aomex/aomex/commit/72689738b9a7eb1eb77c9b0bb651d47e58ed5532))
* **web:** 路由组支持设置文档说明 ([1452ecc](https://github.com/aomex/aomex/commit/1452ecc5ae6d50c5b4f230967dca5cbf58b1378d))


### BREAKING CHANGES

* **cache:** 1. 删除了memory-cache,redis-cache,file-cache
2. 采用适配器形式创建缓存实例
* **web:** @aomex/router已被删除
* **console:** @aomex/commander已被删除





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

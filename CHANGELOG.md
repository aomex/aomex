# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 3.0.0 (2024-08-10)


### Bug Fixes

* **cache-redis-store:** 包名错误 ([b8533f5](https://github.com/aomex/aomex/commit/b8533f53945b8ca63df297f7148b7f291ee7c807))
* **console:** 帮助信息未国际化 ([e3a156b](https://github.com/aomex/aomex/commit/e3a156b0e79c2a14266e312c7a0e157010fb2db2))
* **core:** rule.allOf返回了联合类型 ([fff9edf](https://github.com/aomex/aomex/commit/fff9edf11d3da7b60b286a194e86f7ffb67c39aa))
* **core:** rule.oneOf验证器匹配超过一个规则未报错 ([a0e2fe1](https://github.com/aomex/aomex/commit/a0e2fe1e9837464ba3e7042ff12b001c2c064486))
* **cron:** overlap和concurrent概念重叠 ([02b8bfd](https://github.com/aomex/aomex/commit/02b8bfdcd9bb9312877a4598e39d5541a90cd204))
* **openapi:** generateOpenapi返回了错误的类型 ([78da9f9](https://github.com/aomex/aomex/commit/78da9f905f41e67a499f1459b46639a5354cd24b))
* **openapi:** 保存文件时使用更严格的方式判断后缀 ([8e47e7f](https://github.com/aomex/aomex/commit/8e47e7fb2be8f64693f2743b33b2473812bbe55b))
* **serve-static:** 发送压缩文件时不能设置content-length ([19c0e82](https://github.com/aomex/aomex/commit/19c0e820a4ca0a71862c7ae2cb23d81145c08bae))
* **swagger-ui:** 网页资源加载失败 ([18444f3](https://github.com/aomex/aomex/commit/18444f385d99f6b50089aa7a780a7c753599d08b))
* **swagger-ui:** 静态文件未发布到npm ([84f6225](https://github.com/aomex/aomex/commit/84f62254f09a6daa382e5cd0acf4f4e87a8ad7ae))
* 打包时遇到类型报错 ([37817fe](https://github.com/aomex/aomex/commit/37817fe4007f4ae08d84d0d33df0d1bb58919546))
* 未更新peerDependencies ([66ac871](https://github.com/aomex/aomex/commit/66ac8719ad443f5ab868d37ed1a49f4cc40decc2))


### Features

* **async-trace:** traceMiddleware的记录回调函数增加ctx参数 ([aef3e55](https://github.com/aomex/aomex/commit/aef3e55f96c05565e78b475063588f76e56ba908))
* **async-trace:** 追踪方法时允许不传参数 ([c7c7bc2](https://github.com/aomex/aomex/commit/c7c7bc28c0d05679e248bbeb6ba904b4a98851d5))
* **auth:** 身份认证中间件 ([101626f](https://github.com/aomex/aomex/commit/101626f2ec9f65dd8bec29ebacaa1998fd3d7862))
* **cache:** 新的缓存库 ([3689c79](https://github.com/aomex/aomex/commit/3689c7991894c6dd8dc3d07979cd05c6e9cf9a34))
* **cache:** 适配器模式 ([d414863](https://github.com/aomex/aomex/commit/d41486377489db660c26a4752c94dfff07ea6942))
* **console:** commander合并到console库 ([8b3961b](https://github.com/aomex/aomex/commit/8b3961b80cace7c1d76540475090b03a215ae47f))
* **console:** 未找到指令时，只提示最匹配的一个指令 ([b990569](https://github.com/aomex/aomex/commit/b990569cbf8922546233ed501987bd4c8ef84073))
* **core:** uuid增加6/7/8三个版本 ([d37c2b0](https://github.com/aomex/aomex/commit/d37c2b09744a747c692b8c48dd2968e1315cbfb4))
* **core:** 删除中间件链条概念 ([48d50cc](https://github.com/aomex/aomex/commit/48d50cc0dc892859b6467344f03a38c111325fc0))
* **core:** 增加allOf验证器 ([ff9df59](https://github.com/aomex/aomex/commit/ff9df5986fc13e975abc8b0a79f3b7cc61216e3c))
* **core:** 增加allOf验证器 ([d44538d](https://github.com/aomex/aomex/commit/d44538dec8db6f7fc1563e8a1f1eca417d46b50d))
* **core:** 数字验证器增加precision方法 ([946a52d](https://github.com/aomex/aomex/commit/946a52db8514ca1e0e899ec6433075ccab594c0b))
* **openapi:** 允许自定义指令名称 ([720041f](https://github.com/aomex/aomex/commit/720041f02d660d0856d21d4f392aaaf02e60ff1b))
* **openapi:** 增加generateOpenapi函数快速生成文档 ([2f73b9a](https://github.com/aomex/aomex/commit/2f73b9a361318207f41afeb68d63ddf9b7720fac))
* **router:** 删除路径数组格式 ([b69abe9](https://github.com/aomex/aomex/commit/b69abe9185d59b670bd7ba547a2f032c7a9d0b02))
* **router:** 路由增加文档属性 showInOpenapi ([2ca60ab](https://github.com/aomex/aomex/commit/2ca60ab17ea1e4bb7a7c9b5ab797f0f1633a45fb))
* **serve-static:** 增加formatPath参数 ([fa962cc](https://github.com/aomex/aomex/commit/fa962cce5ca0b519b07751276571f52d8c844ccc))
* **serve-static:** 增加静态文件服务 ([9f562f9](https://github.com/aomex/aomex/commit/9f562f96c97da50ef7bc1fad35e0c033efa63df5))
* **swagger-ui:** swagger服务 ([fcdbca2](https://github.com/aomex/aomex/commit/fcdbca22afb467bbb7096952fbe75e6447495f0d))
* **swagger-ui:** 识别.yml后缀 ([55341d9](https://github.com/aomex/aomex/commit/55341d923e555bd76b17be3312339cadc8013243))
* **web:** request.body改为同步获取 ([d1d00bc](https://github.com/aomex/aomex/commit/d1d00bc3de4e9997e6c8b33fdd4b465201f686bd))
* **web:** response.download修改签名 ([acf09ac](https://github.com/aomex/aomex/commit/acf09ac4fea0543811e39bbc6ffcbd69f86c0047))
* **web:** router库合并到web库 ([d7c71fe](https://github.com/aomex/aomex/commit/d7c71feb9eeeabc1509522e655d4afedee274140))
* **web:** 开启debug时如实响应5xx错误信息 ([1dc9cd2](https://github.com/aomex/aomex/commit/1dc9cd2ac234548e3d90632df221a64959243d2e))
* **web:** 请求实体包含二进制类型时，采用multipart/form-data的文档格式 ([d9cf1b6](https://github.com/aomex/aomex/commit/d9cf1b6c4c9a85dae5b1235c7ab188204f4d2508))
* **web:** 路由组支持设置文档说明 ([63f2fe0](https://github.com/aomex/aomex/commit/63f2fe0afce5dc247bc6a56bd63611595f4ca6de))
* 初始化 ([a370720](https://github.com/aomex/aomex/commit/a37072001cf19f09687623add2442236ab19d7ed))


### Performance Improvements

* **router:** 多个method共享匹配逻辑 ([786a391](https://github.com/aomex/aomex/commit/786a3917dd8471ce535fc603d21962b0adfd2091))
* **router:** 路由细分为动静态路由，加速匹配 ([dcbfbf9](https://github.com/aomex/aomex/commit/dcbfbf94d299dc45b592c01359d20b98b993b554))


### BREAKING CHANGES

* **cache:** 1. 删除了memory-cache,redis-cache,file-cache
2. 采用适配器形式创建缓存实例
* **web:** @aomex/router已被删除
* **console:** @aomex/commander已被删除





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

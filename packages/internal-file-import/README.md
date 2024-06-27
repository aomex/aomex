# @aomex/internal-file-import

aomex内部文件匹配库

## pathToFiles

返回类型：`string[]`

根据路径匹配出（子）目录下的所有js文件，文件后缀：`js,ts,mjs,mts`

## getFileValues

返回类型：`T[]`

动态导入给定的文件，获得导出的所有值并去重

// @ts-nocheck
import { rule } from '@aomex/common';

import { overrideColumnsFactory } from '@aomex/prisma';
// 如果想覆盖默认生成的类型，可以同目录下创建一个 index.override.ts 文件，然后重新执行 prisma generate 命令
// import customColumns from './index.override';
const customColumns = overrideColumnsFactory<PrismaSchemaMap>()({});

function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
  const subObj: Partial<T> = {};
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      subObj[key] = obj[key];
    }
  }
  return subObj;
}

function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
  const allKeys = Object.keys(obj) as K[];
  return pick(obj, ...allKeys.filter((key) => !keys.includes(key)));
}

const LanguageEnum = <const>['Typescript', 'Javascript', 'Rust', 'Go', 'Python', 'Cpp'];

const YourTypeType = {
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().optional()`
   */
  abc: customColumns.YourTypeType?.abc?.input || rule.string().optional(),

  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  cde: customColumns.YourTypeType?.cde?.input || rule.enum(LanguageEnum),
};

const MyTypeType = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.MyTypeType?.id?.input || rule.int(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: customColumns.MyTypeType?.name?.input || rule.string(),

  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(YourTypeType)`
   */
  other: customColumns.MyTypeType?.other?.input || rule.object(YourTypeType),
};

const IAmAloseNotUsedType = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  id: customColumns.IAmAloseNotUsedType?.id?.input || rule.string(),
};

const IAmNotUsedType = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  id: customColumns.IAmNotUsedType?.id?.input || rule.string(),
};

const userInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: customColumns.user?.id?.input || rule.string().optional(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: customColumns.user?.name?.input || rule.string(),

  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().optional()`
   */
  name_nu: customColumns.user?.name_nu?.input || rule.string().optional(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   *
   * 运行时规则：`rule.string().optional()`
   */
  name_de: customColumns.user?.name_de?.input || rule.string().optional(),

  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.string())`
   */
  str_arr: customColumns.user?.str_arr?.input || rule.array(rule.string()),

  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.string()).optional()`
   */
  str_arr_de:
    customColumns.user?.str_arr_de?.input || rule.array(rule.string()).optional(),

  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  age: customColumns.user?.age?.input || rule.int(),

  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int().optional()`
   */
  age_nu: customColumns.user?.age_nu?.input || rule.int().optional(),

  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.int().optional()`
   */
  age_de: customColumns.user?.age_de?.input || rule.int().optional(),

  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.int())`
   */
  int_arr: customColumns.user?.int_arr?.input || rule.array(rule.int()),

  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.int()).optional()`
   */
  int_arr_de: customColumns.user?.int_arr_de?.input || rule.array(rule.int()).optional(),

  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
   */
  obj: customColumns.user?.obj?.input || rule.anyOf([rule.object(), rule.array()]),

  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"{}"`
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()]).optional()`
   */
  obj_de_obj:
    customColumns.user?.obj_de_obj?.input ||
    rule.anyOf([rule.object(), rule.array()]).optional(),

  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"[]"`
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()]).optional()`
   */
  obj_de_arr:
    customColumns.user?.obj_de_arr?.input ||
    rule.anyOf([rule.object(), rule.array()]).optional(),

  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number()`
   */
  flo: customColumns.user?.flo?.input || rule.number(),

  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().optional()`
   */
  flo_nu: customColumns.user?.flo_nu?.input || rule.number().optional(),

  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   *
   * 运行时规则：`rule.number().optional()`
   */
  flo_de: customColumns.user?.flo_de?.input || rule.number().optional(),

  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.number())`
   */
  flo_arr: customColumns.user?.flo_arr?.input || rule.array(rule.number()),

  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：`[100.10000000000001]`
   *
   * 运行时规则：`rule.array(rule.number()).optional()`
   */
  flo_arr_de:
    customColumns.user?.flo_arr_de?.input || rule.array(rule.number()).optional(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   *
   * 运行时规则：`rule.uuid(["v4"]).optional()`
   */
  uu: customColumns.user?.uu?.input || rule.uuid(['v4']).optional(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().docs({ description: "I am the comments" })`
   *
   * I am the comments
   */
  comme_ok:
    customColumns.user?.comme_ok?.input ||
    rule.string().docs({ description: 'I am the comments' }),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  comme_fail: customColumns.user?.comme_fail?.input || rule.string(),

  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  lang: customColumns.user?.lang?.input || rule.enum(LanguageEnum),

  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum).optional()`
   */
  lang_nu: customColumns.user?.lang_nu?.input || rule.enum(LanguageEnum).optional(),

  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   *
   * 运行时规则：`rule.enum(LanguageEnum).optional()`
   */
  lang_de: customColumns.user?.lang_de?.input || rule.enum(LanguageEnum).optional(),

  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date()`
   */
  time: customColumns.user?.time?.input || rule.date(),

  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date().optional()`
   */
  time_nu: customColumns.user?.time_nu?.input || rule.date().optional(),

  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   *
   * 运行时规则：`rule.date().optional()`
   */
  time_de: customColumns.user?.time_de?.input || rule.date().optional(),

  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean()`
   */
  boo: customColumns.user?.boo?.input || rule.boolean(),

  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean().optional()`
   */
  boo_nu: customColumns.user?.boo_nu?.input || rule.boolean().optional(),

  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   *
   * 运行时规则：`rule.boolean().optional()`
   */
  boo_de: customColumns.user?.boo_de?.input || rule.boolean().optional(),

  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint()`
   */
  big: customColumns.user?.big?.input || rule.bigint(),

  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint().optional()`
   */
  big_nu: customColumns.user?.big_nu?.input || rule.bigint().optional(),

  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   *
   * 运行时规则：`rule.bigint().optional()`
   */
  big_de: customColumns.user?.big_de?.input || rule.bigint().optional(),

  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer()`
   */
  byt: customColumns.user?.byt?.input || rule.buffer(),

  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer().optional()`
   */
  byt_nu: customColumns.user?.byt_nu?.input || rule.buffer().optional(),

  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   *
   * 运行时规则：`rule.buffer().optional()`
   */
  byt_de: customColumns.user?.byt_de?.input || rule.buffer().optional(),

  /**
   * Prisma类型：`MyType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeType)`
   */
  custom: customColumns.user?.custom?.input || rule.object(MyTypeType),

  /**
   * Prisma类型：`MyType?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeType).optional()`
   */
  custom_nu: customColumns.user?.custom_nu?.input || rule.object(MyTypeType).optional(),

  /**
   * Prisma类型：`MyType[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(MyTypeType)`
   */
  custom_arr: customColumns.user?.custom_arr?.input || rule.array(MyTypeType),
};

const userOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: customColumns.user?.id?.input || rule.string(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: customColumns.user?.name?.input || rule.string(),

  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().nullable()`
   */
  name_nu: customColumns.user?.name_nu?.input || rule.string().nullable(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   *
   * 运行时规则：`rule.string()`
   */
  name_de: customColumns.user?.name_de?.input || rule.string(),

  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.string())`
   */
  str_arr: customColumns.user?.str_arr?.input || rule.array(rule.string()),

  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.string())`
   */
  str_arr_de: customColumns.user?.str_arr_de?.input || rule.array(rule.string()),

  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  age: customColumns.user?.age?.input || rule.int(),

  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int().nullable()`
   */
  age_nu: customColumns.user?.age_nu?.input || rule.int().nullable(),

  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.int()`
   */
  age_de: customColumns.user?.age_de?.input || rule.int(),

  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.int())`
   */
  int_arr: customColumns.user?.int_arr?.input || rule.array(rule.int()),

  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.int())`
   */
  int_arr_de: customColumns.user?.int_arr_de?.input || rule.array(rule.int()),

  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
   */
  obj: customColumns.user?.obj?.input || rule.anyOf([rule.object(), rule.array()]),

  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"{}"`
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
   */
  obj_de_obj:
    customColumns.user?.obj_de_obj?.input || rule.anyOf([rule.object(), rule.array()]),

  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"[]"`
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
   */
  obj_de_arr:
    customColumns.user?.obj_de_arr?.input || rule.anyOf([rule.object(), rule.array()]),

  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number()`
   */
  flo: customColumns.user?.flo?.input || rule.number(),

  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().nullable()`
   */
  flo_nu: customColumns.user?.flo_nu?.input || rule.number().nullable(),

  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   *
   * 运行时规则：`rule.number()`
   */
  flo_de: customColumns.user?.flo_de?.input || rule.number(),

  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.number())`
   */
  flo_arr: customColumns.user?.flo_arr?.input || rule.array(rule.number()),

  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：`[100.10000000000001]`
   *
   * 运行时规则：`rule.array(rule.number())`
   */
  flo_arr_de: customColumns.user?.flo_arr_de?.input || rule.array(rule.number()),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   *
   * 运行时规则：`rule.uuid(["v4"])`
   */
  uu: customColumns.user?.uu?.input || rule.uuid(['v4']),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().docs({ description: "I am the comments" })`
   *
   * I am the comments
   */
  comme_ok:
    customColumns.user?.comme_ok?.input ||
    rule.string().docs({ description: 'I am the comments' }),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  comme_fail: customColumns.user?.comme_fail?.input || rule.string(),

  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  lang: customColumns.user?.lang?.input || rule.enum(LanguageEnum),

  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum).nullable()`
   */
  lang_nu: customColumns.user?.lang_nu?.input || rule.enum(LanguageEnum).nullable(),

  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  lang_de: customColumns.user?.lang_de?.input || rule.enum(LanguageEnum),

  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date()`
   */
  time: customColumns.user?.time?.input || rule.date(),

  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date().nullable()`
   */
  time_nu: customColumns.user?.time_nu?.input || rule.date().nullable(),

  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   *
   * 运行时规则：`rule.date()`
   */
  time_de: customColumns.user?.time_de?.input || rule.date(),

  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean()`
   */
  boo: customColumns.user?.boo?.input || rule.boolean(),

  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean().nullable()`
   */
  boo_nu: customColumns.user?.boo_nu?.input || rule.boolean().nullable(),

  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   *
   * 运行时规则：`rule.boolean()`
   */
  boo_de: customColumns.user?.boo_de?.input || rule.boolean(),

  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint()`
   */
  big: customColumns.user?.big?.input || rule.bigint(),

  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint().nullable()`
   */
  big_nu: customColumns.user?.big_nu?.input || rule.bigint().nullable(),

  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   *
   * 运行时规则：`rule.bigint()`
   */
  big_de: customColumns.user?.big_de?.input || rule.bigint(),

  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer()`
   */
  byt: customColumns.user?.byt?.input || rule.buffer(),

  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer().nullable()`
   */
  byt_nu: customColumns.user?.byt_nu?.input || rule.buffer().nullable(),

  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   *
   * 运行时规则：`rule.buffer()`
   */
  byt_de: customColumns.user?.byt_de?.input || rule.buffer(),

  /**
   * Prisma类型：`MyType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeType)`
   */
  custom: customColumns.user?.custom?.input || rule.object(MyTypeType),

  /**
   * Prisma类型：`MyType?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeType).nullable()`
   */
  custom_nu: customColumns.user?.custom_nu?.input || rule.object(MyTypeType).nullable(),

  /**
   * Prisma类型：`MyType[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(MyTypeType)`
   */
  custom_arr: customColumns.user?.custom_arr?.input || rule.array(MyTypeType),
};

const profileInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: customColumns.profile?.id?.input || rule.string().optional(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: customColumns.profile?.user_id?.input || rule.string(),
};

const profileOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: customColumns.profile?.id?.input || rule.string(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: customColumns.profile?.user_id?.input || rule.string(),
};

const postInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: customColumns.post?.id?.input || rule.string().optional(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: customColumns.post?.user_id?.input || rule.string(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: customColumns.post?.name?.input || rule.string(),
};

const postOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: customColumns.post?.id?.input || rule.string(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: customColumns.post?.user_id?.input || rule.string(),

  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: customColumns.post?.name?.input || rule.string(),
};

const aliasTableNameInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: customColumns.aliasTableName?.id?.input || rule.string().optional(),
};

const aliasTableNameOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: customColumns.aliasTableName?.id?.input || rule.string(),
};

export const prismaInput = <const>{
  user: {
    /** 所有字段对象 */
    columns: userInputColumns,
    /** 选择部分字段 */
    pick: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'str_arr'
        | 'str_arr_de'
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'int_arr'
        | 'int_arr_de'
        | 'obj'
        | 'obj_de_obj'
        | 'obj_de_arr'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'flo_arr'
        | 'flo_arr_de'
        | 'uu'
        | 'comme_ok'
        | 'comme_fail'
        | 'lang'
        | 'lang_nu'
        | 'lang_de'
        | 'time'
        | 'time_nu'
        | 'time_de'
        | 'boo'
        | 'boo_nu'
        | 'boo_de'
        | 'big'
        | 'big_nu'
        | 'big_de'
        | 'byt'
        | 'byt_nu'
        | 'byt_de',
    >(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof userInputColumns)[K] } => {
      // @ts-ignore
      return pick(userInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'str_arr'
        | 'str_arr_de'
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'int_arr'
        | 'int_arr_de'
        | 'obj'
        | 'obj_de_obj'
        | 'obj_de_arr'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'flo_arr'
        | 'flo_arr_de'
        | 'uu'
        | 'comme_ok'
        | 'comme_fail'
        | 'lang'
        | 'lang_nu'
        | 'lang_de'
        | 'time'
        | 'time_nu'
        | 'time_de'
        | 'boo'
        | 'boo_nu'
        | 'boo_de'
        | 'big'
        | 'big_nu'
        | 'big_de'
        | 'byt'
        | 'byt_nu'
        | 'byt_de',
    >(
      ...keys: Keys[]
    ): {
      [K in keyof typeof userInputColumns as K extends Keys
        ? never
        : K]: (typeof userInputColumns)[K];
    } => {
      // @ts-ignore
      return omit(userInputColumns, ...keys);
    },
  },

  profile: {
    /** 所有字段对象 */
    columns: profileInputColumns,
    /** 选择部分字段 */
    pick: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof profileInputColumns)[K] } => {
      // @ts-ignore
      return pick(profileInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ): {
      [K in keyof typeof profileInputColumns as K extends Keys
        ? never
        : K]: (typeof profileInputColumns)[K];
    } => {
      // @ts-ignore
      return omit(profileInputColumns, ...keys);
    },
  },

  post: {
    /** 所有字段对象 */
    columns: postInputColumns,
    /** 选择部分字段 */
    pick: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof postInputColumns)[K] } => {
      // @ts-ignore
      return pick(postInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ): {
      [K in keyof typeof postInputColumns as K extends Keys
        ? never
        : K]: (typeof postInputColumns)[K];
    } => {
      // @ts-ignore
      return omit(postInputColumns, ...keys);
    },
  },

  aliasTableName: {
    /** 所有字段对象 */
    columns: aliasTableNameInputColumns,
    /** 选择部分字段 */
    pick: <Keys extends 'id'>(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof aliasTableNameInputColumns)[K] } => {
      // @ts-ignore
      return pick(aliasTableNameInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ): {
      [K in keyof typeof aliasTableNameInputColumns as K extends Keys
        ? never
        : K]: (typeof aliasTableNameInputColumns)[K];
    } => {
      // @ts-ignore
      return omit(aliasTableNameInputColumns, ...keys);
    },
  },
};

export const prismaOutput = <const>{
  user: {
    /** 所有字段对象 */
    columns: userOutputColumns,
    /** 选择部分字段 */
    pick: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'str_arr'
        | 'str_arr_de'
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'int_arr'
        | 'int_arr_de'
        | 'obj'
        | 'obj_de_obj'
        | 'obj_de_arr'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'flo_arr'
        | 'flo_arr_de'
        | 'uu'
        | 'comme_ok'
        | 'comme_fail'
        | 'lang'
        | 'lang_nu'
        | 'lang_de'
        | 'time'
        | 'time_nu'
        | 'time_de'
        | 'boo'
        | 'boo_nu'
        | 'boo_de'
        | 'big'
        | 'big_nu'
        | 'big_de'
        | 'byt'
        | 'byt_nu'
        | 'byt_de',
    >(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof userOutputColumns)[K] } => {
      // @ts-ignore
      return pick(userOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'str_arr'
        | 'str_arr_de'
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'int_arr'
        | 'int_arr_de'
        | 'obj'
        | 'obj_de_obj'
        | 'obj_de_arr'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'flo_arr'
        | 'flo_arr_de'
        | 'uu'
        | 'comme_ok'
        | 'comme_fail'
        | 'lang'
        | 'lang_nu'
        | 'lang_de'
        | 'time'
        | 'time_nu'
        | 'time_de'
        | 'boo'
        | 'boo_nu'
        | 'boo_de'
        | 'big'
        | 'big_nu'
        | 'big_de'
        | 'byt'
        | 'byt_nu'
        | 'byt_de',
    >(
      ...keys: Keys[]
    ): {
      [K in keyof typeof userOutputColumns as K extends Keys
        ? never
        : K]: (typeof userOutputColumns)[K];
    } => {
      // @ts-ignore
      return omit(userOutputColumns, ...keys);
    },
  },

  profile: {
    /** 所有字段对象 */
    columns: profileOutputColumns,
    /** 选择部分字段 */
    pick: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof profileOutputColumns)[K] } => {
      // @ts-ignore
      return pick(profileOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ): {
      [K in keyof typeof profileOutputColumns as K extends Keys
        ? never
        : K]: (typeof profileOutputColumns)[K];
    } => {
      // @ts-ignore
      return omit(profileOutputColumns, ...keys);
    },
  },

  post: {
    /** 所有字段对象 */
    columns: postOutputColumns,
    /** 选择部分字段 */
    pick: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof postOutputColumns)[K] } => {
      // @ts-ignore
      return pick(postOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ): {
      [K in keyof typeof postOutputColumns as K extends Keys
        ? never
        : K]: (typeof postOutputColumns)[K];
    } => {
      // @ts-ignore
      return omit(postOutputColumns, ...keys);
    },
  },

  aliasTableName: {
    /** 所有字段对象 */
    columns: aliasTableNameOutputColumns,
    /** 选择部分字段 */
    pick: <Keys extends 'id'>(
      ...keys: Keys[]
    ): { [K in Keys]: (typeof aliasTableNameOutputColumns)[K] } => {
      // @ts-ignore
      return pick(aliasTableNameOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ): {
      [K in keyof typeof aliasTableNameOutputColumns as K extends Keys
        ? never
        : K]: (typeof aliasTableNameOutputColumns)[K];
    } => {
      // @ts-ignore
      return omit(aliasTableNameOutputColumns, ...keys);
    },
  },
};

export type PrismaSchemaMap = {
  user: [
    'id',
    'name',
    'name_nu',
    'name_de',
    'str_arr',
    'str_arr_de',
    'age',
    'age_nu',
    'age_de',
    'int_arr',
    'int_arr_de',
    'obj',
    'obj_de_obj',
    'obj_de_arr',
    'flo',
    'flo_nu',
    'flo_de',
    'flo_arr',
    'flo_arr_de',
    'uu',
    'comme_ok',
    'comme_fail',
    'posts',
    'profile',
    'lang',
    'lang_nu',
    'lang_de',
    'time',
    'time_nu',
    'time_de',
    'boo',
    'boo_nu',
    'boo_de',
    'big',
    'big_nu',
    'big_de',
    'byt',
    'byt_nu',
    'byt_de',
    'custom',
    'custom_nu',
    'custom_arr',
  ];
  profile: ['id', 'user_id', 'user'];
  post: ['id', 'user_id', 'name', 'user'];
  aliasTableName: ['id'];
  IAmNotUsedType: ['id'];
  IAmAloseNotUsedType: ['id'];
  MyTypeType: ['id', 'name', 'other'];
  YourTypeType: ['abc', 'cde'];
};

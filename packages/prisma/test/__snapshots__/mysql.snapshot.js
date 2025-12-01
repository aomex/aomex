// @ts-nocheck
import { rule } from '@aomex/common';
import { overrideColumnsFactory } from '@aomex/prisma';
// 如果想覆盖默认生成的类型，可以同目录下创建一个 index.override.ts 文件，然后重新执行 prisma generate 命令
// import customColumns from './index.override';
const customColumns = overrideColumnsFactory()({});
function pick(obj, ...keys) {
  const subObj = {};
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      subObj[key] = obj[key];
    }
  }
  return subObj;
}
function omit(obj, ...keys) {
  const allKeys = Object.keys(obj);
  return pick(obj, ...allKeys.filter((key) => !keys.includes(key)));
}

export const LanguageEnum = ['Typescript', 'Javascript', 'Rust', 'Go', 'Python', 'Cpp'];
const userInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.user?.id?.input || rule.int().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: customColumns.user?.name?.input || rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  name_nu: customColumns.user?.name_nu?.input || rule.string().optional().nullable(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   */
  name_de: customColumns.user?.name_de?.input || rule.string().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`""`
   */
  name_de_empty:
    customColumns.user?.name_de_empty?.input ||
    rule.string().allowEmptyString().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  age: customColumns.user?.age?.input || rule.int(),
  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   */
  age_nu: customColumns.user?.age_nu?.input || rule.int().optional().nullable(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   */
  age_de: customColumns.user?.age_de?.input || rule.int().optional(),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   */
  obj: customColumns.user?.obj?.input || rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"{}"`
   */
  obj_de_obj:
    customColumns.user?.obj_de_obj?.input ||
    rule.anyOf([rule.object(), rule.array()]).optional(),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"[]"`
   */
  obj_de_arr:
    customColumns.user?.obj_de_arr?.input ||
    rule.anyOf([rule.object(), rule.array()]).optional(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   */
  deci: customColumns.user?.deci?.input || rule.number(),
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   */
  deci_nu: customColumns.user?.deci_nu?.input || rule.number().optional().nullable(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   */
  deci_de: customColumns.user?.deci_de?.input || rule.number().optional(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：
   */
  flo: customColumns.user?.flo?.input || rule.number(),
  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   */
  flo_nu: customColumns.user?.flo_nu?.input || rule.number().optional().nullable(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   */
  flo_de: customColumns.user?.flo_de?.input || rule.number().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   */
  uu: customColumns.user?.uu?.input || rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1: customColumns.user?.uu_1?.input || rule.uuid(['v1']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1_nu: customColumns.user?.uu_1_nu?.input || rule.uuid(['v1']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2: customColumns.user?.uu_2?.input || rule.uuid(['v2']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2_nu: customColumns.user?.uu_2_nu?.input || rule.uuid(['v2']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3: customColumns.user?.uu_3?.input || rule.uuid(['v3']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3_nu: customColumns.user?.uu_3_nu?.input || rule.uuid(['v3']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4: customColumns.user?.uu_4?.input || rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4_nu: customColumns.user?.uu_4_nu?.input || rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5: customColumns.user?.uu_5?.input || rule.uuid(['v5']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5_nu: customColumns.user?.uu_5_nu?.input || rule.uuid(['v5']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6: customColumns.user?.uu_6?.input || rule.string().optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6_nu: customColumns.user?.uu_6_nu?.input || rule.string().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
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
   */
  comme_fail: customColumns.user?.comme_fail?.input || rule.string(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  lang: customColumns.user?.lang?.input || rule.enum(LanguageEnum),
  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   */
  lang_nu:
    customColumns.user?.lang_nu?.input || rule.enum(LanguageEnum).optional().nullable(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   */
  lang_de: customColumns.user?.lang_de?.input || rule.enum(LanguageEnum).optional(),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   */
  time: customColumns.user?.time?.input || rule.date(),
  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   */
  time_nu: customColumns.user?.time_nu?.input || rule.date().optional().nullable(),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   */
  time_de: customColumns.user?.time_de?.input || rule.date().optional(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   */
  boo: customColumns.user?.boo?.input || rule.boolean(),
  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   */
  boo_nu: customColumns.user?.boo_nu?.input || rule.boolean().optional().nullable(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   */
  boo_de: customColumns.user?.boo_de?.input || rule.boolean().optional(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   */
  big: customColumns.user?.big?.input || rule.bigint(),
  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   */
  big_nu: customColumns.user?.big_nu?.input || rule.bigint().optional().nullable(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   */
  big_de: customColumns.user?.big_de?.input || rule.bigint().optional(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   */
  byt: customColumns.user?.byt?.input || rule.buffer(),
  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   */
  byt_nu: customColumns.user?.byt_nu?.input || rule.buffer().optional().nullable(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   */
  byt_de: customColumns.user?.byt_de?.input || rule.buffer().optional(),
};
const userOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.user?.id?.output || rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: customColumns.user?.name?.output || rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  name_nu: customColumns.user?.name_nu?.output || rule.string().nullable(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   */
  name_de: customColumns.user?.name_de?.output || rule.string(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`""`
   */
  name_de_empty: customColumns.user?.name_de_empty?.output || rule.string(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  age: customColumns.user?.age?.output || rule.int(),
  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   */
  age_nu: customColumns.user?.age_nu?.output || rule.int().nullable(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   */
  age_de: customColumns.user?.age_de?.output || rule.int(),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   */
  obj: customColumns.user?.obj?.output || rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"{}"`
   */
  obj_de_obj:
    customColumns.user?.obj_de_obj?.output || rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"[]"`
   */
  obj_de_arr:
    customColumns.user?.obj_de_arr?.output || rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   */
  deci: customColumns.user?.deci?.output || rule.number(),
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   */
  deci_nu: customColumns.user?.deci_nu?.output || rule.number().nullable(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   */
  deci_de: customColumns.user?.deci_de?.output || rule.number(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：
   */
  flo: customColumns.user?.flo?.output || rule.number(),
  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   */
  flo_nu: customColumns.user?.flo_nu?.output || rule.number().nullable(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   */
  flo_de: customColumns.user?.flo_de?.output || rule.number(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   */
  uu: customColumns.user?.uu?.output || rule.uuid(['v4']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1: customColumns.user?.uu_1?.output || rule.uuid(['v1']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1_nu: customColumns.user?.uu_1_nu?.output || rule.uuid(['v1']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2: customColumns.user?.uu_2?.output || rule.uuid(['v2']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2_nu: customColumns.user?.uu_2_nu?.output || rule.uuid(['v2']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3: customColumns.user?.uu_3?.output || rule.uuid(['v3']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3_nu: customColumns.user?.uu_3_nu?.output || rule.uuid(['v3']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4: customColumns.user?.uu_4?.output || rule.uuid(['v4']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4_nu: customColumns.user?.uu_4_nu?.output || rule.uuid(['v4']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5: customColumns.user?.uu_5?.output || rule.uuid(['v5']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5_nu: customColumns.user?.uu_5_nu?.output || rule.uuid(['v5']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6: customColumns.user?.uu_6?.output || rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6_nu: customColumns.user?.uu_6_nu?.output || rule.string(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * I am the comments
   */
  comme_ok:
    customColumns.user?.comme_ok?.output ||
    rule.string().docs({ description: 'I am the comments' }),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  comme_fail: customColumns.user?.comme_fail?.output || rule.string(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  lang: customColumns.user?.lang?.output || rule.enum(LanguageEnum),
  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   */
  lang_nu: customColumns.user?.lang_nu?.output || rule.enum(LanguageEnum).nullable(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   */
  lang_de: customColumns.user?.lang_de?.output || rule.enum(LanguageEnum),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   */
  time: customColumns.user?.time?.output || rule.date(),
  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   */
  time_nu: customColumns.user?.time_nu?.output || rule.date().nullable(),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   */
  time_de: customColumns.user?.time_de?.output || rule.date(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   */
  boo: customColumns.user?.boo?.output || rule.boolean(),
  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   */
  boo_nu: customColumns.user?.boo_nu?.output || rule.boolean().nullable(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   */
  boo_de: customColumns.user?.boo_de?.output || rule.boolean(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   */
  big: customColumns.user?.big?.output || rule.bigint(),
  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   */
  big_nu: customColumns.user?.big_nu?.output || rule.bigint().nullable(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   */
  big_de: customColumns.user?.big_de?.output || rule.bigint(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   */
  byt: customColumns.user?.byt?.output || rule.buffer(),
  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   */
  byt_nu: customColumns.user?.byt_nu?.output || rule.buffer().nullable(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   */
  byt_de: customColumns.user?.byt_de?.output || rule.buffer(),
};
const profileInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.profile?.id?.input || rule.int().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: customColumns.profile?.user_id?.input || rule.int(),
};
const profileOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.profile?.id?.output || rule.int(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: customColumns.profile?.user_id?.output || rule.int(),
};
const postInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.post?.id?.input || rule.int().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: customColumns.post?.user_id?.input || rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: customColumns.post?.name?.input || rule.string(),
};
const postOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.post?.id?.output || rule.int(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: customColumns.post?.user_id?.output || rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: customColumns.post?.name?.output || rule.string(),
};
const aliasTableNameInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.aliasTableName?.id?.input || rule.int().optional(),
};
const aliasTableNameOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: customColumns.aliasTableName?.id?.output || rule.int(),
};

export const prismaInput = {
  user: {
    /** 所有字段对象 */
    columns: userInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(userInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(userInputColumns, ...keys);
    },
  },
  profile: {
    /** 所有字段对象 */
    columns: profileInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(profileInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(profileInputColumns, ...keys);
    },
  },
  post: {
    /** 所有字段对象 */
    columns: postInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(postInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(postInputColumns, ...keys);
    },
  },
  aliasTableName: {
    /** 所有字段对象 */
    columns: aliasTableNameInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(aliasTableNameInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(aliasTableNameInputColumns, ...keys);
    },
  },
};

export const prismaOutput = {
  user: {
    /** 所有字段对象 */
    columns: userOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(userOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(userOutputColumns, ...keys);
    },
  },
  profile: {
    /** 所有字段对象 */
    columns: profileOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(profileOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(profileOutputColumns, ...keys);
    },
  },
  post: {
    /** 所有字段对象 */
    columns: postOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(postOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(postOutputColumns, ...keys);
    },
  },
  aliasTableName: {
    /** 所有字段对象 */
    columns: aliasTableNameOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(aliasTableNameOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(aliasTableNameOutputColumns, ...keys);
    },
  },
};

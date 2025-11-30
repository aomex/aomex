// @ts-nocheck
import { rule } from '@aomex/common';
import { overrideColumns } from '@aomex/prisma';
// 如果想覆盖默认生成的类型，可以同目录下创建一个 sqlite.snapshot.override.ts 文件，然后重新执行 prisma generate 命令
// import customColumns from './sqlite.snapshot.override';
const customColumns = overrideColumns()({});
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
const userInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.user?.id?.input || rule.int().optional(),
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
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number()`
   */
  deci: customColumns.user?.deci?.input || rule.number(),
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().optional()`
   */
  deci_nu: customColumns.user?.deci_nu?.input || rule.number().optional(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.number().optional()`
   */
  deci_de: customColumns.user?.deci_de?.input || rule.number().optional(),
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
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"]).optional()`
   */
  uu_1: customColumns.user?.uu_1?.input || rule.uuid(['v1']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"]).optional()`
   */
  uu_1_nu: customColumns.user?.uu_1_nu?.input || rule.uuid(['v1']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"]).optional()`
   */
  uu_2: customColumns.user?.uu_2?.input || rule.uuid(['v2']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"]).optional()`
   */
  uu_2_nu: customColumns.user?.uu_2_nu?.input || rule.uuid(['v2']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"]).optional()`
   */
  uu_3: customColumns.user?.uu_3?.input || rule.uuid(['v3']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"]).optional()`
   */
  uu_3_nu: customColumns.user?.uu_3_nu?.input || rule.uuid(['v3']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"]).optional()`
   */
  uu_4: customColumns.user?.uu_4?.input || rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"]).optional()`
   */
  uu_4_nu: customColumns.user?.uu_4_nu?.input || rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"]).optional()`
   */
  uu_5: customColumns.user?.uu_5?.input || rule.uuid(['v5']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"]).optional()`
   */
  uu_5_nu: customColumns.user?.uu_5_nu?.input || rule.uuid(['v5']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string().optional()`
   */
  uu_6: customColumns.user?.uu_6?.input || rule.string().optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string().optional()`
   */
  uu_6_nu: customColumns.user?.uu_6_nu?.input || rule.string().optional(),
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
};
const userOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.user?.id?.input || rule.int(),
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
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number()`
   */
  deci: customColumns.user?.deci?.input || rule.number(),
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().nullable()`
   */
  deci_nu: customColumns.user?.deci_nu?.input || rule.number().nullable(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.number()`
   */
  deci_de: customColumns.user?.deci_de?.input || rule.number(),
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
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"])`
   */
  uu_1: customColumns.user?.uu_1?.input || rule.uuid(['v1']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"])`
   */
  uu_1_nu: customColumns.user?.uu_1_nu?.input || rule.uuid(['v1']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"])`
   */
  uu_2: customColumns.user?.uu_2?.input || rule.uuid(['v2']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"])`
   */
  uu_2_nu: customColumns.user?.uu_2_nu?.input || rule.uuid(['v2']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"])`
   */
  uu_3: customColumns.user?.uu_3?.input || rule.uuid(['v3']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"])`
   */
  uu_3_nu: customColumns.user?.uu_3_nu?.input || rule.uuid(['v3']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"])`
   */
  uu_4: customColumns.user?.uu_4?.input || rule.uuid(['v4']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"])`
   */
  uu_4_nu: customColumns.user?.uu_4_nu?.input || rule.uuid(['v4']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"])`
   */
  uu_5: customColumns.user?.uu_5?.input || rule.uuid(['v5']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"])`
   */
  uu_5_nu: customColumns.user?.uu_5_nu?.input || rule.uuid(['v5']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string()`
   */
  uu_6: customColumns.user?.uu_6?.input || rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string()`
   */
  uu_6_nu: customColumns.user?.uu_6_nu?.input || rule.string(),
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
};
const profileInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.profile?.id?.input || rule.int().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: customColumns.profile?.user_id?.input || rule.int(),
};
const profileOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.profile?.id?.input || rule.int(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: customColumns.profile?.user_id?.input || rule.int(),
};
const postInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.post?.id?.input || rule.int().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: customColumns.post?.user_id?.input || rule.int(),
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
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.post?.id?.input || rule.int(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: customColumns.post?.user_id?.input || rule.int(),
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
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.aliasTableName?.id?.input || rule.int().optional(),
};
const aliasTableNameOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.aliasTableName?.id?.input || rule.int(),
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

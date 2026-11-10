// @ts-nocheck
/**
 * 由 aomex-prisma 自动生成，请勿修改。
 *
 * 请在业务侧创建 src/schemas/prisma.schema.ts，通过 definePrismaSchema() 解包后再使用：
 *
 * ```ts
 * // src/schemas/prisma.schema.ts
 * import { definePrismaSchema } from '@aomex/prisma';
 * import { generated } from '../generated/aomex/prisma';
 *
 * export const { prismaInput, prismaOutput, prismaEnum } = definePrismaSchema(
 *   generated,
 *   {
 *     user: {
 *       input: (s) => s.extend({ password: rule.string() }),
 *       output: (s) => s.omit('password'),
 *     },
 *   },
 * );
 * ```
 *
 * 本文件仅导出 generated；不要直接当路由 schema / enum 使用。
 */
import { rule, schema } from '@aomex/common';
const LanguageEnum = ['Typescript', 'Javascript', 'Rust', 'Go', 'Python', 'Cpp'];
const prismaEnum = {
  Language: LanguageEnum,
};
const userInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  name_nu: rule.string().optional().nullable(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   */
  name_de: rule.string().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`""`
   */
  name_de_empty: rule.string().allowEmptyString().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  age: rule.int(),
  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   */
  age_nu: rule.int().optional().nullable(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   */
  age_de: rule.int().optional(),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   */
  obj: rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"{}"`
   */
  obj_de_obj: rule.anyOf([rule.object(), rule.array()]).optional(),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"[]"`
   */
  obj_de_arr: rule.anyOf([rule.object(), rule.array()]).optional(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   */
  deci: rule.number(),
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   */
  deci_nu: rule.number().optional().nullable(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   */
  deci_de: rule.number().optional(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：
   */
  flo: rule.number(),
  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   */
  flo_nu: rule.number().optional().nullable(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   */
  flo_de: rule.number().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   */
  uu: rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1: rule.uuid(['v1']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1_nu: rule.uuid(['v1']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2: rule.uuid(['v2']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2_nu: rule.uuid(['v2']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3: rule.uuid(['v3']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3_nu: rule.uuid(['v3']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4: rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4_nu: rule.uuid(['v4']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5: rule.uuid(['v5']).optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5_nu: rule.uuid(['v5']).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6: rule.string().optional(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6_nu: rule.string().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * I am the comments
   * line two of comments
   */
  comme_ok: rule
    .string()
    .docs({ description: 'I am the comments\nline two of comments' }),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  comme_fail: rule.string(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  lang: rule.enum(LanguageEnum),
  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   */
  lang_nu: rule.enum(LanguageEnum).optional().nullable(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   */
  lang_de: rule.enum(LanguageEnum).optional(),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   */
  time: rule.date(),
  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   */
  time_nu: rule.date().optional().nullable(),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   */
  time_de: rule.date().optional(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   */
  boo: rule.boolean(),
  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   */
  boo_nu: rule.boolean().optional().nullable(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   */
  boo_de: rule.boolean().optional(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   */
  big: rule.bigint(),
  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   */
  big_nu: rule.bigint().optional().nullable(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   */
  big_de: rule.bigint().optional(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   */
  byt: rule.buffer(),
  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   */
  byt_nu: rule.buffer().optional().nullable(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   */
  byt_de: rule.buffer().optional(),
};
const userInputSchema = schema(userInputColumns).asName('userInput');
const userOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  name_nu: rule.string().nullable(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   */
  name_de: rule.string(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`""`
   */
  name_de_empty: rule.string(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  age: rule.int(),
  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   */
  age_nu: rule.int().nullable(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   */
  age_de: rule.int(),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   */
  obj: rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"{}"`
   */
  obj_de_obj: rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：`"[]"`
   */
  obj_de_arr: rule.anyOf([rule.object(), rule.array()]),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   */
  deci: rule.number(),
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   */
  deci_nu: rule.number().nullable(),
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   */
  deci_de: rule.number(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：
   */
  flo: rule.number(),
  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   */
  flo_nu: rule.number().nullable(),
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   */
  flo_de: rule.number(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   */
  uu: rule.uuid(['v4']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1: rule.uuid(['v1']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   */
  uu_1_nu: rule.uuid(['v1']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2: rule.uuid(['v2']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   */
  uu_2_nu: rule.uuid(['v2']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3: rule.uuid(['v3']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   */
  uu_3_nu: rule.uuid(['v3']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4: rule.uuid(['v4']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   */
  uu_4_nu: rule.uuid(['v4']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5: rule.uuid(['v5']),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   */
  uu_5_nu: rule.uuid(['v5']),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6: rule.string(),
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   */
  uu_6_nu: rule.string(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * I am the comments
   * line two of comments
   */
  comme_ok: rule
    .string()
    .docs({ description: 'I am the comments\nline two of comments' }),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  comme_fail: rule.string(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  lang: rule.enum(LanguageEnum),
  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   */
  lang_nu: rule.enum(LanguageEnum).nullable(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   */
  lang_de: rule.enum(LanguageEnum),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   */
  time: rule.date(),
  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   */
  time_nu: rule.date().nullable(),
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   */
  time_de: rule.date(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   */
  boo: rule.boolean(),
  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   */
  boo_nu: rule.boolean().nullable(),
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   */
  boo_de: rule.boolean(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   */
  big: rule.bigint(),
  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   */
  big_nu: rule.bigint().nullable(),
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   */
  big_de: rule.bigint(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   */
  byt: rule.buffer(),
  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   */
  byt_nu: rule.buffer().nullable(),
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   */
  byt_de: rule.buffer(),
};
const userOutputSchema = schema(userOutputColumns).asName('userOutput');
const profileInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: rule.int(),
};
const profileInputSchema = schema(profileInputColumns).asName('profileInput');
const profileOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: rule.int(),
};
const profileOutputSchema = schema(profileOutputColumns).asName('profileOutput');
const postInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: rule.string(),
};
const postInputSchema = schema(postInputColumns).asName('postInput');
const postOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  user_id: rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: rule.string(),
};
const postOutputSchema = schema(postOutputColumns).asName('postOutput');
const AliasTableNameInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const AliasTableNameInputSchema = schema(AliasTableNameInputColumns).asName(
  'AliasTableNameInput',
);
const AliasTableNameOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const AliasTableNameOutputSchema = schema(AliasTableNameOutputColumns).asName(
  'AliasTableNameOutput',
);
const prismaInput = {
  user: userInputSchema,
  profile: profileInputSchema,
  post: postInputSchema,
  AliasTableName: AliasTableNameInputSchema,
};
const prismaOutput = {
  user: userOutputSchema,
  profile: profileOutputSchema,
  post: postOutputSchema,
  AliasTableName: AliasTableNameOutputSchema,
};

export const generated = {
  prismaInput,
  prismaOutput,
  prismaEnum,
};

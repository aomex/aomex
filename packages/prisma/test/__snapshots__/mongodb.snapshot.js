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
const _YourTypeOutputType = {
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  abc: rule.string().nullable(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  cde: rule.enum(LanguageEnum),
};
const YourTypeOutputType = schema(_YourTypeOutputType).asName('YourTypeOutput');
const _YourTypeInputType = {
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  abc: rule.string().optional().nullable(),
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  cde: rule.enum(LanguageEnum),
};
const YourTypeInputType = schema(_YourTypeInputType).asName('YourTypeInput');
const _MyTypeOutputType = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  id: rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: rule.string(),
  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
   */
  other: YourTypeOutputType.object(),
};
const MyTypeOutputType = schema(_MyTypeOutputType).asName('MyTypeOutput');
const _MyTypeInputType = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  id: rule.int(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: rule.string(),
  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
   */
  other: YourTypeInputType.object(),
};
const MyTypeInputType = schema(_MyTypeInputType).asName('MyTypeInput');
const _IAmAloseNotUsedOutputType = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: rule.string(),
};
const IAmAloseNotUsedOutputType = schema(_IAmAloseNotUsedOutputType).asName(
  'IAmAloseNotUsedOutput',
);
const _IAmAloseNotUsedInputType = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: rule.string(),
};
const IAmAloseNotUsedInputType = schema(_IAmAloseNotUsedInputType).asName(
  'IAmAloseNotUsedInput',
);
const _IAmNotUsedOutputType = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: rule.string(),
};
const IAmNotUsedOutputType = schema(_IAmNotUsedOutputType).asName('IAmNotUsedOutput');
const _IAmNotUsedInputType = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: rule.string(),
};
const IAmNotUsedInputType = schema(_IAmNotUsedInputType).asName('IAmNotUsedInput');
const userInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string().optional(),
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
   * Prisma类型：`String[]`
   *
   * 数据库默认值：
   */
  str_arr: rule.array(rule.string()),
  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：`[]`
   */
  str_arr_de: rule.array(rule.string()).optional(),
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
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：
   */
  int_arr: rule.array(rule.int()),
  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：`[]`
   */
  int_arr_de: rule.array(rule.int()).optional(),
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
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：
   */
  flo_arr: rule.array(rule.number()),
  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：`[100.10000000000001]`
   */
  flo_arr_de: rule.array(rule.number()).optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   */
  uu: rule.uuid(['v4']).optional(),
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
  /**
   * Prisma类型：`MyType`
   *
   * 数据库默认值：
   */
  custom: MyTypeInputType.object(),
  /**
   * Prisma类型：`MyType?`
   *
   * 数据库默认值：
   */
  custom_nu: MyTypeInputType.object().optional().nullable(),
  /**
   * Prisma类型：`MyType[]`
   *
   * 数据库默认值：
   */
  custom_arr: rule.array(MyTypeInputType.object()),
};
const userInputSchema = schema(userInputColumns).asName('userInput');
const userOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string(),
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
   * Prisma类型：`String[]`
   *
   * 数据库默认值：
   */
  str_arr: rule.array(rule.string()),
  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：`[]`
   */
  str_arr_de: rule.array(rule.string()),
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
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：
   */
  int_arr: rule.array(rule.int()),
  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：`[]`
   */
  int_arr_de: rule.array(rule.int()),
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
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：
   */
  flo_arr: rule.array(rule.number()),
  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：`[100.10000000000001]`
   */
  flo_arr_de: rule.array(rule.number()),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   */
  uu: rule.uuid(['v4']),
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
  /**
   * Prisma类型：`MyType`
   *
   * 数据库默认值：
   */
  custom: MyTypeOutputType.object(),
  /**
   * Prisma类型：`MyType?`
   *
   * 数据库默认值：
   */
  custom_nu: MyTypeOutputType.object().nullable(),
  /**
   * Prisma类型：`MyType[]`
   *
   * 数据库默认值：
   */
  custom_arr: rule.array(MyTypeOutputType.object()),
};
const userOutputSchema = schema(userOutputColumns).asName('userOutput');
const profileInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  user_id: rule.string(),
};
const profileInputSchema = schema(profileInputColumns).asName('profileInput');
const profileOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  user_id: rule.string(),
};
const profileOutputSchema = schema(profileOutputColumns).asName('profileOutput');
const postInputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string().optional(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  user_id: rule.string(),
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
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string(),
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  user_id: rule.string(),
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
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string().optional(),
};
const AliasTableNameInputSchema = schema(AliasTableNameInputColumns).asName(
  'AliasTableNameInput',
);
const AliasTableNameOutputColumns = {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: rule.string(),
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

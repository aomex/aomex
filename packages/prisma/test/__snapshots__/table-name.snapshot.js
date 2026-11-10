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
const prismaEnum = {};
const lowercaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const lowercaseInputSchema = schema(lowercaseInputColumns).asName('lowercaseInput');
const lowercaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const lowercaseOutputSchema = schema(lowercaseOutputColumns).asName('lowercaseOutput');
const UPPERCASEInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const UPPERCASEInputSchema = schema(UPPERCASEInputColumns).asName('UPPERCASEInput');
const UPPERCASEOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const UPPERCASEOutputSchema = schema(UPPERCASEOutputColumns).asName('UPPERCASEOutput');
const camelCaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const camelCaseInputSchema = schema(camelCaseInputColumns).asName('camelCaseInput');
const camelCaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const camelCaseOutputSchema = schema(camelCaseOutputColumns).asName('camelCaseOutput');
const PascalCaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const PascalCaseInputSchema = schema(PascalCaseInputColumns).asName('PascalCaseInput');
const PascalCaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const PascalCaseOutputSchema = schema(PascalCaseOutputColumns).asName('PascalCaseOutput');
const TitlecaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const TitlecaseInputSchema = schema(TitlecaseInputColumns).asName('TitlecaseInput');
const TitlecaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const TitlecaseOutputSchema = schema(TitlecaseOutputColumns).asName('TitlecaseOutput');
const snake_caseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const snake_caseInputSchema = schema(snake_caseInputColumns).asName('snake_caseInput');
const snake_caseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const snake_caseOutputSchema = schema(snake_caseOutputColumns).asName('snake_caseOutput');
const Complete_CaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int().optional(),
};
const Complete_CaseInputSchema = schema(Complete_CaseInputColumns).asName(
  'Complete_CaseInput',
);
const Complete_CaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   */
  id: rule.int(),
};
const Complete_CaseOutputSchema = schema(Complete_CaseOutputColumns).asName(
  'Complete_CaseOutput',
);
const prismaInput = {
  lowercase: lowercaseInputSchema,
  UPPERCASE: UPPERCASEInputSchema,
  camelCase: camelCaseInputSchema,
  PascalCase: PascalCaseInputSchema,
  Titlecase: TitlecaseInputSchema,
  snake_case: snake_caseInputSchema,
  Complete_Case: Complete_CaseInputSchema,
};
const prismaOutput = {
  lowercase: lowercaseOutputSchema,
  UPPERCASE: UPPERCASEOutputSchema,
  camelCase: camelCaseOutputSchema,
  PascalCase: PascalCaseOutputSchema,
  Titlecase: TitlecaseOutputSchema,
  snake_case: snake_caseOutputSchema,
  Complete_Case: Complete_CaseOutputSchema,
};

export const generated = {
  prismaInput,
  prismaOutput,
  prismaEnum,
};

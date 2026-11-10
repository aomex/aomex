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
import { type ValidatorSchema } from '@aomex/common';
import type { PrismaGeneratedSchemas } from '@aomex/prisma';
declare const prismaEnum: {};
declare const prismaInput: {
  lowercase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
  UPPERCASE: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
  camelCase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
  PascalCase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
  Titlecase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
  snake_case: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
  Complete_Case: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number | Validator.TOptional>;
  }>;
};
declare const prismaOutput: {
  lowercase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
  UPPERCASE: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
  camelCase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
  PascalCase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
  Titlecase: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
  snake_case: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
  Complete_Case: ValidatorSchema<{
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`autoincrement()`
     */
    id: IntValidator<number>;
  }>;
};

export declare const generated: PrismaGeneratedSchemas<
  typeof prismaInput,
  typeof prismaOutput,
  typeof prismaEnum
>;
import type { IntValidator, Validator } from '@aomex/common';
export {};

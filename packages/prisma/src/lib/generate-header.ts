export const generateHeader = () => {
  return `
  // @ts-nocheck
  /**
   * 由 aomex-prisma 自动生成，请勿修改。
   *
   * 请在业务侧创建 src/schemas/prisma.schema.ts，通过 definePrismaSchema() 解包后再使用：
   *
   * \`\`\`ts
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
   * \`\`\`
   *
   * 本文件仅导出 generated；不要直接当路由 schema / enum 使用。
   */
  import { rule, schema, type ValidatorSchema } from "@aomex/common";
  import type { PrismaGeneratedSchemas } from "@aomex/prisma";
  `;
};

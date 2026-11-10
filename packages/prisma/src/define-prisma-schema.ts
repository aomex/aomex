import type { ValidatorSchema } from '@aomex/common';

type SchemaMap = Record<string, ValidatorSchema<any>>;
type EnumMap = Record<string, readonly string[]>;

declare const prismaGeneratedBrand: unique symbol;

type ModelOverride<I extends SchemaMap, O extends SchemaMap, K extends PropertyKey> = {
  input?: K extends keyof I ? (schema: I[K]) => ValidatorSchema<any> : never;
  output?: K extends keyof O ? (schema: O[K]) => ValidatorSchema<any> : never;
};

type ExactOverrides<Ov, I extends SchemaMap, O extends SchemaMap> = {
  [K in keyof Ov]: K extends keyof I | keyof O
    ? ModelOverride<I, O, K> & Record<Exclude<keyof Ov[K], 'input' | 'output'>, never>
    : `Unknown prisma model '${K & string}'`;
};

type AppliedInput<I extends SchemaMap, Ov> = {
  [K in keyof I]: K extends keyof Ov
    ? Ov[K] extends { input: (schema: I[K]) => infer R }
      ? R extends ValidatorSchema<any>
        ? R
        : I[K]
      : I[K]
    : I[K];
};

type AppliedOutput<O extends SchemaMap, Ov> = {
  [K in keyof O]: K extends keyof Ov
    ? Ov[K] extends { output: (schema: O[K]) => infer R }
      ? R extends ValidatorSchema<any>
        ? R
        : O[K]
      : O[K]
    : O[K];
};

/**
 * 生成物对外类型：运行时含 prismaInput / prismaOutput / prismaEnum，
 * 但类型上不可直接读取，必须经 {@link definePrismaSchema} 解包后使用。
 */
export type PrismaGeneratedSchemas<
  I extends SchemaMap = SchemaMap,
  O extends SchemaMap = SchemaMap,
  E extends EnumMap = EnumMap,
> = {
  readonly [prismaGeneratedBrand]: {
    prismaInput: I;
    prismaOutput: O;
    prismaEnum: E;
  };
};

type PrismaGeneratedRuntime<
  I extends SchemaMap,
  O extends SchemaMap,
  E extends EnumMap,
> = {
  prismaInput: I;
  prismaOutput: O;
  prismaEnum: E;
};

/**
 * 仅供生成代码与包内测试打标；不从包入口导出。
 */
export function asPrismaGenerated<
  I extends SchemaMap,
  O extends SchemaMap,
  E extends EnumMap,
>(value: PrismaGeneratedRuntime<I, O, E>): PrismaGeneratedSchemas<I, O, E> {
  return value as unknown as PrismaGeneratedSchemas<I, O, E>;
}

/**
 * 将生成结果收敛为业务侧唯一入口，并按需覆盖模型 schema。
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
 * 路由请使用这里的 `prismaInput` / `prismaOutput` / `prismaEnum`，不要直接引用生成文件。
 * 覆盖未知模型名会产生类型错误。
 */
export function definePrismaSchema<
  I extends SchemaMap,
  O extends SchemaMap,
  E extends EnumMap,
  Ov extends object = {},
>(
  generated: PrismaGeneratedSchemas<I, O, E>,
  overrides: Ov & ExactOverrides<Ov, I, O>,
): {
  prismaInput: AppliedInput<I, Ov>;
  prismaOutput: AppliedOutput<O, Ov>;
  prismaEnum: E;
} {
  const raw = generated as unknown as PrismaGeneratedRuntime<I, O, E>;
  const prismaInput: SchemaMap = { ...raw.prismaInput };
  const prismaOutput: SchemaMap = { ...raw.prismaOutput };
  const ov = overrides as Record<string, ModelOverride<SchemaMap, SchemaMap, string>>;

  for (const [key, modelOverride] of Object.entries(ov)) {
    if (modelOverride.input && Object.hasOwn(prismaInput, key)) {
      const original = prismaInput[key]!;
      const next = modelOverride.input(original);
      // pick/omit/extend 等派生不继承 name，覆盖后补回供 OpenAPI 使用
      const originalName = original['name'];
      prismaInput[key] =
        originalName != null && next['name'] == null ? next.asName(originalName) : next;
    }
    if (modelOverride.output && Object.hasOwn(prismaOutput, key)) {
      const original = prismaOutput[key]!;
      const next = modelOverride.output(original);
      const originalName = original['name'];
      prismaOutput[key] =
        originalName != null && next['name'] == null ? next.asName(originalName) : next;
    }
  }

  return {
    prismaInput: prismaInput as AppliedInput<I, Ov>,
    prismaOutput: prismaOutput as AppliedOutput<O, Ov>,
    prismaEnum: raw.prismaEnum,
  };
}

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
declare const prismaEnum: {
  Language: readonly ['Typescript', 'Javascript', 'Rust', 'Go', 'Python', 'Cpp'];
};
declare const prismaInput: {
  user: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string | Validator.TOptional>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    name: StringValidator<string>;
    /**
     * Prisma类型：`String?`
     *
     * 数据库默认值：
     */
    name_nu: StringValidator<string | Validator.TOptional | null>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`"abc"`
     */
    name_de: StringValidator<string | Validator.TOptional>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`""`
     */
    name_de_empty: StringValidator<string | Validator.TOptional>;
    /**
     * Prisma类型：`String[]`
     *
     * 数据库默认值：
     */
    str_arr: ArrayValidator<string[]>;
    /**
     * Prisma类型：`String[]`
     *
     * 数据库默认值：`[]`
     */
    str_arr_de: ArrayValidator<string[] | Validator.TOptional>;
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：
     */
    age: IntValidator<number>;
    /**
     * Prisma类型：`Int?`
     *
     * 数据库默认值：
     */
    age_nu: IntValidator<number | Validator.TOptional | null>;
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`100`
     */
    age_de: IntValidator<number | Validator.TOptional>;
    /**
     * Prisma类型：`Int[]`
     *
     * 数据库默认值：
     */
    int_arr: ArrayValidator<number[]>;
    /**
     * Prisma类型：`Int[]`
     *
     * 数据库默认值：`[]`
     */
    int_arr_de: ArrayValidator<number[] | Validator.TOptional>;
    /**
     * Prisma类型：`Json`
     *
     * 数据库默认值：
     */
    obj: AnyOfValidator<
      | unknown[]
      | {
          [K: string]: unknown;
        }
    >;
    /**
     * Prisma类型：`Json`
     *
     * 数据库默认值：`"{}"`
     */
    obj_de_obj: AnyOfValidator<
      | unknown[]
      | Validator.TOptional
      | {
          [K: string]: unknown;
        }
    >;
    /**
     * Prisma类型：`Json`
     *
     * 数据库默认值：`"[]"`
     */
    obj_de_arr: AnyOfValidator<
      | unknown[]
      | Validator.TOptional
      | {
          [K: string]: unknown;
        }
    >;
    /**
     * Prisma类型：`Float`
     *
     * 数据库默认值：
     */
    flo: NumberValidator<number>;
    /**
     * Prisma类型：`Float?`
     *
     * 数据库默认值：
     */
    flo_nu: NumberValidator<number | Validator.TOptional | null>;
    /**
     * Prisma类型：`Float`
     *
     * 数据库默认值：`100.10000000000001`
     */
    flo_de: NumberValidator<number | Validator.TOptional>;
    /**
     * Prisma类型：`Float[]`
     *
     * 数据库默认值：
     */
    flo_arr: ArrayValidator<number[]>;
    /**
     * Prisma类型：`Float[]`
     *
     * 数据库默认值：`[100.10000000000001]`
     */
    flo_arr_de: ArrayValidator<number[] | Validator.TOptional>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`uuid(4)`
     */
    uu: UuidValidator<string | Validator.TOptional>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     *
     * I am the comments
     * line two of comments
     */
    comme_ok: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    comme_fail: StringValidator<string>;
    /**
     * Prisma类型：`Language`
     *
     * 数据库默认值：
     */
    lang: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
    /**
     * Prisma类型：`Language?`
     *
     * 数据库默认值：
     */
    lang_nu: EnumValidator<
      | Validator.TOptional
      | 'Typescript'
      | 'Javascript'
      | 'Rust'
      | 'Go'
      | 'Python'
      | 'Cpp'
      | null
    >;
    /**
     * Prisma类型：`Language`
     *
     * 数据库默认值：`"Typescript"`
     */
    lang_de: EnumValidator<
      Validator.TOptional | 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'
    >;
    /**
     * Prisma类型：`DateTime`
     *
     * 数据库默认值：
     */
    time: DateValidator<Date>;
    /**
     * Prisma类型：`DateTime?`
     *
     * 数据库默认值：
     */
    time_nu: DateValidator<Validator.TOptional | Date | null>;
    /**
     * Prisma类型：`DateTime`
     *
     * 数据库默认值：`now()`
     */
    time_de: DateValidator<Validator.TOptional | Date>;
    /**
     * Prisma类型：`Boolean`
     *
     * 数据库默认值：
     */
    boo: BooleanValidator<boolean>;
    /**
     * Prisma类型：`Boolean?`
     *
     * 数据库默认值：
     */
    boo_nu: BooleanValidator<boolean | Validator.TOptional | null>;
    /**
     * Prisma类型：`Boolean`
     *
     * 数据库默认值：`true`
     */
    boo_de: BooleanValidator<boolean | Validator.TOptional>;
    /**
     * Prisma类型：`BigInt`
     *
     * 数据库默认值：
     */
    big: BigIntValidator<bigint>;
    /**
     * Prisma类型：`BigInt?`
     *
     * 数据库默认值：
     */
    big_nu: BigIntValidator<bigint | Validator.TOptional | null>;
    /**
     * Prisma类型：`BigInt`
     *
     * 数据库默认值：`"30"`
     */
    big_de: BigIntValidator<bigint | Validator.TOptional>;
    /**
     * Prisma类型：`Bytes`
     *
     * 数据库默认值：
     */
    byt: BufferValidator<Buffer<ArrayBufferLike>>;
    /**
     * Prisma类型：`Bytes?`
     *
     * 数据库默认值：
     */
    byt_nu: BufferValidator<Validator.TOptional | Buffer<ArrayBufferLike> | null>;
    /**
     * Prisma类型：`Bytes`
     *
     * 数据库默认值：`""`
     */
    byt_de: BufferValidator<Validator.TOptional | Buffer<ArrayBufferLike>>;
    /**
     * Prisma类型：`MyType`
     *
     * 数据库默认值：
     */
    custom: ObjectValidator<{
      id: number;
      name: string;
      other: {
        cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
      } & {
        abc?: string | null | undefined;
      };
    }>;
    /**
     * Prisma类型：`MyType?`
     *
     * 数据库默认值：
     */
    custom_nu: ObjectValidator<
      | Validator.TOptional
      | {
          id: number;
          name: string;
          other: {
            cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
          } & {
            abc?: string | null | undefined;
          };
        }
      | null
    >;
    /**
     * Prisma类型：`MyType[]`
     *
     * 数据库默认值：
     */
    custom_arr: ArrayValidator<
      {
        id: number;
        name: string;
        other: {
          cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
        } & {
          abc?: string | null | undefined;
        };
      }[]
    >;
  }>;
  profile: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string | Validator.TOptional>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    user_id: StringValidator<string>;
  }>;
  post: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string | Validator.TOptional>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    user_id: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    name: StringValidator<string>;
  }>;
  AliasTableName: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string | Validator.TOptional>;
  }>;
};
declare const prismaOutput: {
  user: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    name: StringValidator<string>;
    /**
     * Prisma类型：`String?`
     *
     * 数据库默认值：
     */
    name_nu: StringValidator<string | null>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`"abc"`
     */
    name_de: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`""`
     */
    name_de_empty: StringValidator<string>;
    /**
     * Prisma类型：`String[]`
     *
     * 数据库默认值：
     */
    str_arr: ArrayValidator<string[]>;
    /**
     * Prisma类型：`String[]`
     *
     * 数据库默认值：`[]`
     */
    str_arr_de: ArrayValidator<string[]>;
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：
     */
    age: IntValidator<number>;
    /**
     * Prisma类型：`Int?`
     *
     * 数据库默认值：
     */
    age_nu: IntValidator<number | null>;
    /**
     * Prisma类型：`Int`
     *
     * 数据库默认值：`100`
     */
    age_de: IntValidator<number>;
    /**
     * Prisma类型：`Int[]`
     *
     * 数据库默认值：
     */
    int_arr: ArrayValidator<number[]>;
    /**
     * Prisma类型：`Int[]`
     *
     * 数据库默认值：`[]`
     */
    int_arr_de: ArrayValidator<number[]>;
    /**
     * Prisma类型：`Json`
     *
     * 数据库默认值：
     */
    obj: AnyOfValidator<
      | unknown[]
      | {
          [K: string]: unknown;
        }
    >;
    /**
     * Prisma类型：`Json`
     *
     * 数据库默认值：`"{}"`
     */
    obj_de_obj: AnyOfValidator<
      | unknown[]
      | {
          [K: string]: unknown;
        }
    >;
    /**
     * Prisma类型：`Json`
     *
     * 数据库默认值：`"[]"`
     */
    obj_de_arr: AnyOfValidator<
      | unknown[]
      | {
          [K: string]: unknown;
        }
    >;
    /**
     * Prisma类型：`Float`
     *
     * 数据库默认值：
     */
    flo: NumberValidator<number>;
    /**
     * Prisma类型：`Float?`
     *
     * 数据库默认值：
     */
    flo_nu: NumberValidator<number | null>;
    /**
     * Prisma类型：`Float`
     *
     * 数据库默认值：`100.10000000000001`
     */
    flo_de: NumberValidator<number>;
    /**
     * Prisma类型：`Float[]`
     *
     * 数据库默认值：
     */
    flo_arr: ArrayValidator<number[]>;
    /**
     * Prisma类型：`Float[]`
     *
     * 数据库默认值：`[100.10000000000001]`
     */
    flo_arr_de: ArrayValidator<number[]>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`uuid(4)`
     */
    uu: UuidValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     *
     * I am the comments
     * line two of comments
     */
    comme_ok: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    comme_fail: StringValidator<string>;
    /**
     * Prisma类型：`Language`
     *
     * 数据库默认值：
     */
    lang: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
    /**
     * Prisma类型：`Language?`
     *
     * 数据库默认值：
     */
    lang_nu: EnumValidator<
      'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp' | null
    >;
    /**
     * Prisma类型：`Language`
     *
     * 数据库默认值：`"Typescript"`
     */
    lang_de: EnumValidator<
      'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'
    >;
    /**
     * Prisma类型：`DateTime`
     *
     * 数据库默认值：
     */
    time: DateValidator<Date>;
    /**
     * Prisma类型：`DateTime?`
     *
     * 数据库默认值：
     */
    time_nu: DateValidator<Date | null>;
    /**
     * Prisma类型：`DateTime`
     *
     * 数据库默认值：`now()`
     */
    time_de: DateValidator<Date>;
    /**
     * Prisma类型：`Boolean`
     *
     * 数据库默认值：
     */
    boo: BooleanValidator<boolean>;
    /**
     * Prisma类型：`Boolean?`
     *
     * 数据库默认值：
     */
    boo_nu: BooleanValidator<boolean | null>;
    /**
     * Prisma类型：`Boolean`
     *
     * 数据库默认值：`true`
     */
    boo_de: BooleanValidator<boolean>;
    /**
     * Prisma类型：`BigInt`
     *
     * 数据库默认值：
     */
    big: BigIntValidator<bigint>;
    /**
     * Prisma类型：`BigInt?`
     *
     * 数据库默认值：
     */
    big_nu: BigIntValidator<bigint | null>;
    /**
     * Prisma类型：`BigInt`
     *
     * 数据库默认值：`"30"`
     */
    big_de: BigIntValidator<bigint>;
    /**
     * Prisma类型：`Bytes`
     *
     * 数据库默认值：
     */
    byt: BufferValidator<Buffer<ArrayBufferLike>>;
    /**
     * Prisma类型：`Bytes?`
     *
     * 数据库默认值：
     */
    byt_nu: BufferValidator<Buffer<ArrayBufferLike> | null>;
    /**
     * Prisma类型：`Bytes`
     *
     * 数据库默认值：`""`
     */
    byt_de: BufferValidator<Buffer<ArrayBufferLike>>;
    /**
     * Prisma类型：`MyType`
     *
     * 数据库默认值：
     */
    custom: ObjectValidator<{
      id: number;
      name: string;
      other: {
        abc: string | null;
        cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
      };
    }>;
    /**
     * Prisma类型：`MyType?`
     *
     * 数据库默认值：
     */
    custom_nu: ObjectValidator<{
      id: number;
      name: string;
      other: {
        abc: string | null;
        cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
      };
    } | null>;
    /**
     * Prisma类型：`MyType[]`
     *
     * 数据库默认值：
     */
    custom_arr: ArrayValidator<
      {
        id: number;
        name: string;
        other: {
          abc: string | null;
          cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
        };
      }[]
    >;
  }>;
  profile: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    user_id: StringValidator<string>;
  }>;
  post: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    user_id: StringValidator<string>;
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：
     */
    name: StringValidator<string>;
  }>;
  AliasTableName: ValidatorSchema<{
    /**
     * Prisma类型：`String`
     *
     * 数据库默认值：`auto()`
     */
    id: StringValidator<string>;
  }>;
};

export declare const generated: PrismaGeneratedSchemas<
  typeof prismaInput,
  typeof prismaOutput,
  typeof prismaEnum
>;
import type {
  AnyOfValidator,
  ArrayValidator,
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateValidator,
  EnumValidator,
  IntValidator,
  NumberValidator,
  ObjectValidator,
  StringValidator,
  UuidValidator,
  Validator,
} from '@aomex/common';
export {};

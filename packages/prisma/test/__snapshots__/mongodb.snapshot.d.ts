export declare const LanguageEnum: readonly [
  'Typescript',
  'Javascript',
  'Rust',
  'Go',
  'Python',
  'Cpp',
];

export declare const YourTypeOutputType: {
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().nullable()`
   */
  abc: StringValidator<string | null>;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  cde: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
};

export declare const YourTypeInputType: {
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().optional()`
   */
  abc: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  cde: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
};

export declare const MyTypeOutputType: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: StringValidator<string>;
  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(YourTypeOutputType)`
   */
  other: ObjectValidator<{
    abc: string | null;
    cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
  }>;
};

export declare const MyTypeInputType: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: StringValidator<string>;
  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(YourTypeInputType)`
   */
  other: ObjectValidator<
    {
      cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
    } & {
      abc?: string | undefined;
    }
  >;
};

export declare const IAmAloseNotUsedOutputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
};

export declare const IAmAloseNotUsedInputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
};

export declare const IAmNotUsedOutputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
};

export declare const IAmNotUsedInputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
};
declare const userInputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: StringValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().optional()`
   */
  name_nu: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   *
   * 运行时规则：`rule.string().optional()`
   */
  name_de: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.string())`
   */
  str_arr: ArrayValidator<string[]>;
  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.string()).optional()`
   */
  str_arr_de: ArrayValidator<string[] | Validator.TOptional>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  age: IntValidator<number>;
  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int().optional()`
   */
  age_nu: IntValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.int().optional()`
   */
  age_de: IntValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.int())`
   */
  int_arr: ArrayValidator<number[]>;
  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.int()).optional()`
   */
  int_arr_de: ArrayValidator<number[] | Validator.TOptional>;
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()]).optional()`
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
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()]).optional()`
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
   *
   * 运行时规则：`rule.number()`
   */
  flo: NumberValidator<number>;
  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().optional()`
   */
  flo_nu: NumberValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   *
   * 运行时规则：`rule.number().optional()`
   */
  flo_de: NumberValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.number())`
   */
  flo_arr: ArrayValidator<number[]>;
  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：`[100.10000000000001]`
   *
   * 运行时规则：`rule.array(rule.number()).optional()`
   */
  flo_arr_de: ArrayValidator<number[] | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   *
   * 运行时规则：`rule.uuid(["v4"]).optional()`
   */
  uu: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().docs({ description: "I am the comments" })`
   *
   * I am the comments
   */
  comme_ok: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  comme_fail: StringValidator<string>;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  lang: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum).optional()`
   */
  lang_nu: EnumValidator<
    Validator.TOptional | 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'
  >;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   *
   * 运行时规则：`rule.enum(LanguageEnum).optional()`
   */
  lang_de: EnumValidator<
    Validator.TOptional | 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'
  >;
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date()`
   */
  time: DateValidator<Date>;
  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date().optional()`
   */
  time_nu: DateValidator<Validator.TOptional | Date>;
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   *
   * 运行时规则：`rule.date().optional()`
   */
  time_de: DateValidator<Validator.TOptional | Date>;
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean()`
   */
  boo: BooleanValidator<boolean>;
  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean().optional()`
   */
  boo_nu: BooleanValidator<boolean | Validator.TOptional>;
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   *
   * 运行时规则：`rule.boolean().optional()`
   */
  boo_de: BooleanValidator<boolean | Validator.TOptional>;
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint()`
   */
  big: BigIntValidator<bigint>;
  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint().optional()`
   */
  big_nu: BigIntValidator<bigint | Validator.TOptional>;
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   *
   * 运行时规则：`rule.bigint().optional()`
   */
  big_de: BigIntValidator<bigint | Validator.TOptional>;
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer()`
   */
  byt: BufferValidator<Buffer<ArrayBufferLike>>;
  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer().optional()`
   */
  byt_nu: BufferValidator<Validator.TOptional | Buffer<ArrayBufferLike>>;
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   *
   * 运行时规则：`rule.buffer().optional()`
   */
  byt_de: BufferValidator<Validator.TOptional | Buffer<ArrayBufferLike>>;
  /**
   * Prisma类型：`MyType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeInputType)`
   */
  custom: ObjectValidator<{
    id: number;
    name: string;
    other: {
      cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
    } & {
      abc?: string | undefined;
    };
  }>;
  /**
   * Prisma类型：`MyType?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeInputType).optional()`
   */
  custom_nu: ObjectValidator<
    | Validator.TOptional
    | {
        id: number;
        name: string;
        other: {
          cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
        } & {
          abc?: string | undefined;
        };
      }
  >;
  /**
   * Prisma类型：`MyType[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(MyTypeInputType)`
   */
  custom_arr: ArrayValidator<
    {
      id: number;
      name: string;
      other: {
        cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
      } & {
        abc?: string | undefined;
      };
    }[]
  >;
};
declare const userOutputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: StringValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().nullable()`
   */
  name_nu: StringValidator<string | null>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`"abc"`
   *
   * 运行时规则：`rule.string()`
   */
  name_de: StringValidator<string>;
  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.string())`
   */
  str_arr: ArrayValidator<string[]>;
  /**
   * Prisma类型：`String[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.string())`
   */
  str_arr_de: ArrayValidator<string[]>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  age: IntValidator<number>;
  /**
   * Prisma类型：`Int?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int().nullable()`
   */
  age_nu: IntValidator<number | null>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.int()`
   */
  age_de: IntValidator<number>;
  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.int())`
   */
  int_arr: ArrayValidator<number[]>;
  /**
   * Prisma类型：`Int[]`
   *
   * 数据库默认值：`[]`
   *
   * 运行时规则：`rule.array(rule.int())`
   */
  int_arr_de: ArrayValidator<number[]>;
  /**
   * Prisma类型：`Json`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
   *
   * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
   *
   * 运行时规则：`rule.number()`
   */
  flo: NumberValidator<number>;
  /**
   * Prisma类型：`Float?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().nullable()`
   */
  flo_nu: NumberValidator<number | null>;
  /**
   * Prisma类型：`Float`
   *
   * 数据库默认值：`100.10000000000001`
   *
   * 运行时规则：`rule.number()`
   */
  flo_de: NumberValidator<number>;
  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.array(rule.number())`
   */
  flo_arr: ArrayValidator<number[]>;
  /**
   * Prisma类型：`Float[]`
   *
   * 数据库默认值：`[100.10000000000001]`
   *
   * 运行时规则：`rule.array(rule.number())`
   */
  flo_arr_de: ArrayValidator<number[]>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`uuid(4)`
   *
   * 运行时规则：`rule.uuid(["v4"])`
   */
  uu: UuidValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string().docs({ description: "I am the comments" })`
   *
   * I am the comments
   */
  comme_ok: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  comme_fail: StringValidator<string>;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  lang: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
  /**
   * Prisma类型：`Language?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.enum(LanguageEnum).nullable()`
   */
  lang_nu: EnumValidator<
    'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp' | null
  >;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：`"Typescript"`
   *
   * 运行时规则：`rule.enum(LanguageEnum)`
   */
  lang_de: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date()`
   */
  time: DateValidator<Date>;
  /**
   * Prisma类型：`DateTime?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.date().nullable()`
   */
  time_nu: DateValidator<Date | null>;
  /**
   * Prisma类型：`DateTime`
   *
   * 数据库默认值：`now()`
   *
   * 运行时规则：`rule.date()`
   */
  time_de: DateValidator<Date>;
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean()`
   */
  boo: BooleanValidator<boolean>;
  /**
   * Prisma类型：`Boolean?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.boolean().nullable()`
   */
  boo_nu: BooleanValidator<boolean | null>;
  /**
   * Prisma类型：`Boolean`
   *
   * 数据库默认值：`true`
   *
   * 运行时规则：`rule.boolean()`
   */
  boo_de: BooleanValidator<boolean>;
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint()`
   */
  big: BigIntValidator<bigint>;
  /**
   * Prisma类型：`BigInt?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.bigint().nullable()`
   */
  big_nu: BigIntValidator<bigint | null>;
  /**
   * Prisma类型：`BigInt`
   *
   * 数据库默认值：`"30"`
   *
   * 运行时规则：`rule.bigint()`
   */
  big_de: BigIntValidator<bigint>;
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer()`
   */
  byt: BufferValidator<Buffer<ArrayBufferLike>>;
  /**
   * Prisma类型：`Bytes?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.buffer().nullable()`
   */
  byt_nu: BufferValidator<Buffer<ArrayBufferLike> | null>;
  /**
   * Prisma类型：`Bytes`
   *
   * 数据库默认值：`""`
   *
   * 运行时规则：`rule.buffer()`
   */
  byt_de: BufferValidator<Buffer<ArrayBufferLike>>;
  /**
   * Prisma类型：`MyType`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.object(MyTypeOutputType)`
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
   *
   * 运行时规则：`rule.object(MyTypeOutputType).nullable()`
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
   *
   * 运行时规则：`rule.array(MyTypeOutputType)`
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
};
declare const profileInputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: StringValidator<string>;
};
declare const profileOutputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: StringValidator<string>;
};
declare const postInputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: StringValidator<string>;
};
declare const postOutputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  user_id: StringValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.string()`
   */
  name: StringValidator<string>;
};
declare const aliasTableNameInputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string().optional()`
   */
  id: StringValidator<string | Validator.TOptional>;
};
declare const aliasTableNameOutputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   *
   * 运行时规则：`rule.string()`
   */
  id: StringValidator<string>;
};

export declare const prismaInput: {
  readonly user: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string().optional()`
       */
      id: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      name: StringValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string().optional()`
       */
      name_nu: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`"abc"`
       *
       * 运行时规则：`rule.string().optional()`
       */
      name_de: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(rule.string())`
       */
      str_arr: ArrayValidator<string[]>;
      /**
       * Prisma类型：`String[]`
       *
       * 数据库默认值：`[]`
       *
       * 运行时规则：`rule.array(rule.string()).optional()`
       */
      str_arr_de: ArrayValidator<string[] | Validator.TOptional>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int()`
       */
      age: IntValidator<number>;
      /**
       * Prisma类型：`Int?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int().optional()`
       */
      age_nu: IntValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：`100`
       *
       * 运行时规则：`rule.int().optional()`
       */
      age_de: IntValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Int[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(rule.int())`
       */
      int_arr: ArrayValidator<number[]>;
      /**
       * Prisma类型：`Int[]`
       *
       * 数据库默认值：`[]`
       *
       * 运行时规则：`rule.array(rule.int()).optional()`
       */
      int_arr_de: ArrayValidator<number[] | Validator.TOptional>;
      /**
       * Prisma类型：`Json`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
       *
       * 运行时规则：`rule.anyOf([rule.object(), rule.array()]).optional()`
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
       *
       * 运行时规则：`rule.anyOf([rule.object(), rule.array()]).optional()`
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
       *
       * 运行时规则：`rule.number()`
       */
      flo: NumberValidator<number>;
      /**
       * Prisma类型：`Float?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.number().optional()`
       */
      flo_nu: NumberValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Float`
       *
       * 数据库默认值：`100.10000000000001`
       *
       * 运行时规则：`rule.number().optional()`
       */
      flo_de: NumberValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Float[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(rule.number())`
       */
      flo_arr: ArrayValidator<number[]>;
      /**
       * Prisma类型：`Float[]`
       *
       * 数据库默认值：`[100.10000000000001]`
       *
       * 运行时规则：`rule.array(rule.number()).optional()`
       */
      flo_arr_de: ArrayValidator<number[] | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`uuid(4)`
       *
       * 运行时规则：`rule.uuid(["v4"]).optional()`
       */
      uu: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string().docs({ description: "I am the comments" })`
       *
       * I am the comments
       */
      comme_ok: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      comme_fail: StringValidator<string>;
      /**
       * Prisma类型：`Language`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.enum(LanguageEnum)`
       */
      lang: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
      /**
       * Prisma类型：`Language?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.enum(LanguageEnum).optional()`
       */
      lang_nu: EnumValidator<
        | Validator.TOptional
        | 'Typescript'
        | 'Javascript'
        | 'Rust'
        | 'Go'
        | 'Python'
        | 'Cpp'
      >;
      /**
       * Prisma类型：`Language`
       *
       * 数据库默认值：`"Typescript"`
       *
       * 运行时规则：`rule.enum(LanguageEnum).optional()`
       */
      lang_de: EnumValidator<
        | Validator.TOptional
        | 'Typescript'
        | 'Javascript'
        | 'Rust'
        | 'Go'
        | 'Python'
        | 'Cpp'
      >;
      /**
       * Prisma类型：`DateTime`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.date()`
       */
      time: DateValidator<Date>;
      /**
       * Prisma类型：`DateTime?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.date().optional()`
       */
      time_nu: DateValidator<Validator.TOptional | Date>;
      /**
       * Prisma类型：`DateTime`
       *
       * 数据库默认值：`now()`
       *
       * 运行时规则：`rule.date().optional()`
       */
      time_de: DateValidator<Validator.TOptional | Date>;
      /**
       * Prisma类型：`Boolean`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.boolean()`
       */
      boo: BooleanValidator<boolean>;
      /**
       * Prisma类型：`Boolean?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.boolean().optional()`
       */
      boo_nu: BooleanValidator<boolean | Validator.TOptional>;
      /**
       * Prisma类型：`Boolean`
       *
       * 数据库默认值：`true`
       *
       * 运行时规则：`rule.boolean().optional()`
       */
      boo_de: BooleanValidator<boolean | Validator.TOptional>;
      /**
       * Prisma类型：`BigInt`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.bigint()`
       */
      big: BigIntValidator<bigint>;
      /**
       * Prisma类型：`BigInt?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.bigint().optional()`
       */
      big_nu: BigIntValidator<bigint | Validator.TOptional>;
      /**
       * Prisma类型：`BigInt`
       *
       * 数据库默认值：`"30"`
       *
       * 运行时规则：`rule.bigint().optional()`
       */
      big_de: BigIntValidator<bigint | Validator.TOptional>;
      /**
       * Prisma类型：`Bytes`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.buffer()`
       */
      byt: BufferValidator<Buffer<ArrayBufferLike>>;
      /**
       * Prisma类型：`Bytes?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.buffer().optional()`
       */
      byt_nu: BufferValidator<Validator.TOptional | Buffer<ArrayBufferLike>>;
      /**
       * Prisma类型：`Bytes`
       *
       * 数据库默认值：`""`
       *
       * 运行时规则：`rule.buffer().optional()`
       */
      byt_de: BufferValidator<Validator.TOptional | Buffer<ArrayBufferLike>>;
      /**
       * Prisma类型：`MyType`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.object(MyTypeInputType)`
       */
      custom: ObjectValidator<{
        id: number;
        name: string;
        other: {
          cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
        } & {
          abc?: string | undefined;
        };
      }>;
      /**
       * Prisma类型：`MyType?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.object(MyTypeInputType).optional()`
       */
      custom_nu: ObjectValidator<
        | Validator.TOptional
        | {
            id: number;
            name: string;
            other: {
              cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
            } & {
              abc?: string | undefined;
            };
          }
      >;
      /**
       * Prisma类型：`MyType[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(MyTypeInputType)`
       */
      custom_arr: ArrayValidator<
        {
          id: number;
          name: string;
          other: {
            cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
          } & {
            abc?: string | undefined;
          };
        }[]
      >;
    };
    /** 选择部分字段 */
    readonly pick: <
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
    ) => { [K in Keys]: (typeof userInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <
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
    ) => {
      [K in keyof typeof userInputColumns as K extends Keys
        ? never
        : K]: (typeof userInputColumns)[K];
    };
  };
  readonly profile: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string().optional()`
       */
      id: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      user_id: StringValidator<string>;
    };
    /** 选择部分字段 */
    readonly pick: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ) => { [K in Keys]: (typeof profileInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof profileInputColumns as K extends Keys
        ? never
        : K]: (typeof profileInputColumns)[K];
    };
  };
  readonly post: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string().optional()`
       */
      id: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      user_id: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      name: StringValidator<string>;
    };
    /** 选择部分字段 */
    readonly pick: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ) => { [K in Keys]: (typeof postInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof postInputColumns as K extends Keys
        ? never
        : K]: (typeof postInputColumns)[K];
    };
  };
  readonly aliasTableName: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string().optional()`
       */
      id: StringValidator<string | Validator.TOptional>;
    };
    /** 选择部分字段 */
    readonly pick: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => { [K in Keys]: (typeof aliasTableNameInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof aliasTableNameInputColumns as K extends Keys
        ? never
        : K]: (typeof aliasTableNameInputColumns)[K];
    };
  };
};

export declare const prismaOutput: {
  readonly user: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string()`
       */
      id: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      name: StringValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string().nullable()`
       */
      name_nu: StringValidator<string | null>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`"abc"`
       *
       * 运行时规则：`rule.string()`
       */
      name_de: StringValidator<string>;
      /**
       * Prisma类型：`String[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(rule.string())`
       */
      str_arr: ArrayValidator<string[]>;
      /**
       * Prisma类型：`String[]`
       *
       * 数据库默认值：`[]`
       *
       * 运行时规则：`rule.array(rule.string())`
       */
      str_arr_de: ArrayValidator<string[]>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int()`
       */
      age: IntValidator<number>;
      /**
       * Prisma类型：`Int?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int().nullable()`
       */
      age_nu: IntValidator<number | null>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：`100`
       *
       * 运行时规则：`rule.int()`
       */
      age_de: IntValidator<number>;
      /**
       * Prisma类型：`Int[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(rule.int())`
       */
      int_arr: ArrayValidator<number[]>;
      /**
       * Prisma类型：`Int[]`
       *
       * 数据库默认值：`[]`
       *
       * 运行时规则：`rule.array(rule.int())`
       */
      int_arr_de: ArrayValidator<number[]>;
      /**
       * Prisma类型：`Json`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
       *
       * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
       *
       * 运行时规则：`rule.anyOf([rule.object(), rule.array()])`
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
       *
       * 运行时规则：`rule.number()`
       */
      flo: NumberValidator<number>;
      /**
       * Prisma类型：`Float?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.number().nullable()`
       */
      flo_nu: NumberValidator<number | null>;
      /**
       * Prisma类型：`Float`
       *
       * 数据库默认值：`100.10000000000001`
       *
       * 运行时规则：`rule.number()`
       */
      flo_de: NumberValidator<number>;
      /**
       * Prisma类型：`Float[]`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.array(rule.number())`
       */
      flo_arr: ArrayValidator<number[]>;
      /**
       * Prisma类型：`Float[]`
       *
       * 数据库默认值：`[100.10000000000001]`
       *
       * 运行时规则：`rule.array(rule.number())`
       */
      flo_arr_de: ArrayValidator<number[]>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`uuid(4)`
       *
       * 运行时规则：`rule.uuid(["v4"])`
       */
      uu: UuidValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string().docs({ description: "I am the comments" })`
       *
       * I am the comments
       */
      comme_ok: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      comme_fail: StringValidator<string>;
      /**
       * Prisma类型：`Language`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.enum(LanguageEnum)`
       */
      lang: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
      /**
       * Prisma类型：`Language?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.enum(LanguageEnum).nullable()`
       */
      lang_nu: EnumValidator<
        'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp' | null
      >;
      /**
       * Prisma类型：`Language`
       *
       * 数据库默认值：`"Typescript"`
       *
       * 运行时规则：`rule.enum(LanguageEnum)`
       */
      lang_de: EnumValidator<
        'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'
      >;
      /**
       * Prisma类型：`DateTime`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.date()`
       */
      time: DateValidator<Date>;
      /**
       * Prisma类型：`DateTime?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.date().nullable()`
       */
      time_nu: DateValidator<Date | null>;
      /**
       * Prisma类型：`DateTime`
       *
       * 数据库默认值：`now()`
       *
       * 运行时规则：`rule.date()`
       */
      time_de: DateValidator<Date>;
      /**
       * Prisma类型：`Boolean`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.boolean()`
       */
      boo: BooleanValidator<boolean>;
      /**
       * Prisma类型：`Boolean?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.boolean().nullable()`
       */
      boo_nu: BooleanValidator<boolean | null>;
      /**
       * Prisma类型：`Boolean`
       *
       * 数据库默认值：`true`
       *
       * 运行时规则：`rule.boolean()`
       */
      boo_de: BooleanValidator<boolean>;
      /**
       * Prisma类型：`BigInt`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.bigint()`
       */
      big: BigIntValidator<bigint>;
      /**
       * Prisma类型：`BigInt?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.bigint().nullable()`
       */
      big_nu: BigIntValidator<bigint | null>;
      /**
       * Prisma类型：`BigInt`
       *
       * 数据库默认值：`"30"`
       *
       * 运行时规则：`rule.bigint()`
       */
      big_de: BigIntValidator<bigint>;
      /**
       * Prisma类型：`Bytes`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.buffer()`
       */
      byt: BufferValidator<Buffer<ArrayBufferLike>>;
      /**
       * Prisma类型：`Bytes?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.buffer().nullable()`
       */
      byt_nu: BufferValidator<Buffer<ArrayBufferLike> | null>;
      /**
       * Prisma类型：`Bytes`
       *
       * 数据库默认值：`""`
       *
       * 运行时规则：`rule.buffer()`
       */
      byt_de: BufferValidator<Buffer<ArrayBufferLike>>;
      /**
       * Prisma类型：`MyType`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.object(MyTypeOutputType)`
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
       *
       * 运行时规则：`rule.object(MyTypeOutputType).nullable()`
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
       *
       * 运行时规则：`rule.array(MyTypeOutputType)`
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
    };
    /** 选择部分字段 */
    readonly pick: <
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
    ) => { [K in Keys]: (typeof userOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <
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
    ) => {
      [K in keyof typeof userOutputColumns as K extends Keys
        ? never
        : K]: (typeof userOutputColumns)[K];
    };
  };
  readonly profile: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string()`
       */
      id: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      user_id: StringValidator<string>;
    };
    /** 选择部分字段 */
    readonly pick: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ) => { [K in Keys]: (typeof profileOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id' | 'user_id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof profileOutputColumns as K extends Keys
        ? never
        : K]: (typeof profileOutputColumns)[K];
    };
  };
  readonly post: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string()`
       */
      id: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      user_id: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.string()`
       */
      name: StringValidator<string>;
    };
    /** 选择部分字段 */
    readonly pick: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ) => { [K in Keys]: (typeof postOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id' | 'user_id' | 'name'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof postOutputColumns as K extends Keys
        ? never
        : K]: (typeof postOutputColumns)[K];
    };
  };
  readonly aliasTableName: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`auto()`
       *
       * 运行时规则：`rule.string()`
       */
      id: StringValidator<string>;
    };
    /** 选择部分字段 */
    readonly pick: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => { [K in Keys]: (typeof aliasTableNameOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof aliasTableNameOutputColumns as K extends Keys
        ? never
        : K]: (typeof aliasTableNameOutputColumns)[K];
    };
  };
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

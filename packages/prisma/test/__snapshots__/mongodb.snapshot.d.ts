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
   */
  abc: StringValidator<string | null>;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  cde: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
};

export declare const YourTypeInputType: {
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：
   */
  abc: StringValidator<string | Validator.TOptional | null>;
  /**
   * Prisma类型：`Language`
   *
   * 数据库默认值：
   */
  cde: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
};

export declare const MyTypeOutputType: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   */
  id: IntValidator<number>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: StringValidator<string>;
  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
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
   */
  id: IntValidator<number>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  name: StringValidator<string>;
  /**
   * Prisma类型：`YourType`
   *
   * 数据库默认值：
   */
  other: ObjectValidator<
    {
      cde: 'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp';
    } & {
      abc?: string | null | undefined;
    }
  >;
};

export declare const IAmAloseNotUsedOutputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: StringValidator<string>;
};

export declare const IAmAloseNotUsedInputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: StringValidator<string>;
};

export declare const IAmNotUsedOutputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: StringValidator<string>;
};

export declare const IAmNotUsedInputType: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：
   */
  id: StringValidator<string>;
};
declare const userInputColumns: {
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
};
declare const userOutputColumns: {
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
  lang_de: EnumValidator<'Typescript' | 'Javascript' | 'Rust' | 'Go' | 'Python' | 'Cpp'>;
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
};
declare const profileInputColumns: {
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
};
declare const profileOutputColumns: {
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
};
declare const postInputColumns: {
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
};
declare const postOutputColumns: {
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
};
declare const aliasTableNameInputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
   */
  id: StringValidator<string | Validator.TOptional>;
};
declare const aliasTableNameOutputColumns: {
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`auto()`
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
    };
    /** 选择部分字段 */
    readonly pick: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'name_de_empty'
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
        | 'name_de_empty'
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
       */
      id: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
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
    };
    /** 选择部分字段 */
    readonly pick: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'name_de_empty'
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
        | 'name_de_empty'
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
       */
      id: StringValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：
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
    'name_de_empty',
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

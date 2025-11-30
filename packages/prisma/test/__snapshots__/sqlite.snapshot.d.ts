declare const userInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
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
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number()`
   */
  deci: NumberValidator<number>;
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().optional()`
   */
  deci_nu: NumberValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.number().optional()`
   */
  deci_de: NumberValidator<number | Validator.TOptional>;
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
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"]).optional()`
   */
  uu_1: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"]).optional()`
   */
  uu_1_nu: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"]).optional()`
   */
  uu_2: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"]).optional()`
   */
  uu_2_nu: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"]).optional()`
   */
  uu_3: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"]).optional()`
   */
  uu_3_nu: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"]).optional()`
   */
  uu_4: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"]).optional()`
   */
  uu_4_nu: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"]).optional()`
   */
  uu_5: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"]).optional()`
   */
  uu_5_nu: UuidValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string().optional()`
   */
  uu_6: StringValidator<string | Validator.TOptional>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string().optional()`
   */
  uu_6_nu: StringValidator<string | Validator.TOptional>;
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
};
declare const userOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
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
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number()`
   */
  deci: NumberValidator<number>;
  /**
   * Prisma类型：`Decimal?`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.number().nullable()`
   */
  deci_nu: NumberValidator<number | null>;
  /**
   * Prisma类型：`Decimal`
   *
   * 数据库默认值：`100`
   *
   * 运行时规则：`rule.number()`
   */
  deci_de: NumberValidator<number>;
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
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"])`
   */
  uu_1: UuidValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v1())`
   *
   * 运行时规则：`rule.uuid(["v1"])`
   */
  uu_1_nu: UuidValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"])`
   */
  uu_2: UuidValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v2())`
   *
   * 运行时规则：`rule.uuid(["v2"])`
   */
  uu_2_nu: UuidValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"])`
   */
  uu_3: UuidValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v3())`
   *
   * 运行时规则：`rule.uuid(["v3"])`
   */
  uu_3_nu: UuidValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"])`
   */
  uu_4: UuidValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v4())`
   *
   * 运行时规则：`rule.uuid(["v4"])`
   */
  uu_4_nu: UuidValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"])`
   */
  uu_5: UuidValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v5())`
   *
   * 运行时规则：`rule.uuid(["v5"])`
   */
  uu_5_nu: UuidValidator<string>;
  /**
   * Prisma类型：`String`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string()`
   */
  uu_6: StringValidator<string>;
  /**
   * Prisma类型：`String?`
   *
   * 数据库默认值：`dbgenerated(uuid_generate_v6())`
   *
   * 运行时规则：`rule.string()`
   */
  uu_6_nu: StringValidator<string>;
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
};
declare const profileInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: IntValidator<number>;
};
declare const profileOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: IntValidator<number>;
};
declare const postInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: IntValidator<number>;
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
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：
   *
   * 运行时规则：`rule.int()`
   */
  user_id: IntValidator<number>;
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
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const aliasTableNameOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};

export declare const prismaInput: {
  readonly user: {
    /** 所有字段对象 */
    readonly columns: {
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int().optional()`
       */
      id: IntValidator<number | Validator.TOptional>;
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
       * Prisma类型：`Decimal`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.number()`
       */
      deci: NumberValidator<number>;
      /**
       * Prisma类型：`Decimal?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.number().optional()`
       */
      deci_nu: NumberValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Decimal`
       *
       * 数据库默认值：`100`
       *
       * 运行时规则：`rule.number().optional()`
       */
      deci_de: NumberValidator<number | Validator.TOptional>;
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
       * 数据库默认值：`dbgenerated(uuid_generate_v1())`
       *
       * 运行时规则：`rule.uuid(["v1"]).optional()`
       */
      uu_1: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v1())`
       *
       * 运行时规则：`rule.uuid(["v1"]).optional()`
       */
      uu_1_nu: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v2())`
       *
       * 运行时规则：`rule.uuid(["v2"]).optional()`
       */
      uu_2: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v2())`
       *
       * 运行时规则：`rule.uuid(["v2"]).optional()`
       */
      uu_2_nu: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v3())`
       *
       * 运行时规则：`rule.uuid(["v3"]).optional()`
       */
      uu_3: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v3())`
       *
       * 运行时规则：`rule.uuid(["v3"]).optional()`
       */
      uu_3_nu: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v4())`
       *
       * 运行时规则：`rule.uuid(["v4"]).optional()`
       */
      uu_4: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v4())`
       *
       * 运行时规则：`rule.uuid(["v4"]).optional()`
       */
      uu_4_nu: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v5())`
       *
       * 运行时规则：`rule.uuid(["v5"]).optional()`
       */
      uu_5: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v5())`
       *
       * 运行时规则：`rule.uuid(["v5"]).optional()`
       */
      uu_5_nu: UuidValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v6())`
       *
       * 运行时规则：`rule.string().optional()`
       */
      uu_6: StringValidator<string | Validator.TOptional>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v6())`
       *
       * 运行时规则：`rule.string().optional()`
       */
      uu_6_nu: StringValidator<string | Validator.TOptional>;
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
    };
    /** 选择部分字段 */
    readonly pick: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'deci'
        | 'deci_nu'
        | 'deci_de'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'uu'
        | 'uu_1'
        | 'uu_1_nu'
        | 'uu_2'
        | 'uu_2_nu'
        | 'uu_3'
        | 'uu_3_nu'
        | 'uu_4'
        | 'uu_4_nu'
        | 'uu_5'
        | 'uu_5_nu'
        | 'uu_6'
        | 'uu_6_nu'
        | 'comme_ok'
        | 'comme_fail'
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
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'deci'
        | 'deci_nu'
        | 'deci_de'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'uu'
        | 'uu_1'
        | 'uu_1_nu'
        | 'uu_2'
        | 'uu_2_nu'
        | 'uu_3'
        | 'uu_3_nu'
        | 'uu_4'
        | 'uu_4_nu'
        | 'uu_5'
        | 'uu_5_nu'
        | 'uu_6'
        | 'uu_6_nu'
        | 'comme_ok'
        | 'comme_fail'
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int().optional()`
       */
      id: IntValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int()`
       */
      user_id: IntValidator<number>;
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int().optional()`
       */
      id: IntValidator<number | Validator.TOptional>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int()`
       */
      user_id: IntValidator<number>;
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int().optional()`
       */
      id: IntValidator<number | Validator.TOptional>;
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
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
       * Prisma类型：`Decimal`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.number()`
       */
      deci: NumberValidator<number>;
      /**
       * Prisma类型：`Decimal?`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.number().nullable()`
       */
      deci_nu: NumberValidator<number | null>;
      /**
       * Prisma类型：`Decimal`
       *
       * 数据库默认值：`100`
       *
       * 运行时规则：`rule.number()`
       */
      deci_de: NumberValidator<number>;
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
       * 数据库默认值：`dbgenerated(uuid_generate_v1())`
       *
       * 运行时规则：`rule.uuid(["v1"])`
       */
      uu_1: UuidValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v1())`
       *
       * 运行时规则：`rule.uuid(["v1"])`
       */
      uu_1_nu: UuidValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v2())`
       *
       * 运行时规则：`rule.uuid(["v2"])`
       */
      uu_2: UuidValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v2())`
       *
       * 运行时规则：`rule.uuid(["v2"])`
       */
      uu_2_nu: UuidValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v3())`
       *
       * 运行时规则：`rule.uuid(["v3"])`
       */
      uu_3: UuidValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v3())`
       *
       * 运行时规则：`rule.uuid(["v3"])`
       */
      uu_3_nu: UuidValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v4())`
       *
       * 运行时规则：`rule.uuid(["v4"])`
       */
      uu_4: UuidValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v4())`
       *
       * 运行时规则：`rule.uuid(["v4"])`
       */
      uu_4_nu: UuidValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v5())`
       *
       * 运行时规则：`rule.uuid(["v5"])`
       */
      uu_5: UuidValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v5())`
       *
       * 运行时规则：`rule.uuid(["v5"])`
       */
      uu_5_nu: UuidValidator<string>;
      /**
       * Prisma类型：`String`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v6())`
       *
       * 运行时规则：`rule.string()`
       */
      uu_6: StringValidator<string>;
      /**
       * Prisma类型：`String?`
       *
       * 数据库默认值：`dbgenerated(uuid_generate_v6())`
       *
       * 运行时规则：`rule.string()`
       */
      uu_6_nu: StringValidator<string>;
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
    };
    /** 选择部分字段 */
    readonly pick: <
      Keys extends
        | 'id'
        | 'name'
        | 'name_nu'
        | 'name_de'
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'deci'
        | 'deci_nu'
        | 'deci_de'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'uu'
        | 'uu_1'
        | 'uu_1_nu'
        | 'uu_2'
        | 'uu_2_nu'
        | 'uu_3'
        | 'uu_3_nu'
        | 'uu_4'
        | 'uu_4_nu'
        | 'uu_5'
        | 'uu_5_nu'
        | 'uu_6'
        | 'uu_6_nu'
        | 'comme_ok'
        | 'comme_fail'
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
        | 'age'
        | 'age_nu'
        | 'age_de'
        | 'deci'
        | 'deci_nu'
        | 'deci_de'
        | 'flo'
        | 'flo_nu'
        | 'flo_de'
        | 'uu'
        | 'uu_1'
        | 'uu_1_nu'
        | 'uu_2'
        | 'uu_2_nu'
        | 'uu_3'
        | 'uu_3_nu'
        | 'uu_4'
        | 'uu_4_nu'
        | 'uu_5'
        | 'uu_5_nu'
        | 'uu_6'
        | 'uu_6_nu'
        | 'comme_ok'
        | 'comme_fail'
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int()`
       */
      id: IntValidator<number>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int()`
       */
      user_id: IntValidator<number>;
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int()`
       */
      id: IntValidator<number>;
      /**
       * Prisma类型：`Int`
       *
       * 数据库默认值：
       *
       * 运行时规则：`rule.int()`
       */
      user_id: IntValidator<number>;
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
       * Prisma类型：`Int`
       *
       * 数据库默认值：`autoincrement()`
       *
       * 运行时规则：`rule.int()`
       */
      id: IntValidator<number>;
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
    'age',
    'age_nu',
    'age_de',
    'deci',
    'deci_nu',
    'deci_de',
    'flo',
    'flo_nu',
    'flo_de',
    'uu',
    'uu_1',
    'uu_1_nu',
    'uu_2',
    'uu_2_nu',
    'uu_3',
    'uu_3_nu',
    'uu_4',
    'uu_4_nu',
    'uu_5',
    'uu_5_nu',
    'uu_6',
    'uu_6_nu',
    'comme_ok',
    'comme_fail',
    'posts',
    'profile',
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
  ];
  profile: ['id', 'user_id', 'user'];
  post: ['id', 'user_id', 'name', 'user'];
  aliasTableName: ['id'];
};
import type {
  BigIntValidator,
  BooleanValidator,
  BufferValidator,
  DateValidator,
  IntValidator,
  NumberValidator,
  StringValidator,
  UuidValidator,
  Validator,
} from '@aomex/common';
export {};

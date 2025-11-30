declare const lowercaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const lowercaseOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};
declare const uppercaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const uppercaseOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};
declare const camelCaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const camelCaseOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};
declare const pascalCaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const pascalCaseOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};
declare const titlecaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const titlecaseOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};
declare const snakeCaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const snakeCaseOutputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: IntValidator<number>;
};
declare const completeCaseInputColumns: {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: IntValidator<number | Validator.TOptional>;
};
declare const completeCaseOutputColumns: {
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
  readonly lowercase: {
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
    ) => { [K in Keys]: (typeof lowercaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof lowercaseInputColumns as K extends Keys
        ? never
        : K]: (typeof lowercaseInputColumns)[K];
    };
  };
  readonly uppercase: {
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
    ) => { [K in Keys]: (typeof uppercaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof uppercaseInputColumns as K extends Keys
        ? never
        : K]: (typeof uppercaseInputColumns)[K];
    };
  };
  readonly camelCase: {
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
    ) => { [K in Keys]: (typeof camelCaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof camelCaseInputColumns as K extends Keys
        ? never
        : K]: (typeof camelCaseInputColumns)[K];
    };
  };
  readonly pascalCase: {
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
    ) => { [K in Keys]: (typeof pascalCaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof pascalCaseInputColumns as K extends Keys
        ? never
        : K]: (typeof pascalCaseInputColumns)[K];
    };
  };
  readonly titlecase: {
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
    ) => { [K in Keys]: (typeof titlecaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof titlecaseInputColumns as K extends Keys
        ? never
        : K]: (typeof titlecaseInputColumns)[K];
    };
  };
  readonly snakeCase: {
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
    ) => { [K in Keys]: (typeof snakeCaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof snakeCaseInputColumns as K extends Keys
        ? never
        : K]: (typeof snakeCaseInputColumns)[K];
    };
  };
  readonly completeCase: {
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
    ) => { [K in Keys]: (typeof completeCaseInputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof completeCaseInputColumns as K extends Keys
        ? never
        : K]: (typeof completeCaseInputColumns)[K];
    };
  };
};

export declare const prismaOutput: {
  readonly lowercase: {
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
    ) => { [K in Keys]: (typeof lowercaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof lowercaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof lowercaseOutputColumns)[K];
    };
  };
  readonly uppercase: {
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
    ) => { [K in Keys]: (typeof uppercaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof uppercaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof uppercaseOutputColumns)[K];
    };
  };
  readonly camelCase: {
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
    ) => { [K in Keys]: (typeof camelCaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof camelCaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof camelCaseOutputColumns)[K];
    };
  };
  readonly pascalCase: {
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
    ) => { [K in Keys]: (typeof pascalCaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof pascalCaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof pascalCaseOutputColumns)[K];
    };
  };
  readonly titlecase: {
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
    ) => { [K in Keys]: (typeof titlecaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof titlecaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof titlecaseOutputColumns)[K];
    };
  };
  readonly snakeCase: {
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
    ) => { [K in Keys]: (typeof snakeCaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof snakeCaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof snakeCaseOutputColumns)[K];
    };
  };
  readonly completeCase: {
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
    ) => { [K in Keys]: (typeof completeCaseOutputColumns)[K] };
    /** 去除部分字段 */
    readonly omit: <Keys extends 'id'>(
      ...keys: Keys[]
    ) => {
      [K in keyof typeof completeCaseOutputColumns as K extends Keys
        ? never
        : K]: (typeof completeCaseOutputColumns)[K];
    };
  };
};
export type PrismaSchemaMap = {
  lowercase: ['id'];
  uppercase: ['id'];
  camelCase: ['id'];
  pascalCase: ['id'];
  titlecase: ['id'];
  snakeCase: ['id'];
  completeCase: ['id'];
};
import type { IntValidator, Validator } from '@aomex/common';
export {};

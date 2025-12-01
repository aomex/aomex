// @ts-nocheck
import { rule } from '@aomex/common';
import { overrideColumnsFactory } from '@aomex/prisma';
// 如果想覆盖默认生成的类型，可以同目录下创建一个 index.override.ts 文件，然后重新执行 prisma generate 命令
// import customColumns from './index.override';
const customColumns = overrideColumnsFactory()({});
function pick(obj, ...keys) {
  const subObj = {};
  for (const key of keys) {
    if (Object.hasOwn(obj, key)) {
      subObj[key] = obj[key];
    }
  }
  return subObj;
}
function omit(obj, ...keys) {
  const allKeys = Object.keys(obj);
  return pick(obj, ...allKeys.filter((key) => !keys.includes(key)));
}
const lowercaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.lowercase?.id?.input || rule.int().optional(),
};
const lowercaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.lowercase?.id?.output || rule.int(),
};
const uppercaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.uppercase?.id?.input || rule.int().optional(),
};
const uppercaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.uppercase?.id?.output || rule.int(),
};
const camelCaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.camelCase?.id?.input || rule.int().optional(),
};
const camelCaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.camelCase?.id?.output || rule.int(),
};
const pascalCaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.pascalCase?.id?.input || rule.int().optional(),
};
const pascalCaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.pascalCase?.id?.output || rule.int(),
};
const titlecaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.titlecase?.id?.input || rule.int().optional(),
};
const titlecaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.titlecase?.id?.output || rule.int(),
};
const snakeCaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.snakeCase?.id?.input || rule.int().optional(),
};
const snakeCaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.snakeCase?.id?.output || rule.int(),
};
const completeCaseInputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int().optional()`
   */
  id: customColumns.completeCase?.id?.input || rule.int().optional(),
};
const completeCaseOutputColumns = {
  /**
   * Prisma类型：`Int`
   *
   * 数据库默认值：`autoincrement()`
   *
   * 运行时规则：`rule.int()`
   */
  id: customColumns.completeCase?.id?.output || rule.int(),
};

export const prismaInput = {
  lowercase: {
    /** 所有字段对象 */
    columns: lowercaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(lowercaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(lowercaseInputColumns, ...keys);
    },
  },
  uppercase: {
    /** 所有字段对象 */
    columns: uppercaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(uppercaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(uppercaseInputColumns, ...keys);
    },
  },
  camelCase: {
    /** 所有字段对象 */
    columns: camelCaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(camelCaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(camelCaseInputColumns, ...keys);
    },
  },
  pascalCase: {
    /** 所有字段对象 */
    columns: pascalCaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(pascalCaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(pascalCaseInputColumns, ...keys);
    },
  },
  titlecase: {
    /** 所有字段对象 */
    columns: titlecaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(titlecaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(titlecaseInputColumns, ...keys);
    },
  },
  snakeCase: {
    /** 所有字段对象 */
    columns: snakeCaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(snakeCaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(snakeCaseInputColumns, ...keys);
    },
  },
  completeCase: {
    /** 所有字段对象 */
    columns: completeCaseInputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(completeCaseInputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(completeCaseInputColumns, ...keys);
    },
  },
};

export const prismaOutput = {
  lowercase: {
    /** 所有字段对象 */
    columns: lowercaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(lowercaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(lowercaseOutputColumns, ...keys);
    },
  },
  uppercase: {
    /** 所有字段对象 */
    columns: uppercaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(uppercaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(uppercaseOutputColumns, ...keys);
    },
  },
  camelCase: {
    /** 所有字段对象 */
    columns: camelCaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(camelCaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(camelCaseOutputColumns, ...keys);
    },
  },
  pascalCase: {
    /** 所有字段对象 */
    columns: pascalCaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(pascalCaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(pascalCaseOutputColumns, ...keys);
    },
  },
  titlecase: {
    /** 所有字段对象 */
    columns: titlecaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(titlecaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(titlecaseOutputColumns, ...keys);
    },
  },
  snakeCase: {
    /** 所有字段对象 */
    columns: snakeCaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(snakeCaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(snakeCaseOutputColumns, ...keys);
    },
  },
  completeCase: {
    /** 所有字段对象 */
    columns: completeCaseOutputColumns,
    /** 选择部分字段 */
    pick: (...keys) => {
      // @ts-ignore
      return pick(completeCaseOutputColumns, ...keys);
    },
    /** 去除部分字段 */
    omit: (...keys) => {
      // @ts-ignore
      return omit(completeCaseOutputColumns, ...keys);
    },
  },
};

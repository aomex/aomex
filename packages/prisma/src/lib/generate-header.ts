import { existsSync } from 'node:fs';
import path from 'node:path';

export const generateHeader = (output: string) => {
  const overrideFile = output + '.override';
  const existOverrideFile = existsSync(overrideFile + '.ts');
  const baseName = path.basename(overrideFile);

  return `
  // @ts-nocheck
  import { rule } from "@aomex/common";
  ${
    existOverrideFile
      ? `import customColumns from './${baseName}';`
      : `
  import { overrideColumns } from '@aomex/prisma';
  // 如果想覆盖默认生成的类型，可以同目录下创建一个 ${baseName}.ts 文件，然后重新执行 prisma generate 命令
  // import customColumns from './${baseName}';
  const customColumns = overrideColumns<PrismaSchemaMap>()({});
  `
  }
  
  function pick<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
    const subObj: Partial<T> = {};
    for (const key of keys) {
      if (Object.hasOwn(obj, key)) {
        subObj[key] = obj[key];
      }
    }
    return subObj;
  }

  function omit<T extends object, K extends keyof T>(obj: T, ...keys: K[]) {
    const allKeys = Object.keys(obj) as K[];
    return pick(obj, ...allKeys.filter((key) => !keys.includes(key)));
  }
  `;
};

import type { Validator } from '@aomex/common';

export const overrideColumns = <PrismaSchemaMap extends Record<string, string[]>>() => {
  return function overrideColumns<
    T extends {
      [ModalName in keyof PrismaSchemaMap]?: {
        [FieldName in PrismaSchemaMap[ModalName][number]]?: {
          input: Validator;
          output: Validator;
        };
      };
    },
  >(
    fields: T,
  ): {
    [ModelName in Extract<keyof PrismaSchemaMap, keyof T>]: {
      [FieldName in Extract<
        PrismaSchemaMap[ModelName][number],
        keyof T[ModelName]
      >]: T[ModelName][FieldName];
    } & (ModelName extends keyof PrismaSchemaMap
      ? {
          [FieldName in Exclude<
            PrismaSchemaMap[ModelName][number],
            keyof T[ModelName]
          >]?: {
            input?: undefined;
            output?: undefined;
          };
        }
      : never);
  } & {
    [ModelName in Exclude<keyof PrismaSchemaMap, keyof T>]?: {
      [FieldName in PrismaSchemaMap[ModelName][number]]?: {
        input?: undefined;
        output?: undefined;
      };
    };
  } {
    /** @ts-expect-error */
    return fields;
  };
};

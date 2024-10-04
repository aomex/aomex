import { middleware, validate, Validator, ValidateDeniedError } from '@aomex/core';
import type { WebMiddleware } from '../override';

/**
 * 验证请求查询字符串
 */
export const query = <T extends { [key: string]: P }, P extends Validator>(
  fields: T,
): WebMiddleware<{ readonly query: Validator.Infer<T> }> => {
  return middleware.web({
    fn: async (ctx, next) => {
      try {
        ctx.query = await validate(ctx.request.query, fields);
        return next();
      } catch (e) {
        ctx.throw(e instanceof ValidateDeniedError ? 400 : 500, e as Error);
      }
    },
    openapi: {
      onMethod(methodItem) {
        methodItem.parameters ||= [];
        Object.entries(fields).forEach(([name, validator]) => {
          methodItem.parameters!.push({
            name,
            in: 'query',
            ...Validator.toDocument(validator),
          });
        });
      },
    },
  });
};

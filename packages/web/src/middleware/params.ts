import { middleware, validate, Validator, ValidatorError } from '@aomex/core';
import type { WebMiddleware } from '../override';

/**
 * 验证请求路径参数
 */
export const params = <T extends { [key: string]: P }, P extends Validator>(
  fields: T,
): WebMiddleware<{ readonly params: Validator.Infer<T> }> => {
  return middleware.web({
    fn: async (ctx, next) => {
      try {
        ctx.params = await validate(ctx.request.params, fields);
        return next();
      } catch (e) {
        ctx.throw(e instanceof ValidatorError ? 400 : 500, e as Error);
      }
    },
    openapi: {
      onMethod(methodItem) {
        methodItem.parameters ||= [];
        Object.entries(fields).forEach(([name, validator]) => {
          const validatorDocument = Validator.toDocument(validator);
          methodItem.parameters!.push({
            name,
            in: 'path',
            ...validatorDocument,
            // path必填参数
            required: validatorDocument.required === true,
          });
        });
      },
    },
  });
};

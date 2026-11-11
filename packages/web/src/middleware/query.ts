import {
  middleware,
  validate,
  Validator,
  ValidateDeniedError,
  ValidatorSchema,
  toDocument,
} from '@aomex/common';
import type { WebMiddleware } from '../override';

/**
 * 验证请求查询字符串
 */
export const query = <T extends { [key: string]: Validator } | ValidatorSchema<any>>(
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
        Object.entries(
          (fields instanceof ValidatorSchema ? fields['rules'] : fields) as {
            [key: string]: Validator;
          },
        ).forEach(([name, validator]) => {
          methodItem.parameters!.push({
            name,
            in: 'query',
            ...toDocument(validator),
          });
        });
      },
    },
  });
};

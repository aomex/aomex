import {
  validate,
  Validator,
  rule,
  ValidateDeniedError,
  middleware,
  OpenAPI,
} from '@aomex/common';
import type { WebMiddleware } from '../override';

/**
 * 验证请求实体
 */
export const body = <T extends { [key: string]: P }, P extends Validator>(
  fields: T,
): WebMiddleware<{ readonly body: Validator.Infer<T> }> => {
  return middleware.web({
    fn: async (ctx, next) => {
      try {
        ctx.body = await validate(ctx.request.body, fields);
        return next();
      } catch (e) {
        ctx.throw(e instanceof ValidateDeniedError ? 400 : 500, e as Error);
      }
    },
    openapi: {
      onMethod(methodItem) {
        const schema = Validator.toDocument(rule.object(fields))
          .schema as OpenAPI.SchemaObject;
        const contentType = JSON.stringify(schema).includes('"format":"binary"')
          ? 'multipart/form-data'
          : 'application/json';

        methodItem.requestBody = {
          content: {
            [contentType]: { schema },
          },
          required: Object.values(fields).some(
            (validator) => Validator.toDocument(validator).required,
          ),
        };
      },
    },
  });
};

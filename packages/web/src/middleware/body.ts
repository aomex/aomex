import {
  validate,
  Validator,
  ValidateDeniedError,
  middleware,
  type OpenAPI,
  toDocument,
  toValidator,
  type ValidatorToken,
} from '@aomex/common';
import { FileValidator, type WebMiddleware } from '../override';

/**
 * 验证请求实体
 */
export const body = <T extends ValidatorToken>(
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
        const docs = toDocument(fields);
        const schema = docs.schema as OpenAPI.SchemaObject;
        const contentType = Validator.has(toValidator(fields), FileValidator)
          ? 'multipart/form-data'
          : 'application/json';

        methodItem.requestBody = {
          content: {
            [contentType]: { schema },
          },
          required:
            schema.type === 'object' ? !!schema.required?.length : !!docs.required,
        };
      },
    },
  });
};

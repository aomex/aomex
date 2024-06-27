import { validate, Validator, rule, ValidatorError, middleware } from '@aomex/core';
import type { WebMiddleware } from '../override';

/**
 * 验证请求实体
 *
 * ```typescript
 * // ctx.request.body = { id: '100', name: 'aomex' };
 * chain.web
 *   .mount(body({
 *     id: rule.int().max(1000),
 *     name: rule.string(),
 *     age: rule.int().default(10)
 *   }))
 *   .mount(middleware.web((ctx, next) => {
 *     console.log(ctx.body); // { id: 100, name: 'aomex', age: 10 }
 *   }));
 * ```
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
        ctx.throw(e instanceof ValidatorError ? 400 : 500, e as Error);
      }
    },
    openapi: {
      onMethod(methodItem) {
        methodItem.requestBody = {
          content: {
            '*/*': {
              schema: Validator.toDocument(rule.object(fields)).schema,
            },
          },
          required: Object.values(fields).some(
            (validator) => Validator.toDocument(validator).required,
          ),
        };
      },
    },
  });
};

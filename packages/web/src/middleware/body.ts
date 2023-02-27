import { validate, Validator, rule, ValidatorError } from '@aomex/core';
import { WebMiddleware, WebMiddlewareToDocument } from '../override';

export class WebBodyMiddleware<
  Props extends { [key: string]: Validator },
> extends WebMiddleware<{
  readonly body: { [K in keyof Props]: Validator.Infer<Props[K]> };
}> {
  constructor(protected readonly props: Props) {
    super(async (ctx, next) => {
      try {
        ctx.body = await validate(ctx.request.body, props, {
          throwIfError: true,
        });
        return next();
      } catch (e) {
        ctx.throw(e instanceof ValidatorError ? 400 : 500, e as Error);
      }
    });
  }

  public override toDocument(options: WebMiddlewareToDocument): void {
    if (!options.methodItem) return;

    options.methodItem.requestBody = {
      content: {
        '*/*': {
          schema: Validator.toDocument(rule.object(this.props)).schema,
        },
      },
      required: Object.values(this.props).some(
        (validator) => Validator.toDocument(validator).required,
      ),
    };
  }
}

/**
 * Validate web request body
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
) => new WebBodyMiddleware<T>(fields);

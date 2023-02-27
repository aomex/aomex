import { validate, Validator, ValidatorError } from '@aomex/core';
import { WebMiddleware, WebMiddlewareToDocument } from '../override';

export class WebQueryMiddleware<
  Props extends { [key: string]: Validator },
> extends WebMiddleware<{
  readonly query: { [K in keyof Props]: Validator.Infer<Props[K]> };
}> {
  constructor(protected readonly props: Props) {
    super(async (ctx, next) => {
      try {
        ctx.query = await validate(ctx.request.query, props, {
          throwIfError: true,
        });
        return next();
      } catch (e) {
        ctx.throw(e instanceof ValidatorError ? 400 : 500, e as Error);
      }
    });
  }

  public override toDocument(options: WebMiddlewareToDocument): void {
    const methodItem = options.methodItem;
    if (!methodItem) return;
    methodItem.parameters ||= [];
    Object.entries(this.props).forEach(([name, validator]) => {
      methodItem.parameters!.push({
        name,
        in: 'query',
        ...Validator.toDocument(validator),
      });
    });
  }
}

/**
 * Validate web request querystring
 *
 * ```typescript
 * // ctx.request.query = { id: '100', name: 'aomex' };
 * chain.web
 *   .mount(query({
 *     id: rule.int().max(1000),
 *     name: rule.string(),
 *   }))
 *   .mount(middleware.web((ctx, next) => {
 *     console.log(ctx.query); // { id: 100 }
 *   }));
 * ```
 */
export const query = <T extends { [key: string]: P }, P extends Validator>(
  fields: T,
) => new WebQueryMiddleware<T>(fields);

import { validate, Validator, ValidatorError } from '@aomex/core';
import { WebMiddleware, WebMiddlewareToDocument } from '../override';

export class WebParamMiddleware<
  Props extends { [key: string]: Validator },
> extends WebMiddleware<{
  readonly params: { [K in keyof Props]: Validator.Infer<Props[K]> };
}> {
  constructor(protected readonly props: Props) {
    super(async (ctx, next) => {
      try {
        ctx.params = await validate(ctx.request.params, props, {
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
        in: 'path',
        ...Validator.toDocument(validator),
      });
    });
  }
}

/**
 * Validate web request path params
 *
 * ```typescript
 * // ctx.request.params = { id: '100', name: 'aomex' };
 * chain.web
 *   .mount(params({
 *     id: rule.int().max(1000),
 *   }))
 *   .mount(middleware.web((ctx, next) => {
 *     console.log(ctx.params); // { id: 100 }
 *   }));
 * ```
 */
export const params = <T extends { [key: string]: P }, P extends Validator>(
  fields: T,
) => new WebParamMiddleware<T>(fields);

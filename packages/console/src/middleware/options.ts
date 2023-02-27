import type { Options as YargsOptions } from 'yargs';
import parse from 'yargs-parser';
import { validate, Validator, OpenAPI } from '@aomex/core';
import { ConsoleMiddleware, YargsInstance } from '../override';

export class ConsoleOptionMiddleware<
  Props extends { [key: string]: Validator },
> extends ConsoleMiddleware<{
  readonly options: { [K in keyof Props]: Validator.Infer<Props[K]> };
}> {
  constructor(
    protected readonly props: Props,
    protected readonly alias?: { [key: string]: string | string[] },
  ) {
    super(async (ctx, next) => {
      let options = ctx.request.options;

      if (alias && Object.keys(alias).length) {
        const { _, ...rawOptions } = parse(ctx.request.argv, {
          alias,
        });
        options = rawOptions;
      }

      ctx.options = await validate(options, props, { throwIfError: true });
      return next();
    });
  }

  public override toHelp(yargs: YargsInstance): void {
    const aliases = this.alias || {};

    for (const [key, validator] of Object.entries(this.props)) {
      const docs = Validator.toDocument(validator);
      const schema = docs.schema as OpenAPI.SchemaObject | undefined;
      const defaultValue = schema?.default;
      let dateType: YargsOptions['type'];

      switch (schema?.type) {
        case 'array':
          dateType = 'array';
          break;
        case 'integer':
        case 'number':
          dateType = 'number';
          break;
        case 'boolean':
          dateType = 'boolean';
          break;
        case 'string':
        /**
         * Object can be only parsed from string on console.
         * @see ObjectValidator.parseFromString()
         */
        case 'object':
          dateType = 'string';
          break;
      }

      yargs.option(key, {
        alias: aliases[key],
        description: schema?.description,
        default: defaultValue,
        deprecated: docs.deprecated,
        type: dateType,
      });
    }
  }
}

/**
 * Validate command-line options, and make type safe.
 *
 * ```typescript
 * export const commander = new Commander();
 *
 * commander.create('my/schedule', {
 *   slots: [
 *     options({
 *       id: rule.int(),
 *       date: rule.datetime('YYYY-MM-DD'),
 *     }, {
 *       date: ['d'], // alias --date or -d
 *     });
 *   ],
 *   action: async (ctx) => {
 *     console.log(ctx.options);
 *   }
 * });
 * ```
 *
 */
export const options = <
  T extends { [key: string]: P },
  P extends Validator,
  Alias extends keyof T,
>(
  fields: T,
  alias?: { [key in Alias]: string | string[] },
) => new ConsoleOptionMiddleware<T>(fields, alias);

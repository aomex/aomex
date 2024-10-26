import { validate, Validator, OpenAPI, middleware } from '@aomex/common';
import { ConsoleMiddleware, type ConsoleDocument } from '../override';
import { toArray } from '@aomex/internal-tools';

/**
 * 接收并验证命令行的选项，并且保证类型安全
 *
 * ```typescript
 * export const commander = new Commander();
 *
 * commander.create('my/schedule', {
 *   mount: [
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
  aliasList?: { [key in Alias]: string | string[] },
): ConsoleMiddleware<{
  readonly options: Validator.Infer<T>;
}> => {
  return middleware.console({
    fn: async (ctx, next) => {
      let options = ctx.input.options;
      if (aliasList && Object.keys(aliasList).length) {
        options = ctx.input.parseArgv(aliasList);
      }
      ctx.options = await validate(options, fields);
      return next();
    },
    help: {
      onCommandItem(commandItem) {
        for (const [key, validator] of Object.entries(fields)) {
          const docs = Validator.toDocument(validator);
          const schema = docs.schema as OpenAPI.SchemaObject | undefined;
          let dateType: ConsoleDocument.ParameterItem['type'];

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
             * 命令行无法输入对象
             * @see ObjectValidator.parseFromString()
             */
            case 'object':
              dateType = 'string';
              break;
          }

          const alias = aliasList?.[key as Alias];
          commandItem.parameters ||= [];
          commandItem.parameters.push({
            name: key,
            alias: alias && toArray(alias),
            type: dateType,
            description: docs.description,
            defaultValue: schema?.default,
            deprecated: docs.deprecated,
          });
        }
      },
    },
  });
};

import EventEmitter from 'node:events';
import { chain, middleware } from '@aomex/core';
import ora, { type Ora } from 'ora';
import { openapiToHelp } from './openapi-to-help';
import {
  generateOpenapi,
  type OpenapiValidateResultItem,
  type OpenapiOptions,
  type OpenapiValidateResult,
} from './generate-openapi';

export const openapi = (
  options: Omit<OpenapiOptions, 'emitter'> & {
    renderWarnings?: boolean;
    commandName?: string;
    showInHelp?: boolean;
    summary?: string;
    description?: string;
  },
) => {
  const commandName = options.commandName || 'openapi';

  return chain.console
    .mount(
      openapiToHelp(
        commandName,
        options.summary,
        options.description,
        options.showInHelp,
      ),
    )
    .mount(
      middleware.console(async (ctx, next) => {
        if (ctx.request.command !== commandName) return next();

        const emitter = new EventEmitter();
        const spinner: Ora = ora();

        emitter
          .on('msg', (msg) => {
            if (spinner.isSpinning) spinner.succeed();
            spinner.start(msg);
          })
          .on('replace', (msg) => {
            spinner.text = msg;
          })
          .on('end', (status: string) => {
            if (
              status === 'succeed' ||
              status === 'fail' ||
              status === 'warn'
            ) {
              spinner[status]();
            }
          });

        let result: OpenapiValidateResult;
        try {
          result = (await generateOpenapi({ ...options, emitter })).result;
        } catch (e) {
          spinner.fail();
          throw e;
        }

        if (result.errors.length) {
          spinner.indent = 2;
          result.errors.forEach((item) => {
            spinner.fail(formatValidateMessage(item));
          });
        }

        if (options.renderWarnings && result.warnings.length) {
          spinner.indent = 2;
          result.warnings.forEach((item) => {
            spinner.warn(formatValidateMessage(item));
          });
        }
      }),
    );
};

const formatValidateMessage = (item: OpenapiValidateResultItem) => {
  let pathname = item.path.length ? item.path.join('.') : '';
  pathname =
    pathname && !item.message.includes(`"${pathname}"`) ? `[${pathname}] ` : '';
  return `${pathname}${item.message}`;
};

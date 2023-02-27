import { type Compose, compose, middleware, chain } from '@aomex/core';
import type { ConsoleChain } from '@aomex/console';
import {
  fileToModules,
  pathToFiles,
  type PathToFileOptions,
} from '@aomex/file-parser';
import { Commander } from './commander';
import { commanderToHelp } from './commander-to-help';

export interface CommandsOptions {
  path: PathToFileOptions;
}

export const commanders = (
  options: string | CommandsOptions | Commander[],
): ConsoleChain => {
  let composeFn: Compose | null = null;
  let promise: Promise<void> | null = null;

  if (Array.isArray(options)) {
    composeFn = compose(options.map(Commander.toMiddleware));
  } else {
    options = typeof options === 'string' ? { path: options } : options;
    promise = (async () => {
      const files = await pathToFiles(options.path);
      const commanders = await fileToModules<Commander>(
        files,
        (item) => !!item && item instanceof Commander,
      );
      composeFn = compose(commanders.map(Commander.toMiddleware));
    })();
  }

  const instance = middleware.console(async (ctx, next) => {
    if (!composeFn) await promise;
    return composeFn!(ctx, next);
  });

  return chain.console
    .mount(
      commanderToHelp(
        Array.isArray(options)
          ? { commanders: options }
          : { paths: options.path },
      ),
    )
    .mount(instance);
};

import { type ComposeFn, compose, middleware } from '@aomex/core';
import {
  pathToFiles,
  type GlobPathOptions,
  getFileValues,
} from '@aomex/internal-file-import';
import { Commander } from './commander';
import { type ConsoleMiddleware } from '@aomex/console';

export const commanders = (options: GlobPathOptions | Commander[]): ConsoleMiddleware => {
  let composeFn: ComposeFn;
  let commanders: Commander[];
  let promise: Promise<void> = Promise.resolve();

  if (isCommanders(options)) {
    commanders = options;
  } else {
    promise = pathToFiles(options).then(async (files) => {
      commanders = await getFileValues<Commander>(
        files,
        (item) => !!item && item instanceof Commander,
      );
    });
  }

  return middleware.console({
    fn: async (ctx, next) => {
      if (!commanders) await promise;
      composeFn ||= compose(
        commanders.map((commander) => commander['toMiddleware'](ctx.app)),
      );
      return composeFn(ctx, next);
    },
    help: {
      async onDocument(_, { app, children }) {
        await promise;
        await children(commanders.map((commander) => commander['toMiddleware'](app)));
      },
      async postDocument(_, { app, children }) {
        await children(commanders.map((commander) => commander['toMiddleware'](app)));
      },
    },
  });
};

const isCommanders = (options: GlobPathOptions | Commander[]): options is Commander[] => {
  return Array.isArray(options) && options.some((item) => item instanceof Commander);
};

import { type ComposeFn, compose, middleware } from '@aomex/common';
import {
  pathToFiles,
  type GlobPathOptions,
  getFileValues,
} from '@aomex/internal-file-import';
import { Commander } from './commander';
import type { ConsoleMiddleware } from '../override';

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
      composeFn ||= compose(commanders.map((commander) => commander['toMiddleware']()));
      return composeFn(ctx, next);
    },
    help: {
      async onDocument(_, { children }) {
        await promise;
        await children(commanders.map((commander) => commander['toMiddleware']()));
      },
      async postDocument(_, { children }) {
        await children(commanders.map((commander) => commander['toMiddleware']()));
      },
    },
  });
};

const isCommanders = (options: GlobPathOptions | Commander[]): options is Commander[] => {
  return Array.isArray(options) && options.some((item) => item instanceof Commander);
};

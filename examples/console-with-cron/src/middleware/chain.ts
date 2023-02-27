import { chain } from '@aomex/core';
import { cron } from '@aomex/cron';
import { cache } from './cache';

export const appChain = chain.console.mount(
  cron({
    paths: './src/commanders',
  }),
);

export const routerChain = appChain.mount(cache);

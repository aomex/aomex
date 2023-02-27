import { chain } from '@aomex/core';
import { cache } from './cache';

export const appChain = chain.console;

export const routerChain = appChain.mount(cache);

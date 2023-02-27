import { compress } from '@aomex/compress';
import { chain } from '@aomex/core';
import { logger } from '@aomex/logger';

export const appChain = chain.web.mount(logger()).mount(compress());
export const routerChain = appChain;

import { Router } from '@aomex/web-router';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { routerChain } from '../middleware/chain';

export const router = new Router({
  mount: routerChain,
});

router.get('/uncompressed', {
  action: (ctx) => {
    ctx.needCompress = false;
    ctx.response.contentType = 'text';
    ctx.send(createReadStream(path.resolve('../../LICENSE')));
  },
});

router.get('/too-small', {
  action: (ctx) => {
    ctx.send('abc');
  },
});

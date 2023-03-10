import { compress } from '@aomex/compress';
import { Router } from '@aomex/router';
import { createReadStream } from 'node:fs';
import path from 'node:path';
import { routerChain } from '../middleware/chain';

export const router = new Router({
  mount: routerChain,
});

router.get('/compressed', {
  action: (ctx) => {
    const stream = createReadStream(path.resolve('../../LICENSE'));
    stream.push('\n\n--- content-encoding=gzip ---\n\n');
    ctx.response.contentType = 'text';
    ctx.send(stream);
  },
});

router.get('/too-small-but-force-compress', {
  mount: [
    compress({
      threshold: 1,
    }),
  ],
  action: (ctx) => {
    ctx.needCompress = true;
    ctx.send('abc');
  },
});

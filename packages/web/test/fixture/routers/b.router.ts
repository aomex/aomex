import { Router } from '../../../src';

export const router = new Router();

router.get('/test2', {
  action: (ctx) => {
    ctx.send('bar');
  },
});

import { Router } from '../../../src';

export const router = new Router();

router.get('/test1', {
  action: (ctx) => {
    ctx.send('foo');
  },
});

export const str = 'str';
export const num = 1;
export const obj = {};

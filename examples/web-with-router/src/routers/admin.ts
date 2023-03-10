import { rule } from '@aomex/core';
import { params } from '@aomex/web';
import { Router } from '@aomex/router';

export const router = new Router({
  prefix: '/admins',
});

router.get('/', {
  action(ctx) {
    ctx.send(200, admins);
  },
});

router.get('/:id', {
  mount: [
    params({
      id: rule.int(),
    }),
  ],
  action(ctx) {
    const admin = admins.find((item) => item.id === ctx.params.id);
    if (admin) {
      ctx.send(admin);
    } else {
      ctx.throw(404, 'admin not exists');
    }
  },
});

const admins = [
  {
    id: 1,
    scopes: ['read', 'edit', 'delete'],
    name: 'aomex',
  },
  {
    id: 2,
    scopes: ['read', 'edit'],
    name: 'kobe',
  },
];

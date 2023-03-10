import { rule } from '@aomex/core';
import { body, params } from '@aomex/web';
import { Router } from '@aomex/router';

export const router = new Router({
  methodNotAllowed: true,
});

router.get('/users', {
  action: (ctx) => {
    ctx.send(users);
  },
});

router.get('/users/:id', {
  mount: [
    params({
      id: rule.number(),
    }),
  ],
  action: (ctx) => {
    const user = users.find((item) => item.id === ctx.params.id);
    if (!user) {
      ctx.send(404, {
        code: 'non-exists',
        message: 'user not exists',
      });
    } else {
      ctx.send(user);
    }
  },
});

router.post('/users', {
  mount: [
    body({
      name: rule.string(),
    }),
  ],
  action: (ctx) => {
    users.push({ id: users.length + 1, name: ctx.body.name });
    ctx.send(201);
  },
});

const users = [
  {
    id: 1,
    name: 'aomex',
  },
  {
    id: 2,
    name: 'node.js',
  },
];

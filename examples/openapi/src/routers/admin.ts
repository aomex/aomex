import { chain, rule } from '@aomex/core';
import { params } from '@aomex/web';
import { jwt } from '@aomex/jwt';
import { Router } from '@aomex/router';

export const router = new Router({
  prefix: '/admins',
  mount: chain.web.mount(jwt({ secret: '123456' })),
});

router.delete('/:id', {
  docs: {
    description: 'Here is the description',
    externalDocs: {
      url: 'http://example.com',
    },
  },
  mount: [
    params({
      id: rule
        .int()
        .docs({
          example: 1234567,
          deprecated: true,
          description: 'Yes, this is a id and is required for request',
        })
        .default(321),
    }),
  ],
  action() {},
});

router.delete('/other/:id', {
  docs: {
    deprecated: true,
    description: 'Use /admins/:id instead',
  },
  mount: [
    params({
      id: rule.int(),
    }),
  ],
  action() {},
});

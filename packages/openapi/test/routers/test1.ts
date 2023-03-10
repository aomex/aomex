import { rule } from '@aomex/core';
import { query, body, params } from '@aomex/web';
import { Router } from '@aomex/router';

export const router = new Router();

router.get('/abc', {
  mount: [
    query({
      q1: rule.string(),
      q2: rule.array(rule.number().min(100)),
    }),
  ],
  action() {},
});

router.post('/abc', {
  mount: [
    body({
      name: rule.string().optional(),
    }),
  ],
  action() {},
});

router.put('/abc/:id', {
  mount: [
    params({
      id: rule.number(),
    }),
  ],
  action() {},
});

// Testing operationId
router.all('/abcde/:id', {
  mount: [
    params({
      id: rule.number(),
    }),
  ],
  action() {},
});

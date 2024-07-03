import { rule } from '@aomex/core';
import { Router } from '@aomex/router';
import { body, params, query, response } from '@aomex/web';

export const router = new Router();

router.get('/foo', {
  mount: [
    query({
      page: rule.int().min(1).default(1),
      size: rule.int().min(5).default(10).docs({
        description: 'This is page size',
      }),
    }),
    body({
      test: rule.string().optional().docs({ deprecated: true }),
    }),
    response({
      statusCode: 200,
      content: {
        page: rule.int(),
        result: rule.array(
          rule.object({
            id: rule.int(),
            name: rule.string(),
          }),
        ),
        total: rule.int(),
      },
    }),
  ],
  action: async () => {},
});

router.post('/bar/:id', {
  mount: [
    params({
      id: rule.int(),
    }),
    query({
      page: rule.int().min(1).default(1),
      size: rule.int().min(5).default(10).docs({
        description: 'This is page size',
      }),
    }),
  ],
  action: async () => {},
});

router.get('/baz', {
  docs: {
    showInOpenapi: false,
  },
  action: () => {},
});

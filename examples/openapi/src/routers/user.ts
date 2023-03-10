import { Router } from '@aomex/router';
import { query, response } from '@aomex/web';
import { rule } from '@aomex/core';

export const router = new Router({
  prefix: '/users',
});

router.get('/', {
  mount: [
    query({
      name: rule.string().docs({
        description: 'User Name',
      }),
      token: rule.string().optional().docs({
        deprecated: true,
        description: '**Warning:** Put token in headers',
      }),
    }),
    response({
      statusCode: 200,
      contentType: 'json',
      schema: {
        data: rule.string().docs({
          description: 'I am response data',
        }),
      },
    }),
    response({
      statusCode: 404,
      contentType: 'text',
      description: 'User not found',
      schema: rule.string(),
      example: 'ccc',
    }),
  ],
  async action(ctx) {
    console.log(ctx.request.ip);
    ctx.send({
      data: 'abc',
    });
  },
});

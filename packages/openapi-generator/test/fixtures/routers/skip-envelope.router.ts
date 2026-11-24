import { rule } from '@aomex/common';
import { response, Router } from '@aomex/web';

export const router = new Router();

router.get('/raw', {
  mount: [
    response({
      statusCode: 200,
      content: { id: rule.number() },
      skipEnvelope: true,
    }),
  ],
  action: async () => {},
});

router.get('/mixed', {
  mount: [
    response({
      statusCode: 200,
      content: { id: rule.number() },
      skipEnvelope: true,
    }),
    response({
      statusCode: 400,
      content: { message: rule.string() },
    }),
  ],
  action: async () => {},
});

router.get('/keep-error', {
  mount: [
    response({
      statusCode: 200,
      content: { id: rule.number() },
    }),
    response({
      statusCode: 400,
      content: { message: rule.string() },
      skipEnvelope: true,
    }),
  ],
  action: async () => {},
});

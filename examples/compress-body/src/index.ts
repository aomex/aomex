import { WebApp } from '@aomex/web';
import { routers } from '@aomex/router';
import { appChain } from './middleware/chain';

const app = new WebApp();

app.mount(appChain);
app.mount(routers('./src/routers'));

app.on('error', (_, ctx) => {
  const response = ctx.response;
  response.body = {
    status: response.statusCode,
    message: response.body,
  };
});

app.listen(3000, () => {
  console.log('Server started');
});

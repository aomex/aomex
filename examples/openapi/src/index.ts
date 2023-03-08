import { ConsoleApp } from '@aomex/console';
import { openapi } from '@aomex/openapi';

const app = new ConsoleApp();
app.mount(
  openapi({
    routers: './src/routers',
    renderWarnings: true,
    prettyJson: true,
  }),
);

await app.run();

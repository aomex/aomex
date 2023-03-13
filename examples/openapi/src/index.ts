import { ConsoleApp } from '@aomex/console';
import { openapi } from '@aomex/openapi';

const app = new ConsoleApp();
app.mount(
  openapi({
    commandName: 'openapi',
    routers: './src/routers',
    renderWarnings: true,
    prettyJson: true,
    output: './public/openapi.json',
    docs: {
      servers: [
        {
          url: 'http://www.example.com',
        },
      ],
      externalDocs: {
        url: 'http://www.example.com',
      },
      components: {
        securitySchemes: {
          jwt: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  }),
);

await app.run();

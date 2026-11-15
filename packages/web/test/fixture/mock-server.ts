import { createServer } from 'http';
import supertest from 'supertest';
import { WebContext, WebRequest, WebResponse } from '../../src';
import type { WebMiddleware } from '../../src/override';
import { TestWebApp } from '../../src/testing';
import type Test from 'supertest/lib/test';
import { compose, type MixinMiddleware } from '@aomex/common';
import { parseBody } from '../../src/middleware/parse-body';

export const mockServer = async (
  agent: (agent: ReturnType<typeof supertest>) => Test,
  appOptions?: TestWebApp.Option<[]>,
  middlewares: (WebMiddleware | MixinMiddleware)[] = [],
) => {
  return new Promise<{
    req: WebRequest;
    res: WebResponse;
    ctx: WebContext;
    app: TestWebApp;
  }>((resolve) => {
    const server = createServer(
      {
        IncomingMessage: WebRequest,
        // @ts-ignore
        ServerResponse: WebResponse,
      },
      (req: WebRequest, res: WebResponse) => {
        const app = new TestWebApp(appOptions);
        const ctx = new WebContext(app, req, res);
        compose([parseBody(), ...middlewares])(ctx).then(() => {
          resolve({ req, res, ctx, app });
        });
      },
    );

    agent(supertest(server)).then(() => {
      server.close();
    });
  });
};

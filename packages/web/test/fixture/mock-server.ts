import { createServer } from 'http';
import supertest from 'supertest';
import { WebApp, WebContext, WebRequest, WebResponse } from '../../src';
import type Test from 'supertest/lib/test';
import { compose } from '@aomex/common';
import { parseBody } from '../../src/middleware/parse-body';

export const mockServer = async (
  agent: (agent: ReturnType<typeof supertest>) => Test,
) => {
  return new Promise<{
    req: WebRequest;
    res: WebResponse;
    ctx: WebContext;
    app: WebApp;
  }>((resolve) => {
    const server = createServer(
      {
        IncomingMessage: WebRequest,
        // @ts-ignore
        ServerResponse: WebResponse,
      },
      (req: WebRequest, res: WebResponse) => {
        const app = new WebApp();
        const ctx = new WebContext(app, req, res);
        compose([parseBody()])(ctx).then(() => {
          resolve({ req, res, ctx, app });
        });
      },
    );

    agent(supertest(server)).then(() => {
      server.close();
    });
  });
};

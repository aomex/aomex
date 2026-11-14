import { createServer } from 'http';
import supertest from 'supertest';
import { WebContext, WebRequest, WebResponse } from '../../src';
import { TestWebApp } from '../../src/testing';
import type Test from 'supertest/lib/test';
import { compose } from '@aomex/common';
import { parseBody } from '../../src/middleware/parse-body';

export const mockServer = async (
  agent: (agent: ReturnType<typeof supertest>) => Test,
  appOptions?: TestWebApp.Option<[]>,
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

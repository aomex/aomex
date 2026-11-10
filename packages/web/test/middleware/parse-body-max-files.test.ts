import { expect, test } from 'vitest';
import { createServer } from 'http';
import supertest from 'supertest';
import { compose } from '@aomex/common';
import { WebApp, WebContext, WebRequest, WebResponse } from '../../src';
import { parseBody } from '../../src/middleware/parse-body';

test('超过 maxFiles=30 时 parseBody 拒绝', { timeout: 10_000 }, async () => {
  await new Promise<void>((resolve, reject) => {
    const server = createServer(
      {
        IncomingMessage: WebRequest,
        // @ts-ignore
        ServerResponse: WebResponse,
      },
      (req: WebRequest, res: WebResponse) => {
        const app = new WebApp();
        const ctx = new WebContext(app, req, res);
        compose([parseBody()])(ctx).then(
          () => reject(new Error('expected parseBody to reject')),
          (err) => {
            expect(String(err)).toMatch(/maxFiles/i);
            res.statusCode = 413;
            res.end();
            server.close();
            resolve();
          },
        );
      },
    );

    let agent = supertest(server).post('/');
    for (let i = 0; i < 31; i++) {
      agent = agent.attach('files', Buffer.from(`f${i}`), `f${i}.txt`);
    }
    agent.end(() => {});
  });
});

test('空文件在 allowEmptyFiles=false 时被拒绝', { timeout: 10_000 }, async () => {
  await new Promise<void>((resolve, reject) => {
    const server = createServer(
      {
        IncomingMessage: WebRequest,
        // @ts-ignore
        ServerResponse: WebResponse,
      },
      (req: WebRequest, res: WebResponse) => {
        const app = new WebApp();
        const ctx = new WebContext(app, req, res);
        compose([parseBody()])(ctx).then(
          () => reject(new Error('expected parseBody to reject')),
          (err) => {
            expect(String(err)).toMatch(/allowEmptyFiles|empty|size/i);
            res.statusCode = 400;
            res.end();
            server.close();
            resolve();
          },
        );
      },
    );

    supertest(server)
      .post('/')
      .attach('file1', Buffer.alloc(0), 'empty.txt')
      .end(() => {});
  });
});

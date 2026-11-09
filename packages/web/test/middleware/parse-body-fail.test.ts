import { expect, test, vi } from 'vitest';
import { createServer } from 'http';
import supertest from 'supertest';
import { compose } from '@aomex/common';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { File } from 'formidable';
import { WebApp, WebContext, WebRequest, WebResponse } from '../../src';
import { parseBody } from '../../src/middleware/parse-body';

const dir = dirname(import.meta.dirname);

type FormidableFn = typeof import('formidable');

const { captured } = vi.hoisted(() => ({
  captured: [] as string[],
}));

vi.mock('formidable', async (importOriginal) => {
  const mod = await importOriginal<FormidableFn | { default: FormidableFn }>();
  const original = typeof mod === 'function' ? mod : mod.default;
  const create = Object.assign((opts?: Parameters<FormidableFn>[0]) => {
    const form = original({ ...opts, maxFiles: 1 });
    form.on('fileBegin', (_name: string, file: File) => {
      captured.push(file.filepath);
    });
    return form;
  }, original);
  return { default: create };
});

test('form.parse 拒绝后清理已落盘临时文件', async () => {
  captured.length = 0;

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
            expect(err).toBeTruthy();
            expect(captured.length).toBeGreaterThan(0);
            resolve();
          },
        );
      },
    );

    supertest(server)
      .post('/')
      .attach('files', join(dir, 'fixture/upload-1.txt'))
      .attach('files', join(dir, 'fixture/upload-2.txt'))
      .end(() => {
        server.close();
      });
  });

  for (const filepath of captured) {
    await expect.poll(() => existsSync(filepath)).toBeFalsy();
  }
});

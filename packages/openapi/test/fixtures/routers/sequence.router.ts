import { middleware } from '@aomex/core';
import { Router } from '@aomex/web';
import { appendFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

export const router = new Router();

export const sequenceFile = join(tmpdir(), 'openapi-generator-sequence.txt');

const createMD = () =>
  middleware.web({
    fn: () => {},
    openapi: {
      onDocument() {
        appendFileSync(sequenceFile, '1');
      },
      onPath() {
        appendFileSync(sequenceFile, '2');
      },
      onMethod() {
        appendFileSync(sequenceFile, '3');
      },
      postMethod() {
        appendFileSync(sequenceFile, '4');
      },
      postPath() {
        appendFileSync(sequenceFile, '5');
      },
      postDocument() {
        appendFileSync(sequenceFile, '6');
      },
    },
  });

router.post('/bar', {
  mount: [createMD(), createMD(), createMD()],
  action: () => {},
});

router.post('/baz', {
  mount: [createMD()],
  action: () => {},
});

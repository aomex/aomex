import { CacheFileAdapter } from '../../src/adapters/cache-file-adapter';

const filename = process.argv[2];
const op = process.argv[3];
const count = Number(process.argv[4] ?? '1');

if (!filename || !op || !Number.isInteger(count) || count < 1) {
  console.error('usage: multi-process-op.ts <filename> <incr|nx|lpush|getdel> <count>');
  process.exit(1);
}

const store = new CacheFileAdapter({ filename, timeout: 30_000 });
const results: unknown[] = [];

for (let i = 0; i < count; i++) {
  switch (op) {
    case 'incr':
      results.push(await store.increaseValue('counter'));
      break;
    case 'nx':
      results.push(await store.setNotExistValue('nx-key', `v-${process.pid}-${i}`));
      break;
    case 'lpush':
      results.push(await store.leftPushValue('list', `${process.pid}:${i}`));
      break;
    case 'getdel':
      results.push(await store.getAndDeleteValue('once'));
      break;
    default:
      console.error(`unknown op: ${op}`);
      process.exit(1);
  }
}

await store.disconnect();
process.stdout.write(JSON.stringify(results));

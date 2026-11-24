import { expectType } from 'ts-expect';
import { MemoryHub, type MemoryHubOptions, type WebsocketStats } from '../../src';

{
  const opts = { fanoutBatchSize: 512 } satisfies MemoryHubOptions;
  new MemoryHub(opts);
  new MemoryHub();
  expectType<number | undefined>(opts.fanoutBatchSize);

  // @ts-expect-error fanoutBatchSize 须为 number
  const bad: MemoryHubOptions = { fanoutBatchSize: '8' };
  void bad;

  expectType<WebsocketStats>(new MemoryHub().stats());
  expectType<Promise<void>>(new MemoryHub().ensureReady());
  expectType<Promise<void>>(new MemoryHub().broadcast('r', 'e', null));
  expectType<Promise<void>>(new MemoryHub().broadcastAll('e', null));
}

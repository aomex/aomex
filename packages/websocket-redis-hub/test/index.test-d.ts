import { expectType } from 'ts-expect';
import type { WebsocketStats } from '@aomex/websocket';
import { RedisHub, type RedisHubOptions, type RedisOptions } from '../src';

{
  const opts = {
    host: '127.0.0.1',
    port: 6379,
    channel: 'aomex:websocket:hub',
    fanoutBatchSize: 512,
  } satisfies RedisHubOptions;
  new RedisHub(opts);
  new RedisHub();

  expectType<string | undefined>(opts.channel);
  expectType<number | undefined>(opts.fanoutBatchSize);
  expectType<RedisOptions['host']>(opts.host);

  // @ts-expect-error channel 必须是 string
  const badChannel: RedisHubOptions = { channel: 1 };
  void badChannel;

  // @ts-expect-error fanoutBatchSize 须为 number
  const badBatch: RedisHubOptions = { fanoutBatchSize: '8' };
  void badBatch;

  expectType<WebsocketStats>(new RedisHub().stats());
  expectType<Promise<void>>(new RedisHub().ensureReady());
}

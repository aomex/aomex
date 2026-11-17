import { expectType } from 'ts-expect';
import type { Address, Worker } from 'node:cluster';
import { clusterListen, type ClusterListenOptions } from '../src';

// 合法：workers 数字 / max，listen 工厂
{
  clusterListen({
    workers: 2,
    listen: () => 'ok',
  });
  clusterListen({
    workers: 'max',
    listen: () => {},
  });
  expectType<void>(
    clusterListen({
      workers: 1,
      listen: () => {},
    }),
  );
}

// 合法：可选钩子、respawn、respawnDelay、maxRespawns、shutdownTimeout
{
  const options: ClusterListenOptions = {
    workers: 1,
    listen: () => {},
    respawn: false,
    respawnDelay: 500,
    maxRespawns: 10,
    shutdownTimeout: 5_000,
    onListening: (worker, address) => {
      expectType<Worker>(worker);
      expectType<Address>(address);
    },
    onExit: (worker, code, signal) => {
      expectType<Worker>(worker);
      expectType<number | null>(code);
      expectType<string | null>(signal);
    },
  };
  clusterListen(options);
  clusterListen({
    workers: 1,
    listen: () => {},
    maxRespawns: Number.POSITIVE_INFINITY,
  });
}

// listen 返回值任意（Server / void / 其它）
{
  clusterListen({
    workers: 1,
    listen: () => undefined,
  });
  clusterListen({
    workers: 1,
    listen: () => ({ listen: () => {} }),
  });
}

// 缺必填
{
  // @ts-expect-error 缺 workers
  clusterListen({ listen: () => {} });
  // @ts-expect-error 缺 listen
  clusterListen({ workers: 1 });
  // @ts-expect-error 空对象
  clusterListen({});
}

// 非法 workers
{
  clusterListen({
    // @ts-expect-error
    workers: 'auto',
    listen: () => {},
  });
  clusterListen({
    // @ts-expect-error
    workers: true,
    listen: () => {},
  });
}

// 非法 listen / 钩子
{
  clusterListen({
    workers: 1,
    // @ts-expect-error
    listen: 'app.listen()',
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    respawn: 1,
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    respawnDelay: '1s',
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    maxRespawns: '20',
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    shutdownTimeout: '5s',
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    onListening: true,
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    onExit: true,
  });
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error 参数类型不匹配
    onExit: (worker: string) => {
      void worker;
    },
  });
}

// 多余键
{
  clusterListen({
    workers: 1,
    listen: () => {},
    // @ts-expect-error
    foo: 1,
  });
}

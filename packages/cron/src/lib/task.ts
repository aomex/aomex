import { sleep } from '@aomex/internal-tools';
import type { Cron } from './cron';
import { ChildProcess, spawn } from 'node:child_process';
import {
  ENV_CRON,
  ENV_CRON_EXECUTION_TIME,
  ENV_CRON_NEXT_SCHEDULE_TIME,
  ENV_CRON_SCHEDULE_TIME,
  TELL_CHILD_REJECT,
  TELL_CHILD_RESOLVE,
  TELL_CHILD_STOP,
  TELL_PARENT_ENDED,
  TELL_PARENT_INIT,
} from './constant';
import { randomBytes } from 'node:crypto';

export class Task {
  child: ChildProcess | null = null;
  readonly concurrentKey: string;
  protected readonly filePath: string;
  protected readonly execArgv: string[];
  /**
   * 并发锁定时间。非正常退出时要等20分钟才释放，正常情况下任务执行完就会立即释放。
   * 之所以要设置这么长，是为了防止服务器卡顿时，容易造成任务双跑问题
   */
  protected readonly concurrentExpireDuration: number = 1200_000;

  constructor(
    readonly cron: Cron,
    readonly currentTimestamp: number,
    readonly nextTimestamp: number,
  ) {
    this.concurrentKey = `aomex-cron|v:${cron.argv}|t:${cron.time}|s:1|c:${cron.concurrent}`;
    this.filePath = process.argv[1]!;
    this.execArgv = [...process.execArgv];
    if (!this.execArgv.includes('--enable-source-maps')) {
      this.execArgv.unshift('--enable-source-maps');
    }
  }

  get pid(): string | undefined {
    return this.child?.pid?.toString();
  }

  async consume() {
    const result = await this.win();
    if (result === 'lose') return;
    const pong = this.ping(result.slot, result.token);
    try {
      await this.runChildProcess();
    } finally {
      await pong();
    }
  }

  async runChildProcess() {
    if (this.child) return;
    const { argv } = this.cron;
    const { promise, resolve } = Promise.withResolvers();
    const childProcess = spawn(
      process.argv0,
      [...this.execArgv, this.filePath, ...argv],
      {
        cwd: process.cwd(),
        env: {
          /**
           * 支持颜色输出。默认值是 `0` 代表不输出颜色。
           * @link https://nodejs.org/api/tty.html#writestreamgetcolordepthenv
           */
          FORCE_COLOR: '3',
          ...process.env,
          [ENV_CRON]: '1',
          [ENV_CRON_SCHEDULE_TIME]: new Date(this.currentTimestamp).toISOString(),
          [ENV_CRON_EXECUTION_TIME]: new Date().toISOString(),
          [ENV_CRON_NEXT_SCHEDULE_TIME]: new Date(this.nextTimestamp).toISOString(),
        },
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
      },
    );
    this.child = childProcess;

    childProcess.on('close', resolve);
    childProcess.on('exit', resolve);
    childProcess.on('error', resolve);

    let timer: NodeJS.Timeout | null = null;
    childProcess.on('message', (message: string) => {
      if (message === TELL_PARENT_INIT) {
        childProcess.send(this.cron.stopping ? TELL_CHILD_REJECT : TELL_CHILD_RESOLVE);
      }
      if (message === TELL_PARENT_ENDED) {
        // 30秒内还没有收到子进程关闭的消息，说明变成僵尸进程了，需要强制关闭。
        timer = setTimeout(() => {
          try {
            childProcess.kill();
          } finally {
            resolve(undefined);
            timer = null;
          }
        }, 30_000);
      }
    });

    await promise.finally(() => {
      this.child = null;
      if (timer) {
        clearTimeout(timer);
      }
    });
  }

  getWaitingTimeout() {
    return this.cron.getWaitingTimeout(this.nextTimestamp - this.currentTimestamp);
  }

  async win(): Promise<{ slot: string; token: string } | 'lose'> {
    const { cache } = this.cron;
    const waitingTimeout = this.getWaitingTimeout();
    const startTime = Date.now();
    const token = `${process.pid}:${Date.now()}:${randomBytes(16).toString('hex')}`;
    const maxConcurrent = Math.min(this.cron.concurrent, 65535);

    while (true) {
      for (let i = 0; i < maxConcurrent; ++i) {
        if (this.cron.stopping) return 'lose';
        const slot = `${this.concurrentKey}|slot:${i}`;
        const win = await cache.setNX(slot, token, this.concurrentExpireDuration);
        if (win) return { slot, token };
        await sleep(5);
      }

      if (waitingTimeout <= 0) return 'lose';
      if (startTime + waitingTimeout <= Date.now()) return 'lose';
      await sleep(500);
      continue;
    }
  }

  ping(slot: string, token: string) {
    const cache = this.cron.cache;
    let isStopped = false;

    const refresh = async () => {
      let shouldContinue = true;
      if (isStopped) return;

      try {
        const remoteToken = await cache.get<string>(slot);
        if (remoteToken === token) {
          await cache.expire(slot, this.concurrentExpireDuration);
          return;
        }

        if (isStopped) return;

        // 任务被释放了，但是下一次任务还没获得执行权，需要重新竞争，尽量不要中断任务
        if (remoteToken === null) {
          const win = await cache.setNX(slot, token, this.concurrentExpireDuration);
          if (win) return;
        }

        // 任务被抢了，开始清理当前进程，防止双跑
        try {
          this.child?.send(TELL_CHILD_STOP);
        } catch {
          // Error: Channel closed / ERR_IPC_CHANNEL_CLOSED
        }
        await sleep(5_000);
        this.child?.kill();
        shouldContinue = false;
      } finally {
        if (shouldContinue && !isStopped) {
          timer = setTimeout(refresh, 10_000);
        }
      }
    };

    let timer = setTimeout(refresh, 10_000);

    // 任务如果太快完成，会导致同一批拥有waitingTimeout的竞争者在排队期间获得执行权，导致任务重复执行。
    // 因此必须在排队期间结束后，才能结束任务。
    const mustAfterWaitingTimeout = new Promise((resolve) => {
      sleep(this.getWaitingTimeout() + 1_000).then(resolve);
    });

    return async () => {
      isStopped = true;
      clearTimeout(timer);
      await mustAfterWaitingTimeout;

      const remoteToken = await cache.get<string>(slot);
      // 只释放属于自己的slot
      if (remoteToken === token) {
        await cache.delete(slot);
      }
    };
  }
}

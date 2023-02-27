import type { ConsoleApp } from '@aomex/console';
import { fileURLToPath } from 'node:url';
import { isMainThread, Worker } from 'node:worker_threads';
import cronParser from 'cron-parser';
import type { CronOptions } from './cron';
import { sleep } from '@aomex/helper';

export interface CronJobOptions {
  time: string;
  seconds: number[];
  args: string[];
  command: string;
}

export class CronJob {
  public queue: number = 0;

  constructor(
    protected readonly app: ConsoleApp,
    protected readonly schedule: CronJobOptions,
    protected readonly mode: CronOptions['mode'] = 'overlap',
  ) {}

  async start(): Promise<void> {
    if (this.mode === 'sequence') this.sequenceLoop();

    const {
      schedule: { seconds },
    } = this;
    const cronExp = this.getCronExp();

    while (true) {
      const nextTime = cronExp.next();
      await sleep(nextTime.getTime() - Date.now());
      if (seconds.length) {
        const nowSecond = nextTime.getSeconds();
        seconds.forEach(async (expectedSecond) => {
          const delay = expectedSecond - nowSecond;
          if (delay >= 0) {
            await sleep(delay * 1000);
            this.executeOrQueue();
          }
        });
      } else {
        this.executeOrQueue();
      }
    }
  }

  getCronExp() {
    const {
      schedule: { seconds, time },
    } = this;
    const now = new Date();
    if (seconds.length) {
      now.setMinutes(now.getMinutes() - 1);
    }
    return cronParser.parseExpression(time, {
      currentDate: now,
    });
  }

  executeOrQueue() {
    if (this.mode === 'sequence') {
      ++this.queue;
    } else {
      this.execute();
    }
  }

  async execute() {
    if (isMainThread) {
      await this.createWorker();
    } else {
      try {
        await this.app.run(this.schedule.command, ...this.schedule.args);
      } catch {}
    }
  }

  createWorker(): Promise<void> {
    const worker = new Worker(fileURLToPath(import.meta.url), {
      stdout: true,
    });
    return new Promise((resolve) => {
      worker.on('exit', () => {
        resolve(void 0);
      });
    });
  }

  sequenceLoop = () => {
    if (this.queue > 0) {
      --this.queue;
      this.execute().finally(this.sequenceLoop);
    } else {
      setTimeout(this.sequenceLoop, 300);
    }
  };
}

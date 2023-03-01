import type { ConsoleApp } from '@aomex/console';
import cronParser from 'cron-parser';
import { sleep } from '@aomex/utility';
import type { CronOptions } from '../middleware/cron';
import type { Schedule } from './schedule';

export class Job {
  public queue: number = 0;

  constructor(
    protected readonly app: ConsoleApp,
    protected readonly schedule: Schedule,
    protected readonly mode: CronOptions['mode'] = 'overlap',
  ) {}

  async start(): Promise<void> {
    if (this.mode === 'sequence') this.sequenceLoop();

    const {
      schedule: { seconds },
    } = this;
    const cronExp = this.getCronExp();

    while (true) {
      await sleep(cronExp.next().getTime() - Date.now());
      if (seconds.length) {
        const nowSecond = new Date().getSeconds();
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
    try {
      await this.app.run(this.schedule.command, ...this.schedule.args);
    } catch {}
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

import type { ConsoleApp } from '@aomex/console';
import cronParser from 'cron-parser';
import { sleep } from '@aomex/utility';
import type { CronOptions } from '../middleware/cron';

export class Job {
  public queue: number = 0;
  protected executing: boolean = false;

  constructor(
    protected readonly app: ConsoleApp,
    protected readonly time: string,
    protected readonly seconds: number[],
    protected readonly argv: string[],
    protected readonly mode?: CronOptions['mode'],
  ) {}

  async start(): Promise<void> {
    const handle = this.getCronHandle();

    while (true) {
      await sleep(handle.next().getTime() - Date.now());
      if (this.seconds.length) {
        const nowSecond = new Date().getSeconds();
        this.seconds.forEach(async (nextSecond) => {
          const delay = nextSecond - nowSecond;
          if (delay >= 0) {
            await sleep(delay * 1000);
            this.emit();
          }
        });
      } else {
        this.emit();
      }
    }
  }

  getCronHandle() {
    const now = new Date();
    if (this.seconds.length) {
      now.setMinutes(now.getMinutes() - 1);
    }
    return cronParser.parseExpression(this.time, {
      currentDate: now,
    });
  }

  emit() {
    if (this.mode === 'one-by-one') {
      ++this.queue;
      this.executeWithoutOverlapping();
    } else {
      this.execute();
    }
  }

  execute() {
    return this.app.run(...this.argv).catch(() => {});
  }

  executeWithoutOverlapping() {
    if (this.executing || this.queue === 0) return;
    --this.queue;
    this.executing = true;
    this.execute().finally(() => {
      this.executing = false;
      this.executeWithoutOverlapping();
    });
  }
}

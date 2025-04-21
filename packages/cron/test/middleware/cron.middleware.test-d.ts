import { cron } from '../../src';
import { Commander } from '@aomex/console';
import { expectType } from 'ts-expect';

const commander = new Commander();

commander.create('schedule', {
  mount: [cron('')],
  action: async (ctx) => {
    expectType<Date>(ctx.cron.scheduleTime);
    expectType<Date>(ctx.cron.executionTime);
    expectType<Date>(ctx.cron.nextScheduleTime);
  },
});

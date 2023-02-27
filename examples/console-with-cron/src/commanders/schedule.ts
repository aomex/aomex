import { Commander } from '@aomex/console-router';
import { schedule } from '@aomex/cron';
import { routerChain } from '../middleware/chain';

export const commander = new Commander({
  mount: routerChain,
});

commander.create('schedule:get', {
  mount: [
    schedule({
      second: '*',
    }),
  ],
  action: async (ctx) => {
    const counter = await ctx.cache.getOrSet('counter', () => 1);
    console.log(counter);
  },
});

commander.create('schedule:set', {
  mount: [
    schedule({
      second: '*/2',
    }),
  ],
  action: async (ctx) => {
    const counter = (await ctx.cache.get<number>('counter')) ?? 0;
    await ctx.cache.set('counter', counter + 1);
    console.log('updated', await ctx.cache.get('counter'));
  },
});

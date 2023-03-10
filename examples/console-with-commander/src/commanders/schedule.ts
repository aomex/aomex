import { Commander } from '../../../../packages/commander/src';
import { routerChain } from '../middleware/chain';

export const commander = new Commander({
  mount: routerChain,
});

commander.create('schedule:get', {
  action: async (ctx) => {
    const counter = await ctx.cache.getOrSet('counter', () => 1);
    console.log(counter);
  },
});

commander.create('schedule:set', {
  action: async (ctx) => {
    const counter = (await ctx.cache.get<number>('counter')) ?? 0;
    await ctx.cache.set('counter', counter + 1);
    console.log(await ctx.cache.get<number>('counter'));
  },
});

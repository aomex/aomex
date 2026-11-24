import { Channel } from '../../../src';

export const channel = new Channel();

channel.on('fixture.ping', {
  action: async (ctx) => {
    ctx.client.send('fixture.pong', ctx.rawPayload);
  },
});

import { rule } from '@aomex/common';
import { Channel, emit, payload } from '@aomex/websocket';

export const channel = new Channel();

channel.on('chat.send', {
  mount: [
    payload({
      text: rule.string(),
      roomId: rule.string(),
    }),
    emit({
      event: 'chat.message',
      description: '房间内聊天消息',
      data: {
        from: rule.string(),
        text: rule.string(),
      },
    }),
    emit({ event: 'chat.ack', description: '发送确认' }),
  ],
  action: async () => {},
});

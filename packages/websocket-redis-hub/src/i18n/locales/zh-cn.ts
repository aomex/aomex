import { I18n } from '@aomex/common';

export const zh = I18n.define({
  hub_closed: 'RedisHub 已关闭，无法广播',
  resync_failed: 'Redis 订阅恢复失败',
  sync_room_failed: '房间订阅对齐失败：{{room}}',
  bus_fanout_failed: '总线扇出失败',
  destroy_ready_failed: '关闭时等待 Hub 初始化失败',
});

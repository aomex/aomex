import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** 繁體中文（香港） */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub 已關閉，無法廣播',
  resync_failed: 'Redis 訂閱恢復失敗',
  sync_room_failed: '房間訂閱對齊失敗：{{room}}',
  bus_fanout_failed: '總線扇出失敗',
  destroy_ready_failed: '關閉時等待 Hub 初始化失敗',
});

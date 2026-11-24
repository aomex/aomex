import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ja-JP */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub は閉じられているため、ブロードキャストできません',
  resync_failed: 'Redis 購読の復元に失敗しました',
  sync_room_failed: 'ルーム購読の整合に失敗しました：{{room}}',
  bus_fanout_failed: 'バスのファンアウトに失敗しました',
  destroy_ready_failed: '終了時に Hub の初期化待ちが失敗しました',
});

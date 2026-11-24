import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ms-MY */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub telah ditutup, tidak dapat menyiarkan',
  resync_failed: 'Gagal memulihkan langganan Redis',
  sync_room_failed: 'Gagal menjajarkan langganan bilik: {{room}}',
  bus_fanout_failed: 'Fanout bas gagal',
  destroy_ready_failed: 'Gagal menunggu permulaan Hub semasa penutupan',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** id-ID */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub sudah ditutup, tidak dapat menyiarkan',
  resync_failed: 'Gagal memulihkan langganan Redis',
  sync_room_failed: 'Gagal menyelaraskan langganan ruang: {{room}}',
  bus_fanout_failed: 'Fanout bus gagal',
  destroy_ready_failed: 'Gagal menunggu inisialisasi Hub saat penutupan',
});

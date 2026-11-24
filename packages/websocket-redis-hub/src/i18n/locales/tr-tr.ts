import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tr-TR */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub kapalı, yayın yapılamıyor',
  resync_failed: 'Redis abonelikleri geri yüklenemedi',
  sync_room_failed: 'Oda aboneliği hizalanamadı: {{room}}',
  bus_fanout_failed: 'Veri yolu fanout’u başarısız oldu',
  destroy_ready_failed: 'Kapanışta Hub başlatması beklenemedi',
});

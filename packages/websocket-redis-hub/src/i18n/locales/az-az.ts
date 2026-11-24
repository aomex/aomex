import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub bağlanıb, yayım etmək olmur',
  resync_failed: 'Redis abunəlikləri bərpa olunmadı',
  sync_room_failed: 'Otaq abunəliyi uyğunlaşdırılmadı: {{room}}',
  bus_fanout_failed: 'Şin fanout-u alınmadı',
  destroy_ready_failed: 'Bağlanışda Hub-un işə salınması gözlənilmədi',
});

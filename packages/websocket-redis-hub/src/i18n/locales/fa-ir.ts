import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub بسته شده است، پخش ممکن نیست',
  resync_failed: 'بازیابی اشتراک‌های Redis ناموفق بود',
  sync_room_failed: 'هم‌راستاسازی اشتراک اتاق ناموفق بود: {{room}}',
  bus_fanout_failed: 'پخش گذرگاه ناموفق بود',
  destroy_ready_failed: 'انتظار برای راه‌اندازی Hub هنگام خاموشی ناموفق بود',
});

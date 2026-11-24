import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub مغلق، يتعذر البث',
  resync_failed: 'فشل استعادة اشتراكات Redis',
  sync_room_failed: 'فشل محاذاة اشتراك الغرفة: {{room}}',
  bus_fanout_failed: 'فشل توزيع الناقل',
  destroy_ready_failed: 'فشل انتظار تهيئة Hub أثناء الإغلاق',
});

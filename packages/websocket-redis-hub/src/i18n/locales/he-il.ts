import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub סגור, לא ניתן לשדר',
  resync_failed: 'שחזור מנויי Redis נכשל',
  sync_room_failed: 'יישור מנוי החדר נכשל: {{room}}',
  bus_fanout_failed: 'פיזור אפיק נכשל',
  destroy_ready_failed: 'ההמתנה לאתחול Hub בזמן הכיבוי נכשלה',
});

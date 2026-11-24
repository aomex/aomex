import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub بند ہے، نشر نہیں کیا جا سکتا',
  resync_failed: 'Redis سبسکرپشنز بحال نہیں ہو سکیں',
  sync_room_failed: 'کمرے کی سبسکرپشن سیدھ نہیں ہو سکی: {{room}}',
  bus_fanout_failed: 'بس فین آؤٹ ناکام ہوا',
  destroy_ready_failed: 'بند کرتے وقت Hub کے آغاز کا انتظار ناکام ہوا',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'غیر درست ایونٹ کا نام',
  invalid_room_name: 'غیر درست کمرے کا نام',
  unknown_event: 'نامعلوم ایونٹ: {{event}}',
  handler_error: 'ایونٹ کی کارروائی ناکام ہو گئی',
  duplicate_event: 'ایونٹ پہلے سے رجسٹرڈ ہے: {{event}}',
  already_attached: 'WebsocketApp پہلے ہی attach ہے، دوبارہ مت لگائیں',
  transport_init_failed: 'WebSocket ٹرانسپورٹ شروع نہیں ہو سکی',
  handshake_failed: 'WebSocket ہینڈشیک ناکام ہوئی',
  accept_failed: 'کنکشن قبول نہیں ہو سکا',
  fanout_deliver_failed: 'پھیلاؤ کے دوران {{failed}} کنکشنز پر لکھنا ناکام رہا',
  inbound_task_failed: 'آنے والے ایونٹ کی کارروائی ناکام ہوئی',
  error_frame_failed: 'خرابی کا فریم بھیجا نہیں جا سکا',
  remove_client_failed: 'کنکشن ہٹایا نہیں جا سکا',
  close_connection_failed: 'کنکشن بند نہیں ہو سکا',
  metric_handler_failed: 'میٹرک کال بیک ناکام ہوئی',
});

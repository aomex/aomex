import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'نام رویداد نامعتبر',
  invalid_room_name: 'نام اتاق نامعتبر',
  unknown_event: 'رویداد ناشناخته: {{event}}',
  handler_error: 'پردازش رویداد ناموفق بود',
  duplicate_event: 'رویداد قبلاً ثبت شده است: {{event}}',
  already_attached: 'WebsocketApp قبلاً attach شده، دوباره متصل نکنید',
  transport_init_failed: 'راه‌اندازی انتقال WebSocket ناموفق بود',
  handshake_failed: 'دست‌دادن WebSocket ناموفق بود',
  accept_failed: 'پذیرش اتصال ناموفق بود',
  fanout_deliver_failed: 'نوشتن روی {{failed}} اتصال هنگام پخش ناموفق بود',
  inbound_task_failed: 'پردازش رویداد ورودی ناموفق بود',
  error_frame_failed: 'ارسال قاب خطا ناموفق بود',
  remove_client_failed: 'حذف اتصال ناموفق بود',
  close_connection_failed: 'بستن اتصال ناموفق بود',
  metric_handler_failed: 'بازخوانی معیارها ناموفق بود',
});

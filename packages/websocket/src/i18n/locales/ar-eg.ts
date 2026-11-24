import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'اسم الحدث غير صالح',
  invalid_room_name: 'اسم الغرفة غير صالح',
  unknown_event: 'حدث غير معروف: {{event}}',
  handler_error: 'فشلت معالجة الحدث',
  duplicate_event: 'الحدث مسجّل بالفعل: {{event}}',
  already_attached: 'WebsocketApp مُرفق بالفعل، لا تُكرّر التركيب',
  transport_init_failed: 'فشل تهيئة نقل WebSocket',
  handshake_failed: 'فشل مصافحة WebSocket',
  accept_failed: 'فشل قبول الاتصال',
  fanout_deliver_failed: 'فشلت الكتابة إلى {{failed}} من الاتصالات أثناء التوزيع',
  inbound_task_failed: 'فشلت معالجة الحدث الوارد',
  error_frame_failed: 'فشل إرسال إطار الخطأ',
  remove_client_failed: 'فشل إزالة الاتصال',
  close_connection_failed: 'فشل إغلاق الاتصال',
  metric_handler_failed: 'فشل رد نداء المقاييس',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  empty_brokers: 'لا يمكن أن تكون brokers فارغة',
  empty_broker: 'brokers تحتوي على عنوان فارغ',
  empty_client_id: 'لا يمكن أن يكون clientId فارغًا',
  empty_group_id: 'لا يمكن أن يكون groupId فارغًا',
  empty_topic: 'لا يمكن أن يكون اسم الموضوع فارغًا',
  invalid_topic_name: 'اسم موضوع غير صالح: {{topic}}',
  topic_name_too_long: 'اسم الموضوع طويل جدًا: {{length}} > {{max}}',
  duplicate_topic: 'تم تسجيل الموضوع أكثر من مرة: {{topic}}',
  mixed_group_id: 'استدعاء الاستهلاك الواحد يقبل groupId واحدًا فقط',
  empty_consumers: 'لم يتم العثور على مستهلكي Kafka',
  already_consuming: 'هناك مستهلك قيد التشغيل بالفعل',
  closed: 'تم إغلاق اتصال Kafka',
  message_too_large: 'حجم الرسالة يتجاوز الحد: {{bytes}} > {{max}}',
  invalid_json: 'الرسالة ليست JSON صالحًا',
  empty_message: 'نص الرسالة فارغ',
  encode_failed: 'تعذر ترميز الرسالة كـ JSON',
  unknown_topic: 'تم استلام موضوع غير مشترك: {{topic}}',
  invalid_offset: 'إزاحة رسالة غير صالحة: {{offset}}',
  idempotent_requires_all_acks:
    'عند تفعيل المنتج عديم الأثر يجب أن تكون acks مساوية لـ -1',
  unsupported_sasl: 'آلية SASL غير مدعومة: {{mechanism}}',
  unsupported_tls: 'تعذر تمرير إعداد TLS إلى العميل: {{name}}',
  heartbeat_exceeds_session: 'يجب أن تكون فترة نبض القلب أقل من مهلة الجلسة',
});

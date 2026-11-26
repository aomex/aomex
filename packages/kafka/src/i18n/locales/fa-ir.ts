import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers نمی‌تواند خالی باشد',
  empty_broker: 'brokers شامل آدرس خالی است',
  empty_client_id: 'clientId نمی‌تواند خالی باشد',
  empty_group_id: 'groupId نمی‌تواند خالی باشد',
  empty_topic: 'نام موضوع نمی‌تواند خالی باشد',
  invalid_topic_name: 'نام موضوع نامعتبر: {{topic}}',
  topic_name_too_long: 'نام موضوع بیش از حد طولانی است: {{length}} > {{max}}',
  duplicate_topic: 'موضوع بیش از یک بار ثبت شده است: {{topic}}',
  mixed_group_id: 'هر فراخوانی مصرف فقط می‌تواند یک groupId داشته باشد',
  empty_consumers: 'هیچ مصرف‌کننده Kafka یافت نشد',
  already_consuming: 'یک مصرف‌کننده در حال اجراست',
  closed: 'اتصال Kafka بسته شده است',
  message_too_large: 'اندازه پیام از حد مجاز بیشتر است: {{bytes}} > {{max}}',
  invalid_json: 'پیام JSON معتبر نیست',
  empty_message: 'بدنه پیام خالی است',
  encode_failed: 'پیام را نمی‌توان به JSON کدگذاری کرد',
  unknown_topic: 'موضوع مشترک‌نشده دریافت شد: {{topic}}',
  invalid_offset: 'افست پیام نامعتبر: {{offset}}',
  idempotent_requires_all_acks: 'وقتی تولیدکنندهٔ بی‌اثر فعال است، acks باید -1 باشد',
  unsupported_sasl: 'مکانیزم SASL پشتیبانی‌نشده: {{mechanism}}',
  unsupported_tls: 'پیکربندی TLS را نمی‌توان به کلاینت داد: {{name}}',
  heartbeat_exceeds_session: 'فاصله ضربان قلب باید کمتر از مهلت نشست باشد',
});

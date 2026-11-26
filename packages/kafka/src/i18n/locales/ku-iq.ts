import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ku-IQ */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers نابێت بەتاڵ بێت',
  empty_broker: 'brokers ناونیشانی بەتاڵی تێدایە',
  empty_client_id: 'clientId نابێت بەتاڵ بێت',
  empty_group_id: 'groupId نابێت بەتاڵ بێت',
  empty_topic: 'ناوی بابەت نابێت بەتاڵ بێت',
  invalid_topic_name: 'ناوی بابەتی نادروست: {{topic}}',
  topic_name_too_long: 'ناوی بابەت زۆر درێژە: {{length}} > {{max}}',
  duplicate_topic: 'بابەت زیاتر لە جارێک تۆمار کراوە: {{topic}}',
  mixed_group_id: 'لە یەک بانگکردنی consume تەنها یەک groupId ڕێگەپێدراوە',
  empty_consumers: 'هیچ بەکارهێنەری Kafka نەدۆزرایەوە',
  already_consuming: 'بەکارهێنەرێک پێشتر کار دەکات',
  closed: 'پەیوەندی Kafka داخراوە',
  message_too_large: 'قەبارەی نامە لە سنوور تێپەڕیوە: {{bytes}} > {{max}}',
  invalid_json: 'نامە JSON ی دروست نییە',
  empty_message: 'ناوەڕۆکی نامە بەتاڵە',
  encode_failed: 'نەتوانرا نامە وەک JSON کۆد بکرێت',
  unknown_topic: 'بابەتی نائەندام وەرگیرا: {{topic}}',
  invalid_offset: 'ئۆفسێتی نامەی نادروست: {{offset}}',
  idempotent_requires_all_acks: 'کاتێک بەرهەمهێنەری idempotent چالاکە، acks دەبێت -1 بێت',
  unsupported_sasl: 'میکانیزمی SASL ی پشتگیرینەکراو: {{mechanism}}',
  unsupported_tls: 'هەڵبژاردەی TLS ناتوانرێت بدرێت بە کڕیار: {{name}}',
  heartbeat_exceeds_session: 'ماوەی لێدانی دڵ دەبێت کەمتر بێت لە کاتی دانیشتن',
});

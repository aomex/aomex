import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** km-KH */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers មិនអាចទទេបានទេ',
  empty_broker: 'brokers មានអាសយដ្ឋានទទេ',
  empty_client_id: 'clientId មិនអាចទទេបានទេ',
  empty_group_id: 'groupId មិនអាចទទេបានទេ',
  empty_topic: 'ឈ្មោះប្រធានបទមិនអាចទទេបានទេ',
  invalid_topic_name: 'ឈ្មោះប្រធានបទមិនត្រឹមត្រូវ៖ {{topic}}',
  topic_name_too_long: 'ឈ្មោះប្រធានបទវែងពេក៖ {{length}} > {{max}}',
  duplicate_topic: 'ប្រធានបទត្រូវបានចុះឈ្មោះច្រើនដង៖ {{topic}}',
  mixed_group_id: 'ការហៅ consume មួយអាចមានតែ groupId តែមួយ',
  empty_consumers: 'រកមិនឃើញអ្នកប្រើប្រាស់ Kafka',
  already_consuming: 'អ្នកប្រើប្រាស់កំពុងដំណើរការរួចហើយ',
  closed: 'ការតភ្ជាប់ Kafka ត្រូវបានបិទ',
  message_too_large: 'ទំហំសារលើសដែនកំណត់៖ {{bytes}} > {{max}}',
  invalid_json: 'សារមិនមែនជា JSON ត្រឹមត្រូវ',
  empty_message: 'តួសារទទេ',
  encode_failed: 'មិនអាចអ៊ិនកូដសារជា JSON បានទេ',
  unknown_topic: 'បានទទួលប្រធានបទដែលមិនបានជាវ៖ {{topic}}',
  invalid_offset: 'អុហ្វសិតសារមិនត្រឹមត្រូវ៖ {{offset}}',
  idempotent_requires_all_acks: 'នៅពេលបើក producer ដែល idempotent, acks ត្រូវតែជា -1',
  unsupported_sasl: 'យន្តការ SASL មិនគាំទ្រ៖ {{mechanism}}',
  unsupported_tls: 'មិនអាចបញ្ជូនជម្រើស TLS ទៅកាន់អតិថិជន៖ {{name}}',
  heartbeat_exceeds_session: 'ចន្លោះពេល heartbeat ត្រូវតែតូចជាងពេលអស់សម័យ',
});

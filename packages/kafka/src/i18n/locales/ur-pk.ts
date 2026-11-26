import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ur-PK */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers خالی نہیں ہو سکتا',
  empty_broker: 'brokers میں خالی پتہ ہے',
  empty_client_id: 'clientId خالی نہیں ہو سکتا',
  empty_group_id: 'groupId خالی نہیں ہو سکتا',
  empty_topic: 'موضوع کا نام خالی نہیں ہو سکتا',
  invalid_topic_name: 'موضوع کا نام غلط ہے: {{topic}}',
  topic_name_too_long: 'موضوع کا نام بہت لمبا ہے: {{length}} > {{max}}',
  duplicate_topic: 'موضوع ایک سے زیادہ بار رجسٹر ہوا: {{topic}}',
  mixed_group_id: 'ایک consume کال میں صرف ایک groupId ہو سکتا ہے',
  empty_consumers: 'کوئی Kafka صارف نہیں ملا',
  already_consuming: 'ایک صارف پہلے سے چل رہا ہے',
  closed: 'Kafka کنکشن بند ہے',
  message_too_large: 'پیغام کا سائز حد سے زیادہ ہے: {{bytes}} > {{max}}',
  invalid_json: 'پیغام درست JSON نہیں ہے',
  empty_message: 'پیغام کا متن خالی ہے',
  encode_failed: 'پیغام کو JSON کے طور پر انکوڈ نہیں کیا جا سکا',
  unknown_topic: 'غیر سبسکرائب موضوع موصول ہوا: {{topic}}',
  invalid_offset: 'پیغام کا آفسیٹ غلط ہے: {{offset}}',
  idempotent_requires_all_acks: 'جب idempotent producer فعال ہو تو acks کو -1 ہونا چاہیے',
  unsupported_sasl: 'غیر معاون SASL طریقہ کار: {{mechanism}}',
  unsupported_tls: 'TLS اختیار کلائنٹ کو نہیں دیا جا سکتا: {{name}}',
  heartbeat_exceeds_session: 'دل کی دھڑکن کا وقفہ سیشن ٹائم آؤٹ سے کم ہونا چاہیے',
});

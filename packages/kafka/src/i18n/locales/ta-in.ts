import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ta-IN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers காலியாக இருக்கக் கூடாது',
  empty_broker: 'brokers-இல் காலி முகவரி உள்ளது',
  empty_client_id: 'clientId காலியாக இருக்கக் கூடாது',
  empty_group_id: 'groupId காலியாக இருக்கக் கூடாது',
  empty_topic: 'தலைப்பு பெயர் காலியாக இருக்கக் கூடாது',
  invalid_topic_name: 'தவறான தலைப்பு பெயர்: {{topic}}',
  topic_name_too_long: 'தலைப்பு பெயர் மிக நீளம்: {{length}} > {{max}}',
  duplicate_topic: 'தலைப்பு ஒன்றுக்கு மேற்பட்ட முறை பதிவுசெய்யப்பட்டுள்ளது: {{topic}}',
  mixed_group_id: 'ஒரு consume அழைப்பில் ஒரே ஒரு groupId மட்டுமே இருக்கலாம்',
  empty_consumers: 'Kafka நுகர்வோர் எவரும் கிடைக்கவில்லை',
  already_consuming: 'ஒரு நுகர்வோர் ஏற்கனவே இயங்குகிறது',
  closed: 'Kafka இணைப்பு மூடப்பட்டுள்ளது',
  message_too_large: 'செய்தி அளவு வரம்பை மீறுகிறது: {{bytes}} > {{max}}',
  invalid_json: 'செய்தி செல்லுபடியான JSON அல்ல',
  empty_message: 'செய்தி உடல் காலியாக உள்ளது',
  encode_failed: 'செய்தியை JSON ஆக குறியாக்கம் செய்ய முடியவில்லை',
  unknown_topic: 'சந்தா செய்யப்படாத தலைப்பு பெறப்பட்டது: {{topic}}',
  invalid_offset: 'தவறான செய்தி ஆஃப்செட்: {{offset}}',
  idempotent_requires_all_acks:
    'idempotent producer இயக்கப்பட்டிருக்கும் போது acks -1 ஆக இருக்க வேண்டும்',
  unsupported_sasl: 'ஆதரிக்கப்படாத SASL பொறிமுறை: {{mechanism}}',
  unsupported_tls: 'TLS விருப்பத்தை கிளையண்டிற்கு அனுப்ப முடியாது: {{name}}',
  heartbeat_exceeds_session:
    'இதயத் துடிப்பு இடைவெளி அமர்வு நேர எல்லையை விட சிறியதாக இருக்க வேண்டும்',
});

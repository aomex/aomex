import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hi-IN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers खाली नहीं हो सकता',
  empty_broker: 'brokers में खाली पता है',
  empty_client_id: 'clientId खाली नहीं हो सकता',
  empty_group_id: 'groupId खाली नहीं हो सकता',
  empty_topic: 'विषय नाम खाली नहीं हो सकता',
  invalid_topic_name: 'अमान्य विषय नाम: {{topic}}',
  topic_name_too_long: 'विषय नाम बहुत लंबा है: {{length}} > {{max}}',
  duplicate_topic: 'विषय एक से अधिक बार पंजीकृत है: {{topic}}',
  mixed_group_id: 'एक consume कॉल में केवल एक groupId हो सकता है',
  empty_consumers: 'कोई Kafka उपभोक्ता नहीं मिला',
  already_consuming: 'एक उपभोक्ता पहले से चल रहा है',
  closed: 'Kafka कनेक्शन बंद है',
  message_too_large: 'संदेश का आकार सीमा से अधिक है: {{bytes}} > {{max}}',
  invalid_json: 'संदेश वैध JSON नहीं है',
  empty_message: 'संदेश बॉडी खाली है',
  encode_failed: 'संदेश को JSON के रूप में एन्कोड नहीं किया जा सका',
  unknown_topic: 'अनसब्सक्राइब्ड विषय प्राप्त हुआ: {{topic}}',
  invalid_offset: 'अमान्य संदेश ऑफ़सेट: {{offset}}',
  idempotent_requires_all_acks: 'इडेम्पोटेंट प्रोड्यूसर चालू होने पर acks -1 होना चाहिए',
  unsupported_sasl: 'असमर्थित SASL तंत्र: {{mechanism}}',
  unsupported_tls: 'TLS विकल्प क्लाइंट को नहीं दिया जा सकता: {{name}}',
  heartbeat_exceeds_session: 'हार्टबीट अंतराल सत्र टाइमआउट से छोटा होना चाहिए',
});

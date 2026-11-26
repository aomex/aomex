import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ne-NP */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers खाली हुन सक्दैन',
  empty_broker: 'brokers मा खाली ठेगाना छ',
  empty_client_id: 'clientId खाली हुन सक्दैन',
  empty_group_id: 'groupId खाली हुन सक्दैन',
  empty_topic: 'विषय नाम खाली हुन सक्दैन',
  invalid_topic_name: 'अमान्य विषय नाम: {{topic}}',
  topic_name_too_long: 'विषय नाम धेरै लामो छ: {{length}} > {{max}}',
  duplicate_topic: 'विषय एक पटकभन्दा बढी दर्ता गरिएको छ: {{topic}}',
  mixed_group_id: 'एउटा consume कलमा एउटा मात्र groupId हुन सक्छ',
  empty_consumers: 'कुनै Kafka उपभोक्ता फेला परेन',
  already_consuming: 'उपभोक्ता पहिले नै चलिरहेको छ',
  closed: 'Kafka जडान बन्द छ',
  message_too_large: 'सन्देश आकार सीमा नाघ्यो: {{bytes}} > {{max}}',
  invalid_json: 'सन्देश मान्य JSON होइन',
  empty_message: 'सन्देश शरीर खाली छ',
  encode_failed: 'सन्देशलाई JSON को रूपमा इन्कोड गर्न सकिएन',
  unknown_topic: 'असबस्क्राइब विषय प्राप्त भयो: {{topic}}',
  invalid_offset: 'अमान्य सन्देश अफसेट: {{offset}}',
  idempotent_requires_all_acks: 'आइडेम्पोटेन्ट प्रोड्युसर अन हुँदा acks -1 हुनुपर्छ',
  unsupported_sasl: 'असमर्थित SASL संयन्त्र: {{mechanism}}',
  unsupported_tls: 'TLS विकल्प क्लाइन्टलाई दिन सकिँदैन: {{name}}',
  heartbeat_exceeds_session: 'हृदयस्पन्दन अन्तराल सत्र समयसीमाभन्दा सानो हुनुपर्छ',
});

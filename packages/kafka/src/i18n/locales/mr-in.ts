import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mr-IN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers रिकामे असू शकत नाही',
  empty_broker: 'brokers मध्ये रिकामा पत्ता आहे',
  empty_client_id: 'clientId रिकामे असू शकत नाही',
  empty_group_id: 'groupId रिकामे असू शकत नाही',
  empty_topic: 'विषयनाव रिकामे असू शकत नाही',
  invalid_topic_name: 'अवैध विषयनाव: {{topic}}',
  topic_name_too_long: 'विषयनाव खूप लांब आहे: {{length}} > {{max}}',
  duplicate_topic: 'विषय एकापेक्षा जास्त वेळा नोंदणीकृत आहे: {{topic}}',
  mixed_group_id: 'एका consume कॉलमध्ये फक्त एक groupId असू शकतो',
  empty_consumers: 'कोणतेही Kafka ग्राहक सापडले नाहीत',
  already_consuming: 'ग्राहक आधीच चालू आहे',
  closed: 'Kafka कनेक्शन बंद आहे',
  message_too_large: 'संदेशाचा आकार मर्यादेपेक्षा जास्त आहे: {{bytes}} > {{max}}',
  invalid_json: 'संदेश वैध JSON नाही',
  empty_message: 'संदेश बॉडी रिकामी आहे',
  encode_failed: 'संदेश JSON म्हणून एन्कोड करता आला नाही',
  unknown_topic: 'अनसबस्क्राइब्ड विषय मिळाला: {{topic}}',
  invalid_offset: 'अवैध संदेश ऑफसेट: {{offset}}',
  idempotent_requires_all_acks: 'आइडेम्पोटंट प्रोड्यूसर सुरू असताना acks -1 असणे आवश्यक आहे',
  unsupported_sasl: 'असमर्थित SASL यंत्रणा: {{mechanism}}',
  unsupported_tls: 'TLS पर्याय क्लायंटला देता येत नाही: {{name}}',
  heartbeat_exceeds_session: 'हृदयस्पंदन अंतर सत्र कालमर्यादेपेक्षा कमी असणे आवश्यक आहे',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  empty_brokers: 'Ní féidir le brokers a bheith folamh',
  empty_broker: 'Tá seoladh folamh i brokers',
  empty_client_id: 'Ní féidir le clientId a bheith folamh',
  empty_group_id: 'Ní féidir le groupId a bheith folamh',
  empty_topic: 'Ní féidir leis an ainm topaic a bheith folamh',
  invalid_topic_name: 'Ainm topaic neamhbhailí: {{topic}}',
  topic_name_too_long: 'Tá ainm na topaice rófhada: {{length}} > {{max}}',
  duplicate_topic: 'Tá an topaic cláraithe níos mó ná uair amháin: {{topic}}',
  mixed_group_id: 'Ní féidir ach groupId amháin a bheith i nglaonn consume amháin',
  empty_consumers: 'Níor aimsíodh aon tomhaltóir Kafka',
  already_consuming: 'Tá tomhaltóir ag rith cheana',
  closed: 'Tá an nasc Kafka dúnta',
  message_too_large: 'Sáraíonn méid na teachtaireachta an teorainn: {{bytes}} > {{max}}',
  invalid_json: 'Ní JSON bailí é an teachtaireacht',
  empty_message: 'Tá corp na teachtaireachta folamh',
  encode_failed: 'Níorbh fhéidir an teachtaireacht a ionchódú mar JSON',
  unknown_topic: 'Fuarthas topaic neamhshíntithe: {{topic}}',
  invalid_offset: 'Fritháireamh teachtaireachta neamhbhailí: {{offset}}',
  idempotent_requires_all_acks:
    'Nuair atá an táirgeoir idéimeach cumasaithe, caithfidh acks a bheith -1',
  unsupported_sasl: 'Meicníocht SASL nach dtacaítear léi: {{mechanism}}',
  unsupported_tls: 'Ní féidir an rogha TLS a thabhairt don chliant: {{name}}',
  heartbeat_exceeds_session:
    'Ní mór an eatramh croí a bheith níos lú ná teorainn ama an tseisiúin',
});

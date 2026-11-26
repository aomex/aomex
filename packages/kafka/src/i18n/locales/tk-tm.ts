import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers boş bolmaly däl',
  empty_broker: 'brokers boş salgyny öz içine alýar',
  empty_client_id: 'clientId boş bolmaly däl',
  empty_group_id: 'groupId boş bolmaly däl',
  empty_topic: 'Mowzuk ady boş bolmaly däl',
  invalid_topic_name: 'Nädogry mowzuk ady: {{topic}}',
  topic_name_too_long: 'Mowzuk ady gaty uzyn: {{length}} > {{max}}',
  duplicate_topic: 'Mowzuk birden köp gezek hasaba alyndy: {{topic}}',
  mixed_group_id: 'Bir consume çagyryşynda diňe bir groupId bolup biler',
  empty_consumers: 'Kafka sarp edijileri tapylmady',
  already_consuming: 'Sarp ediji eýýäm işleýär',
  closed: 'Kafka birikmesi ýapyk',
  message_too_large: 'Habar ölçegi çäkden geçýär: {{bytes}} > {{max}}',
  invalid_json: 'Habar dogry JSON däl',
  empty_message: 'Habar göwresi boş',
  encode_failed: 'Habary JSON hökmünde kodlap bolmady',
  unknown_topic: 'Abuna bolmadyk mowzuk alyndy: {{topic}}',
  invalid_offset: 'Nädogry habar ofseti: {{offset}}',
  idempotent_requires_all_acks: 'Idempotent producer açyk bolsa, acks -1 bolmaly',
  unsupported_sasl: 'Goldanylmaýan SASL mehanizmi: {{mechanism}}',
  unsupported_tls: 'TLS opsiýasyny müşderä geçirip bolmaýar: {{name}}',
  heartbeat_exceeds_session: 'Ýürek urşunyň aralygy sessiýa möhletinden kiçi bolmaly',
});

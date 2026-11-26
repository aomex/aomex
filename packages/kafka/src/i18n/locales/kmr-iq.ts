import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers nabe vala be',
  empty_broker: 'brokers navnîşanek vala dihewîne',
  empty_client_id: 'clientId nabe vala be',
  empty_group_id: 'groupId nabe vala be',
  empty_topic: 'Navê mijarê nabe vala be',
  invalid_topic_name: 'Navê mijarê nederbasdar: {{topic}}',
  topic_name_too_long: 'Navê mijarê pir dirêj e: {{length}} > {{max}}',
  duplicate_topic: 'Mijar ji carekê zêdetir hat qeydkirin: {{topic}}',
  mixed_group_id: 'Di yek bangê consume de tenê yek groupId dikare hebe',
  empty_consumers: 'Tu xerîdarên Kafka nehatin dîtin',
  already_consuming: 'Xerîdarek jixwe dixebite',
  closed: 'Girêdana Kafka girtî ye',
  message_too_large: 'Mezinahiya peyamê ji sînorê derbas dike: {{bytes}} > {{max}}',
  invalid_json: 'Peyam JSON-a derbasdar nîne',
  empty_message: 'Laşê peyamê vala ye',
  encode_failed: 'Peyam wek JSON nehat kodkirin',
  unknown_topic: 'Mijareke neabone hat wergirtin: {{topic}}',
  invalid_offset: 'Offseta peyamê nederbasdar: {{offset}}',
  idempotent_requires_all_acks: 'Dema producer-ê idempotent vekirî be, acks divê -1 be',
  unsupported_sasl: 'Mekanîzma SASL ya piştgirî nekirî: {{mechanism}}',
  unsupported_tls: 'Vebijarka TLS nayê dayîn klientê: {{name}}',
  heartbeat_exceeds_session: 'Navbera dilê divê ji dema rûniştinê biçûktir be',
});

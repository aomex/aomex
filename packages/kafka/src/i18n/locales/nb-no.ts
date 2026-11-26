import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers kan ikke være tom',
  empty_broker: 'brokers inneholder en tom adresse',
  empty_client_id: 'clientId kan ikke være tom',
  empty_group_id: 'groupId kan ikke være tom',
  empty_topic: 'Emnenavnet kan ikke være tomt',
  invalid_topic_name: 'Ugyldig emnenavn: {{topic}}',
  topic_name_too_long: 'Emnenavnet er for langt: {{length}} > {{max}}',
  duplicate_topic: 'Emnet er registrert mer enn én gang: {{topic}}',
  mixed_group_id: 'Ett consume-kall kan bare ha ett groupId',
  empty_consumers: 'Ingen Kafka-consumere funnet',
  already_consuming: 'En consumer kjører allerede',
  closed: 'Kafka-tilkoblingen er lukket',
  message_too_large: 'Meldingsstørrelsen overskrider grensen: {{bytes}} > {{max}}',
  invalid_json: 'Meldingen er ikke gyldig JSON',
  empty_message: 'Meldingsteksten er tom',
  encode_failed: 'Meldingen kunne ikke kodes som JSON',
  unknown_topic: 'Mottok et uabonnert emne: {{topic}}',
  invalid_offset: 'Ugyldig meldingsforskyvning: {{offset}}',
  idempotent_requires_all_acks: 'Når idempotent producer er aktivert, må acks være -1',
  unsupported_sasl: 'Ikke støttet SASL-mekanisme: {{mechanism}}',
  unsupported_tls: 'TLS-valget kan ikke sendes til klienten: {{name}}',
  heartbeat_exceeds_session: 'Hjerteintervall må være mindre enn sesjonstidsavbrudd',
});

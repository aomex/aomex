import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers får inte vara tomt',
  empty_broker: 'brokers innehåller en tom adress',
  empty_client_id: 'clientId får inte vara tomt',
  empty_group_id: 'groupId får inte vara tomt',
  empty_topic: 'Ämnesnamnet får inte vara tomt',
  invalid_topic_name: 'Ogiltigt ämnesnamn: {{topic}}',
  topic_name_too_long: 'Ämnesnamnet är för långt: {{length}} > {{max}}',
  duplicate_topic: 'Ämnet är registrerat mer än en gång: {{topic}}',
  mixed_group_id: 'Ett consume-anrop får bara ha ett groupId',
  empty_consumers: 'Inga Kafka-konsumenter hittades',
  already_consuming: 'En konsument körs redan',
  closed: 'Kafka-anslutningen är stängd',
  message_too_large: 'Meddelandestorleken överskrider gränsen: {{bytes}} > {{max}}',
  invalid_json: 'Meddelandet är inte giltig JSON',
  empty_message: 'Meddelandetexten är tom',
  encode_failed: 'Meddelandet kunde inte kodas som JSON',
  unknown_topic: 'Mottog ett oabonnerat ämne: {{topic}}',
  invalid_offset: 'Ogiltig meddelandeförskjutning: {{offset}}',
  idempotent_requires_all_acks: 'När idempotent producer är aktiverad måste acks vara -1',
  unsupported_sasl: 'SASL-mekanism som inte stöds: {{mechanism}}',
  unsupported_tls: 'TLS-alternativet kan inte skickas till klienten: {{name}}',
  heartbeat_exceeds_session: 'Hjärtintervall måste vara mindre än sessionens tidsgräns',
});

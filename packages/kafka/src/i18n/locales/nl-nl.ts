import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers mag niet leeg zijn',
  empty_broker: 'brokers bevat een leeg adres',
  empty_client_id: 'clientId mag niet leeg zijn',
  empty_group_id: 'groupId mag niet leeg zijn',
  empty_topic: 'Topicnaam mag niet leeg zijn',
  invalid_topic_name: 'Ongeldige topicnaam: {{topic}}',
  topic_name_too_long: 'Topicnaam is te lang: {{length}} > {{max}}',
  duplicate_topic: 'Topic is meer dan eens geregistreerd: {{topic}}',
  mixed_group_id: 'Een consume-aanroep mag slechts één groupId hebben',
  empty_consumers: 'Geen Kafka-consumers gevonden',
  already_consuming: 'Er draait al een consumer',
  closed: 'Kafka-verbinding is gesloten',
  message_too_large: 'Berichtgrootte overschrijdt de limiet: {{bytes}} > {{max}}',
  invalid_json: 'Bericht is geen geldige JSON',
  empty_message: 'Berichtbody is leeg',
  encode_failed: 'Bericht kon niet als JSON worden gecodeerd',
  unknown_topic: 'Niet-geabonneerd topic ontvangen: {{topic}}',
  invalid_offset: 'Ongeldige berichtoffset: {{offset}}',
  idempotent_requires_all_acks:
    'Wanneer de idempotente producer is ingeschakeld, moet acks -1 zijn',
  unsupported_sasl: 'Niet-ondersteund SASL-mechanisme: {{mechanism}}',
  unsupported_tls: 'TLS-optie kan niet aan de client worden doorgegeven: {{name}}',
  heartbeat_exceeds_session: 'Hartslaginterval moet kleiner zijn dan de sessietime-out',
});

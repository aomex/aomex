import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers darf nicht leer sein',
  empty_broker: 'brokers enthält eine leere Adresse',
  empty_client_id: 'clientId darf nicht leer sein',
  empty_group_id: 'groupId darf nicht leer sein',
  empty_topic: 'Themenname darf nicht leer sein',
  invalid_topic_name: 'Ungültiger Themenname: {{topic}}',
  topic_name_too_long: 'Themenname ist zu lang: {{length}} > {{max}}',
  duplicate_topic: 'Thema ist mehrfach registriert: {{topic}}',
  mixed_group_id: 'Ein consume-Aufruf darf nur eine groupId haben',
  empty_consumers: 'Keine Kafka-Consumer gefunden',
  already_consuming: 'Ein Consumer läuft bereits',
  closed: 'Kafka-Verbindung ist geschlossen',
  message_too_large: 'Nachrichtengröße überschreitet das Limit: {{bytes}} > {{max}}',
  invalid_json: 'Nachricht ist kein gültiges JSON',
  empty_message: 'Nachrichtentext ist leer',
  encode_failed: 'Nachricht konnte nicht als JSON kodiert werden',
  unknown_topic: 'Nicht abonniertes Thema empfangen: {{topic}}',
  invalid_offset: 'Ungültiger Nachrichten-Offset: {{offset}}',
  idempotent_requires_all_acks: 'Bei aktiviertem idempotentem Producer muss acks -1 sein',
  unsupported_sasl: 'Nicht unterstützter SASL-Mechanismus: {{mechanism}}',
  unsupported_tls: 'TLS-Option kann nicht an den Client übergeben werden: {{name}}',
  heartbeat_exceeds_session:
    'Heartbeat-Intervall muss kleiner als das Sitzungs-Timeout sein',
});

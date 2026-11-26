import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers не сме бити празан',
  empty_broker: 'brokers садржи празну адресу',
  empty_client_id: 'clientId не сме бити празан',
  empty_group_id: 'groupId не сме бити празан',
  empty_topic: 'Назив теме не сме бити празан',
  invalid_topic_name: 'Неважећи назив теме: {{topic}}',
  topic_name_too_long: 'Назив теме је предугачак: {{length}} > {{max}}',
  duplicate_topic: 'Тема је регистрована више пута: {{topic}}',
  mixed_group_id: 'Један позив consume може имати само један groupId',
  empty_consumers: 'Није пронађен ниједан Kafka потрошач',
  already_consuming: 'Потрошач већ ради',
  closed: 'Kafka веза је затворена',
  message_too_large: 'Величина поруке премашује ограничење: {{bytes}} > {{max}}',
  invalid_json: 'Порука није важећи JSON',
  empty_message: 'Тело поруке је празно',
  encode_failed: 'Порука није могла бити кодирана као JSON',
  unknown_topic: 'Примљена је непретплаћена тема: {{topic}}',
  invalid_offset: 'Неважећи помак поруке: {{offset}}',
  idempotent_requires_all_acks:
    'Када је укључен идемпотентни producer, acks мора бити -1',
  unsupported_sasl: 'Неподржани SASL механизам: {{mechanism}}',
  unsupported_tls: 'TLS опција се не може проследити клијенту: {{name}}',
  heartbeat_exceeds_session:
    'Интервал откуцаја мора бити мањи од временског ограничења сесије',
});

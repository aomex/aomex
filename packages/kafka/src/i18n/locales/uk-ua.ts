import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** uk-UA */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers не може бути порожнім',
  empty_broker: 'brokers містить порожню адресу',
  empty_client_id: 'clientId не може бути порожнім',
  empty_group_id: 'groupId не може бути порожнім',
  empty_topic: 'Назва теми не може бути порожньою',
  invalid_topic_name: 'Неприпустима назва теми: {{topic}}',
  topic_name_too_long: 'Назва теми занадто довга: {{length}} > {{max}}',
  duplicate_topic: 'Тему зареєстровано більше одного разу: {{topic}}',
  mixed_group_id: 'Один виклик consume може мати лише один groupId',
  empty_consumers: 'Споживачів Kafka не знайдено',
  already_consuming: 'Споживач уже запущений',
  closed: 'З’єднання Kafka закрито',
  message_too_large: 'Розмір повідомлення перевищує обмеження: {{bytes}} > {{max}}',
  invalid_json: 'Повідомлення не є коректним JSON',
  empty_message: 'Тіло повідомлення порожнє',
  encode_failed: 'Не вдалося закодувати повідомлення як JSON',
  unknown_topic: 'Отримано непідписану тему: {{topic}}',
  invalid_offset: 'Неприпустиме зміщення повідомлення: {{offset}}',
  idempotent_requires_all_acks: 'Коли увімкнено ідемпотентний producer, acks має бути -1',
  unsupported_sasl: 'Непідтримуваний механізм SASL: {{mechanism}}',
  unsupported_tls: 'Параметр TLS не можна передати клієнту: {{name}}',
  heartbeat_exceeds_session: 'Інтервал heartbeat має бути меншим за тайм-аут сесії',
});

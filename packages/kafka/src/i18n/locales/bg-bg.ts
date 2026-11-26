import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** bg-BG */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers не може да бъде празно',
  empty_broker: 'brokers съдържа празен адрес',
  empty_client_id: 'clientId не може да бъде празно',
  empty_group_id: 'groupId не може да бъде празно',
  empty_topic: 'Името на темата не може да бъде празно',
  invalid_topic_name: 'Невалидно име на тема: {{topic}}',
  topic_name_too_long: 'Името на темата е твърде дълго: {{length}} > {{max}}',
  duplicate_topic: 'Темата е регистрирана повторно: {{topic}}',
  mixed_group_id: 'Едно извикване за консумация може да има само един groupId',
  empty_consumers: 'Не са намерени Kafka потребители',
  already_consuming: 'Вече работи потребител',
  closed: 'Връзката с Kafka е затворена',
  message_too_large: 'Размерът на съобщението надвишава лимита: {{bytes}} > {{max}}',
  invalid_json: 'Съобщението не е валиден JSON',
  empty_message: 'Тялото на съобщението е празно',
  encode_failed: 'Съобщението не може да бъде кодирано като JSON',
  unknown_topic: 'Получена е неабонирана тема: {{topic}}',
  invalid_offset: 'Невалидно отместване на съобщение: {{offset}}',
  idempotent_requires_all_acks:
    'Когато е активиран идемпотентен продуцент, acks трябва да бъде -1',
  unsupported_sasl: 'Неподдържан SASL механизъм: {{mechanism}}',
  unsupported_tls: 'TLS конфигурацията не може да бъде предадена на клиента: {{name}}',
  heartbeat_exceeds_session:
    'Интервалът на сърдечния ритъм трябва да е по-малък от времето за изчакване на сесията',
});

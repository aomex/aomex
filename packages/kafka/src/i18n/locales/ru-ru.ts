import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ru-RU */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers не может быть пустым',
  empty_broker: 'brokers содержит пустой адрес',
  empty_client_id: 'clientId не может быть пустым',
  empty_group_id: 'groupId не может быть пустым',
  empty_topic: 'Имя темы не может быть пустым',
  invalid_topic_name: 'Недопустимое имя темы: {{topic}}',
  topic_name_too_long: 'Имя темы слишком длинное: {{length}} > {{max}}',
  duplicate_topic: 'Тема зарегистрирована более одного раза: {{topic}}',
  mixed_group_id: 'Один вызов consume может иметь только один groupId',
  empty_consumers: 'Потребители Kafka не найдены',
  already_consuming: 'Потребитель уже запущен',
  closed: 'Соединение Kafka закрыто',
  message_too_large: 'Размер сообщения превышает ограничение: {{bytes}} > {{max}}',
  invalid_json: 'Сообщение не является допустимым JSON',
  empty_message: 'Тело сообщения пусто',
  encode_failed: 'Не удалось закодировать сообщение как JSON',
  unknown_topic: 'Получена неподписанная тема: {{topic}}',
  invalid_offset: 'Недопустимое смещение сообщения: {{offset}}',
  idempotent_requires_all_acks:
    'При включённом идемпотентном producer значение acks должно быть -1',
  unsupported_sasl: 'Неподдерживаемый механизм SASL: {{mechanism}}',
  unsupported_tls: 'Параметр TLS нельзя передать клиенту: {{name}}',
  heartbeat_exceeds_session: 'Интервал heartbeat должен быть меньше тайм-аута сессии',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers не смее да биде празно',
  empty_broker: 'brokers содржи празна адреса',
  empty_client_id: 'clientId не смее да биде празно',
  empty_group_id: 'groupId не смее да биде празно',
  empty_topic: 'Името на темата не смее да биде празно',
  invalid_topic_name: 'Неважечко име на тема: {{topic}}',
  topic_name_too_long: 'Името на темата е предолго: {{length}} > {{max}}',
  duplicate_topic: 'Темата е регистрирана повеќе од еднаш: {{topic}}',
  mixed_group_id: 'Еден повик consume може да има само еден groupId',
  empty_consumers: 'Не се пронајдени Kafka потрошувачи',
  already_consuming: 'Потрошувач веќе работи',
  closed: 'Kafka врската е затворена',
  message_too_large: 'Големината на пораката го надминува лимитот: {{bytes}} > {{max}}',
  invalid_json: 'Пораката не е валиден JSON',
  empty_message: 'Телото на пораката е празно',
  encode_failed: 'Пораката не може да се кодира како JSON',
  unknown_topic: 'Примена е непретплатена тема: {{topic}}',
  invalid_offset: 'Неважечки офсет на порака: {{offset}}',
  idempotent_requires_all_acks:
    'Кога е вклучен идемпотентен producer, acks мора да биде -1',
  unsupported_sasl: 'Неподдржан SASL механизам: {{mechanism}}',
  unsupported_tls: 'TLS опцијата не може да се пренесе на клиентот: {{name}}',
  heartbeat_exceeds_session:
    'Интервалот на срцев удар мора да биде помал од времето на сесијата',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers nesmí být prázdné',
  empty_broker: 'brokers obsahuje prázdnou adresu',
  empty_client_id: 'clientId nesmí být prázdné',
  empty_group_id: 'groupId nesmí být prázdné',
  empty_topic: 'Název tématu nesmí být prázdný',
  invalid_topic_name: 'Neplatný název tématu: {{topic}}',
  topic_name_too_long: 'Název tématu je příliš dlouhý: {{length}} > {{max}}',
  duplicate_topic: 'Téma je zaregistrováno vícekrát: {{topic}}',
  mixed_group_id: 'Jedno volání consume smí mít jen jeden groupId',
  empty_consumers: 'Nebyly nalezeny žádné Kafka consumery',
  already_consuming: 'Consumer již běží',
  closed: 'Připojení Kafka je uzavřeno',
  message_too_large: 'Velikost zprávy překračuje limit: {{bytes}} > {{max}}',
  invalid_json: 'Zpráva není platný JSON',
  empty_message: 'Tělo zprávy je prázdné',
  encode_failed: 'Zprávu nelze zakódovat jako JSON',
  unknown_topic: 'Přijato neodebírané téma: {{topic}}',
  invalid_offset: 'Neplatný offset zprávy: {{offset}}',
  idempotent_requires_all_acks: 'Při zapnutém idempotentním produceru musí být acks -1',
  unsupported_sasl: 'Nepodporovaný SASL mechanismus: {{mechanism}}',
  unsupported_tls: 'Konfiguraci TLS nelze předat klientovi: {{name}}',
  heartbeat_exceeds_session: 'Interval heartbeat musí být menší než timeout relace',
});

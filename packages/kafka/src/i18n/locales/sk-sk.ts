import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers nesmie byť prázdne',
  empty_broker: 'brokers obsahuje prázdnu adresu',
  empty_client_id: 'clientId nesmie byť prázdne',
  empty_group_id: 'groupId nesmie byť prázdne',
  empty_topic: 'Názov témy nesmie byť prázdny',
  invalid_topic_name: 'Neplatný názov témy: {{topic}}',
  topic_name_too_long: 'Názov témy je príliš dlhý: {{length}} > {{max}}',
  duplicate_topic: 'Téma je zaregistrovaná viackrát: {{topic}}',
  mixed_group_id: 'Jedno volanie consume môže mať len jeden groupId',
  empty_consumers: 'Nenašli sa žiadni Kafka consumeri',
  already_consuming: 'Consumer už beží',
  closed: 'Pripojenie Kafka je zatvorené',
  message_too_large: 'Veľkosť správy prekračuje limit: {{bytes}} > {{max}}',
  invalid_json: 'Správa nie je platný JSON',
  empty_message: 'Telo správy je prázdne',
  encode_failed: 'Správu nebolo možné zakódovať ako JSON',
  unknown_topic: 'Prijatá neodobraná téma: {{topic}}',
  invalid_offset: 'Neplatný offset správy: {{offset}}',
  idempotent_requires_all_acks: 'Pri zapnutom idempotentnom producer musí byť acks -1',
  unsupported_sasl: 'Nepodporovaný SASL mechanizmus: {{mechanism}}',
  unsupported_tls: 'Voľbu TLS nie je možné odovzdať klientovi: {{name}}',
  heartbeat_exceeds_session: 'Interval heartbeat musí byť menší ako časový limit relácie',
});

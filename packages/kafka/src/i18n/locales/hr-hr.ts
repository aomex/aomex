import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ne smije biti prazan',
  empty_broker: 'brokers sadrži praznu adresu',
  empty_client_id: 'clientId ne smije biti prazan',
  empty_group_id: 'groupId ne smije biti prazan',
  empty_topic: 'Naziv teme ne smije biti prazan',
  invalid_topic_name: 'Nevažeći naziv teme: {{topic}}',
  topic_name_too_long: 'Naziv teme je predugačak: {{length}} > {{max}}',
  duplicate_topic: 'Tema je registrirana više puta: {{topic}}',
  mixed_group_id: 'Jedan poziv consume smije imati samo jedan groupId',
  empty_consumers: 'Nisu pronađeni Kafka potrošači',
  already_consuming: 'Potrošač već radi',
  closed: 'Kafka veza je zatvorena',
  message_too_large: 'Veličina poruke premašuje ograničenje: {{bytes}} > {{max}}',
  invalid_json: 'Poruka nije valjani JSON',
  empty_message: 'Tijelo poruke je prazno',
  encode_failed: 'Poruku nije moguće kodirati kao JSON',
  unknown_topic: 'Primljena je nepretplaćena tema: {{topic}}',
  invalid_offset: 'Nevažeći pomak poruke: {{offset}}',
  idempotent_requires_all_acks:
    'Kada je uključen idempotentni producer, acks mora biti -1',
  unsupported_sasl: 'Nepodržani SASL mehanizam: {{mechanism}}',
  unsupported_tls: 'TLS opciju nije moguće proslijediti klijentu: {{name}}',
  heartbeat_exceeds_session:
    'Interval otkucaja srca mora biti manji od vremenskog ograničenja sesije',
});

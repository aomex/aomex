import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers ne sme biti prazen',
  empty_broker: 'brokers vsebuje prazen naslov',
  empty_client_id: 'clientId ne sme biti prazen',
  empty_group_id: 'groupId ne sme biti prazen',
  empty_topic: 'Ime teme ne sme biti prazno',
  invalid_topic_name: 'Neveljavno ime teme: {{topic}}',
  topic_name_too_long: 'Ime teme je predolgo: {{length}} > {{max}}',
  duplicate_topic: 'Tema je registrirana več kot enkrat: {{topic}}',
  mixed_group_id: 'En klic consume sme imeti samo en groupId',
  empty_consumers: 'Ni najdenih Kafka potrošnikov',
  already_consuming: 'Potrošnik že teče',
  closed: 'Povezava Kafka je zaprta',
  message_too_large: 'Velikost sporočila presega omejitev: {{bytes}} > {{max}}',
  invalid_json: 'Sporočilo ni veljaven JSON',
  empty_message: 'Telo sporočila je prazno',
  encode_failed: 'Sporočila ni bilo mogoče kodirati kot JSON',
  unknown_topic: 'Prejeta neprejemana tema: {{topic}}',
  invalid_offset: 'Neveljaven odmik sporočila: {{offset}}',
  idempotent_requires_all_acks: 'Ko je omogočen idempotentni producer, mora biti acks -1',
  unsupported_sasl: 'Nepodprt mehanizem SASL: {{mechanism}}',
  unsupported_tls: 'Možnosti TLS ni mogoče posredovati odjemalcu: {{name}}',
  heartbeat_exceeds_session:
    'Interval srčnega utripa mora biti manjši od časovne omejitve seje',
});

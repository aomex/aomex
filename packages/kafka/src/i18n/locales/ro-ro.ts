import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers nu poate fi gol',
  empty_broker: 'brokers conține o adresă goală',
  empty_client_id: 'clientId nu poate fi gol',
  empty_group_id: 'groupId nu poate fi gol',
  empty_topic: 'Numele temei nu poate fi gol',
  invalid_topic_name: 'Nume de temă nevalid: {{topic}}',
  topic_name_too_long: 'Numele temei este prea lung: {{length}} > {{max}}',
  duplicate_topic: 'Tema este înregistrată de mai multe ori: {{topic}}',
  mixed_group_id: 'Un apel consume poate avea un singur groupId',
  empty_consumers: 'Nu s-au găsit consumatori Kafka',
  already_consuming: 'Un consumator rulează deja',
  closed: 'Conexiunea Kafka este închisă',
  message_too_large: 'Dimensiunea mesajului depășește limita: {{bytes}} > {{max}}',
  invalid_json: 'Mesajul nu este un JSON valid',
  empty_message: 'Corpul mesajului este gol',
  encode_failed: 'Mesajul nu a putut fi codificat ca JSON',
  unknown_topic: 'S-a primit o temă neabonată: {{topic}}',
  invalid_offset: 'Deplasare de mesaj nevalidă: {{offset}}',
  idempotent_requires_all_acks:
    'Când producerul idempotent este activat, acks trebuie să fie -1',
  unsupported_sasl: 'Mecanism SASL neacceptat: {{mechanism}}',
  unsupported_tls: 'Opțiunea TLS nu poate fi transmisă clientului: {{name}}',
  heartbeat_exceeds_session:
    'Intervalul de heartbeat trebuie să fie mai mic decât expirarea sesiunii',
});

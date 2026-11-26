import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers negali būti tuščias',
  empty_broker: 'brokers turi tuščią adresą',
  empty_client_id: 'clientId negali būti tuščias',
  empty_group_id: 'groupId negali būti tuščias',
  empty_topic: 'Temos pavadinimas negali būti tuščias',
  invalid_topic_name: 'Netinkamas temos pavadinimas: {{topic}}',
  topic_name_too_long: 'Temos pavadinimas per ilgas: {{length}} > {{max}}',
  duplicate_topic: 'Tema užregistruota daugiau nei vieną kartą: {{topic}}',
  mixed_group_id: 'Viename consume kvietime gali būti tik vienas groupId',
  empty_consumers: 'Kafka vartotojų nerasta',
  already_consuming: 'Vartotojas jau veikia',
  closed: 'Kafka ryšys uždarytas',
  message_too_large: 'Pranešimo dydis viršija limitą: {{bytes}} > {{max}}',
  invalid_json: 'Pranešimas nėra galiojantis JSON',
  empty_message: 'Pranešimo turinys tuščias',
  encode_failed: 'Nepavyko užkoduoti pranešimo kaip JSON',
  unknown_topic: 'Gauta neprenumeruota tema: {{topic}}',
  invalid_offset: 'Netinkamas pranešimo poslinkis: {{offset}}',
  idempotent_requires_all_acks: 'Įjungus idempotentinį producer, acks turi būti -1',
  unsupported_sasl: 'Nepalaikomas SASL mechanizmas: {{mechanism}}',
  unsupported_tls: 'TLS parinkties negalima perduoti klientui: {{name}}',
  heartbeat_exceeds_session:
    'Širdies ritmo intervalas turi būti mažesnis už sesijos skirtąjį laiką',
});

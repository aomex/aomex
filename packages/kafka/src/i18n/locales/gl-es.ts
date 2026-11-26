import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** gl-ES */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers non pode estar baleiro',
  empty_broker: 'brokers contén un enderezo baleiro',
  empty_client_id: 'clientId non pode estar baleiro',
  empty_group_id: 'groupId non pode estar baleiro',
  empty_topic: 'O nome do tema non pode estar baleiro',
  invalid_topic_name: 'Nome de tema non válido: {{topic}}',
  topic_name_too_long: 'O nome do tema é demasiado longo: {{length}} > {{max}}',
  duplicate_topic: 'O tema está rexistrado máis dunha vez: {{topic}}',
  mixed_group_id: 'Unha chamada de consumo só pode ter un groupId',
  empty_consumers: 'Non se atoparon consumidores de Kafka',
  already_consuming: 'Xa hai un consumidor en execución',
  closed: 'A conexión de Kafka está pechada',
  message_too_large: 'O tamaño da mensaxe supera o límite: {{bytes}} > {{max}}',
  invalid_json: 'A mensaxe non é un JSON válido',
  empty_message: 'O corpo da mensaxe está baleiro',
  encode_failed: 'Non se puido codificar a mensaxe como JSON',
  unknown_topic: 'Recibiuse un tema non subscrito: {{topic}}',
  invalid_offset: 'Desprazamento de mensaxe non válido: {{offset}}',
  idempotent_requires_all_acks: 'Co produtor idempotente activado, acks debe ser -1',
  unsupported_sasl: 'Mecanismo SASL non compatible: {{mechanism}}',
  unsupported_tls: 'A opción TLS non se pode pasar ao cliente: {{name}}',
  heartbeat_exceeds_session:
    'O intervalo de latido debe ser menor que o tempo de espera da sesión',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** es-ES */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers no puede estar vacío',
  empty_broker: 'brokers contiene una dirección vacía',
  empty_client_id: 'clientId no puede estar vacío',
  empty_group_id: 'groupId no puede estar vacío',
  empty_topic: 'El nombre del tema no puede estar vacío',
  invalid_topic_name: 'Nombre de tema no válido: {{topic}}',
  topic_name_too_long: 'El nombre del tema es demasiado largo: {{length}} > {{max}}',
  duplicate_topic: 'El tema está registrado más de una vez: {{topic}}',
  mixed_group_id: 'Una llamada de consumo solo puede tener un groupId',
  empty_consumers: 'No se encontraron consumidores de Kafka',
  already_consuming: 'Ya hay un consumidor en ejecución',
  closed: 'La conexión de Kafka está cerrada',
  message_too_large: 'El tamaño del mensaje supera el límite: {{bytes}} > {{max}}',
  invalid_json: 'El mensaje no es un JSON válido',
  empty_message: 'El cuerpo del mensaje está vacío',
  encode_failed: 'No se pudo codificar el mensaje como JSON',
  unknown_topic: 'Se recibió un tema no suscrito: {{topic}}',
  invalid_offset: 'Desplazamiento de mensaje no válido: {{offset}}',
  idempotent_requires_all_acks: 'Con el productor idempotente activado, acks debe ser -1',
  unsupported_sasl: 'Mecanismo SASL no compatible: {{mechanism}}',
  unsupported_tls: 'La opción TLS no se puede pasar al cliente: {{name}}',
  heartbeat_exceeds_session:
    'El intervalo de latido debe ser menor que el tiempo de espera de la sesión',
});

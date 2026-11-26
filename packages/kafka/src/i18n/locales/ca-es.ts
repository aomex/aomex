import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers no pot estar buit',
  empty_broker: 'brokers conté una adreça buida',
  empty_client_id: 'clientId no pot estar buit',
  empty_group_id: 'groupId no pot estar buit',
  empty_topic: 'El nom del tema no pot estar buit',
  invalid_topic_name: 'Nom de tema no vàlid: {{topic}}',
  topic_name_too_long: 'El nom del tema és massa llarg: {{length}} > {{max}}',
  duplicate_topic: 'El tema està registrat més d’una vegada: {{topic}}',
  mixed_group_id: 'Una crida de consum només pot tenir un groupId',
  empty_consumers: 'No s’han trobat consumidors de Kafka',
  already_consuming: 'Ja hi ha un consumidor en execució',
  closed: 'La connexió de Kafka està tancada',
  message_too_large: 'La mida del missatge supera el límit: {{bytes}} > {{max}}',
  invalid_json: 'El missatge no és un JSON vàlid',
  empty_message: 'El cos del missatge està buit',
  encode_failed: 'No s’ha pogut codificar el missatge com a JSON',
  unknown_topic: 'S’ha rebut un tema no subscrit: {{topic}}',
  invalid_offset: 'Desplaçament de missatge no vàlid: {{offset}}',
  idempotent_requires_all_acks: 'Amb el productor idempotent activat, acks ha de ser -1',
  unsupported_sasl: 'Mecanisme SASL no compatible: {{mechanism}}',
  unsupported_tls: 'La configuració TLS no es pot passar al client: {{name}}',
  heartbeat_exceeds_session:
    'L’interval de batec ha de ser inferior al temps d’espera de la sessió',
});

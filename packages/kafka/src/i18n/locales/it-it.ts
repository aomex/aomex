import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers non può essere vuoto',
  empty_broker: 'brokers contiene un indirizzo vuoto',
  empty_client_id: 'clientId non può essere vuoto',
  empty_group_id: 'groupId non può essere vuoto',
  empty_topic: 'Il nome del topic non può essere vuoto',
  invalid_topic_name: 'Nome topic non valido: {{topic}}',
  topic_name_too_long: 'Il nome del topic è troppo lungo: {{length}} > {{max}}',
  duplicate_topic: 'Il topic è registrato più di una volta: {{topic}}',
  mixed_group_id: 'Una chiamata consume può avere un solo groupId',
  empty_consumers: 'Nessun consumer Kafka trovato',
  already_consuming: 'Un consumer è già in esecuzione',
  closed: 'La connessione Kafka è chiusa',
  message_too_large: 'La dimensione del messaggio supera il limite: {{bytes}} > {{max}}',
  invalid_json: 'Il messaggio non è un JSON valido',
  empty_message: 'Il corpo del messaggio è vuoto',
  encode_failed: 'Impossibile codificare il messaggio come JSON',
  unknown_topic: 'Ricevuto un topic non sottoscritto: {{topic}}',
  invalid_offset: 'Offset del messaggio non valido: {{offset}}',
  idempotent_requires_all_acks:
    'Con il producer idempotente abilitato, acks deve essere -1',
  unsupported_sasl: 'Meccanismo SASL non supportato: {{mechanism}}',
  unsupported_tls: 'L’opzione TLS non può essere passata al client: {{name}}',
  heartbeat_exceeds_session:
    'L’intervallo di heartbeat deve essere inferiore al timeout della sessione',
});

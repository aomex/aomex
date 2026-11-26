import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers nie może być puste',
  empty_broker: 'brokers zawiera pusty adres',
  empty_client_id: 'clientId nie może być puste',
  empty_group_id: 'groupId nie może być puste',
  empty_topic: 'Nazwa tematu nie może być pusta',
  invalid_topic_name: 'Nieprawidłowa nazwa tematu: {{topic}}',
  topic_name_too_long: 'Nazwa tematu jest za długa: {{length}} > {{max}}',
  duplicate_topic: 'Temat jest zarejestrowany więcej niż raz: {{topic}}',
  mixed_group_id: 'Jedno wywołanie consume może mieć tylko jeden groupId',
  empty_consumers: 'Nie znaleziono konsumentów Kafka',
  already_consuming: 'Konsument już działa',
  closed: 'Połączenie Kafka jest zamknięte',
  message_too_large: 'Rozmiar wiadomości przekracza limit: {{bytes}} > {{max}}',
  invalid_json: 'Wiadomość nie jest prawidłowym JSON',
  empty_message: 'Treść wiadomości jest pusta',
  encode_failed: 'Nie można zakodować wiadomości jako JSON',
  unknown_topic: 'Otrzymano niezasubskrybowany temat: {{topic}}',
  invalid_offset: 'Nieprawidłowe przesunięcie wiadomości: {{offset}}',
  idempotent_requires_all_acks:
    'Gdy włączony jest idempotentny producer, acks musi być -1',
  unsupported_sasl: 'Nieobsługiwany mechanizm SASL: {{mechanism}}',
  unsupported_tls: 'Opcji TLS nie można przekazać klientowi: {{name}}',
  heartbeat_exceeds_session:
    'Interwał bicia serca musi być mniejszy niż limit czasu sesji',
});

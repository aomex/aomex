import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** pl-PL */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nieprawidłowa nazwa zdarzenia',
  invalid_room_name: 'Nieprawidłowa nazwa pokoju',
  unknown_event: 'Nieznane zdarzenie: {{event}}',
  handler_error: 'Obsługa zdarzenia nie powiodła się',
  duplicate_event: 'Zdarzenie jest już zarejestrowane: {{event}}',
  already_attached: 'WebsocketApp jest już attach, nie montuj ponownie',
  transport_init_failed: 'Nie udało się zainicjować transportu WebSocket',
  handshake_failed: 'Nie udało się nawiązać uzgadniania WebSocket',
  accept_failed: 'Nie udało się przyjąć połączenia',
  fanout_deliver_failed:
    'Podczas rozsyłania nie udało się zapisać do {{failed}} połączeń',
  inbound_task_failed: 'Nie udało się obsłużyć zdarzenia przychodzącego',
  error_frame_failed: 'Nie udało się wysłać ramki błędu',
  remove_client_failed: 'Nie udało się usunąć połączenia',
  close_connection_failed: 'Nie udało się zamknąć połączenia',
  metric_handler_failed: 'Błąd wywołania metryk',
});

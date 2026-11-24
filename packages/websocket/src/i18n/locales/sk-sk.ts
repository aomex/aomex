import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Neplatný názov udalosti',
  invalid_room_name: 'Neplatný názov miestnosti',
  unknown_event: 'Neznáma udalosť: {{event}}',
  handler_error: 'Spracovanie udalosti zlyhalo',
  duplicate_event: 'Udalosť je už zaregistrovaná: {{event}}',
  already_attached: 'WebsocketApp je už attach, nepripájajte znova',
  transport_init_failed: 'Inicializácia WebSocket transportu zlyhala',
  handshake_failed: 'WebSocket handshake zlyhal',
  accept_failed: 'Prijatie spojenia zlyhalo',
  fanout_deliver_failed: 'Počas fanoutu zlyhal zápis pri {{failed}} spojeniach',
  inbound_task_failed: 'Spracovanie prichádzajúcej udalosti zlyhalo',
  error_frame_failed: 'Odoslanie chybového rámca zlyhalo',
  remove_client_failed: 'Odstránenie spojenia zlyhalo',
  close_connection_failed: 'Zatvorenie spojenia zlyhalo',
  metric_handler_failed: 'Callback metrík zlyhal',
});

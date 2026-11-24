import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ungültiger Ereignisname',
  invalid_room_name: 'Ungültiger Raumname',
  unknown_event: 'Unbekanntes Ereignis: {{event}}',
  handler_error: 'Ereignisverarbeitung fehlgeschlagen',
  duplicate_event: 'Ereignis bereits registriert: {{event}}',
  already_attached: 'WebsocketApp ist bereits attach, nicht erneut einhängen',
  transport_init_failed: 'WebSocket-Transport konnte nicht initialisiert werden',
  handshake_failed: 'WebSocket-Handshake fehlgeschlagen',
  accept_failed: 'Verbindung konnte nicht angenommen werden',
  fanout_deliver_failed:
    'Beim Fanout sind {{failed}} Verbindungsschreibvorgänge fehlgeschlagen',
  inbound_task_failed: 'Verarbeitung des eingehenden Ereignisses fehlgeschlagen',
  error_frame_failed: 'Fehlerframe konnte nicht gesendet werden',
  remove_client_failed: 'Verbindung konnte nicht entfernt werden',
  close_connection_failed: 'Verbindung konnte nicht geschlossen werden',
  metric_handler_failed: 'Metrik-Callback fehlgeschlagen',
});

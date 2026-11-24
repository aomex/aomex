import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nume de eveniment nevalid',
  invalid_room_name: 'Nume de cameră nevalid',
  unknown_event: 'Eveniment necunoscut: {{event}}',
  handler_error: 'Procesarea evenimentului a eșuat',
  duplicate_event: 'Eveniment deja înregistrat: {{event}}',
  already_attached: 'WebsocketApp este deja attach, nu îl mai montați',
  transport_init_failed: 'Inițializarea transportului WebSocket a eșuat',
  handshake_failed: 'Handshake-ul WebSocket a eșuat',
  accept_failed: 'Acceptarea conexiunii a eșuat',
  fanout_deliver_failed: '{{failed}} scrieri de conexiune au eșuat în timpul fanout-ului',
  inbound_task_failed: 'Procesarea evenimentului de intrare a eșuat',
  error_frame_failed: 'Trimiterea cadrului de eroare a eșuat',
  remove_client_failed: 'Eliminarea conexiunii a eșuat',
  close_connection_failed: 'Închiderea conexiunii a eșuat',
  metric_handler_failed: 'Callback-ul de metrici a eșuat',
});

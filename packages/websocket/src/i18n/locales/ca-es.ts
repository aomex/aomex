import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ca-ES */
export default I18n.satisfies(zh).define({
  invalid_event_name: "Nom d'esdeveniment no vàlid",
  invalid_room_name: 'Nom de sala no vàlid',
  unknown_event: 'Esdeveniment desconegut: {{event}}',
  handler_error: "Ha fallat el processament de l'esdeveniment",
  duplicate_event: 'Esdeveniment ja registrat: {{event}}',
  already_attached: 'WebsocketApp ja està attach, no el torneu a muntar',
  transport_init_failed: 'No s’ha pogut inicialitzar el transport WebSocket',
  handshake_failed: 'Ha fallat la encaixada de mans WebSocket',
  accept_failed: 'No s’ha pogut acceptar la connexió',
  fanout_deliver_failed:
    '{{failed}} escriptures de connexió han fallat durant la difusió',
  inbound_task_failed: 'Ha fallat el processament de l’esdeveniment entrant',
  error_frame_failed: 'No s’ha pogut enviar la trama d’error',
  remove_client_failed: 'No s’ha pogut treure la connexió',
  close_connection_failed: 'No s’ha pogut tancar la connexió',
  metric_handler_failed: 'Ha fallat la crida de mètriques',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ugyldigt hændelsesnavn',
  invalid_room_name: 'Ugyldigt rumsnavn',
  unknown_event: 'Ukendt hændelse: {{event}}',
  handler_error: 'Hændelseshåndtering mislykkedes',
  duplicate_event: 'Hændelsen er allerede registreret: {{event}}',
  already_attached: 'WebsocketApp er allerede attach, montér den ikke igen',
  transport_init_failed: 'Initialisering af WebSocket-transporten mislykkedes',
  handshake_failed: 'WebSocket-handshake mislykkedes',
  accept_failed: 'Forbindelsen kunne ikke accepteres',
  fanout_deliver_failed: '{{failed}} forbindelsesskrivninger mislykkedes under fanout',
  inbound_task_failed: 'Håndtering af den indgående hændelse mislykkedes',
  error_frame_failed: 'Fejlrammen kunne ikke sendes',
  remove_client_failed: 'Forbindelsen kunne ikke fjernes',
  close_connection_failed: 'Forbindelsen kunne ikke lukkes',
  metric_handler_failed: 'Metrik-callback mislykkedes',
});

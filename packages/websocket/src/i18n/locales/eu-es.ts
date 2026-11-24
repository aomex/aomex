import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Gertaera-izen baliogabea',
  invalid_room_name: 'Gela-izen baliogabea',
  unknown_event: 'Gertaera ezezaguna: {{event}}',
  handler_error: 'Gertaera prozesatzeak huts egin du',
  duplicate_event: 'Gertaera dagoeneko erregistratuta dago: {{event}}',
  already_attached: 'WebsocketApp dagoeneko attach dago, ez muntatu berriro',
  transport_init_failed: 'Ezin izan da WebSocket garraioa hasieratu',
  handshake_failed: 'WebSocket eskua ematea huts egin du',
  accept_failed: 'Ezin izan da konexioa onartu',
  fanout_deliver_failed: 'Hedapenean {{failed}} konexiotan idazteak huts egin du',
  inbound_task_failed: 'Sarrerako gertaera prozesatzeak huts egin du',
  error_frame_failed: 'Ezin izan da errore-markoa bidali',
  remove_client_failed: 'Ezin izan da konexioa kendu',
  close_connection_failed: 'Ezin izan da konexioa itxi',
  metric_handler_failed: 'Metrika-atzera deia huts egin du',
});

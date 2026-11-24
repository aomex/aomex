import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ga-IE */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ainm imeachta neamhbhailí',
  invalid_room_name: 'Ainm seomra neamhbhailí',
  unknown_event: 'Imeacht anaithnid: {{event}}',
  handler_error: 'Theip ar phróiseáil an imeachta',
  duplicate_event: 'Imeacht cláraithe cheana: {{event}}',
  already_attached: 'Tá WebsocketApp attach cheana, ná ceangail arís é',
  transport_init_failed: 'Theip ar thúsú iompair WebSocket',
  handshake_failed: 'Theip ar chroith láimhe WebSocket',
  accept_failed: 'Theip ar ghlacadh leis an nasc',
  fanout_deliver_failed: 'Theip ar scríobh chuig {{failed}} nasc le linn an fhanout',
  inbound_task_failed: 'Theip ar phróiseáil an imeachta isteach',
  error_frame_failed: 'Theip ar sheoladh an fhráma earráide',
  remove_client_failed: 'Theip ar bhaint an naisc',
  close_connection_failed: 'Theip ar dhúnadh an naisc',
  metric_handler_failed: 'Theip ar aisghlaoch na méadrachta',
});

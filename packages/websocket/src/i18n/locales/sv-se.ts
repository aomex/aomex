import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ogiltigt händelsenamn',
  invalid_room_name: 'Ogiltigt rumsnamn',
  unknown_event: 'Okänd händelse: {{event}}',
  handler_error: 'Händelsehanteringen misslyckades',
  duplicate_event: 'Händelsen är redan registrerad: {{event}}',
  already_attached: 'WebsocketApp är redan attach, montera inte igen',
  transport_init_failed: 'Det gick inte att initiera WebSocket-transporten',
  handshake_failed: 'WebSocket-handskakningen misslyckades',
  accept_failed: 'Det gick inte att acceptera anslutningen',
  fanout_deliver_failed: '{{failed}} anslutningsskrivningar misslyckades under fanout',
  inbound_task_failed: 'Det gick inte att hantera den inkommande händelsen',
  error_frame_failed: 'Det gick inte att skicka felramen',
  remove_client_failed: 'Det gick inte att ta bort anslutningen',
  close_connection_failed: 'Det gick inte att stänga anslutningen',
  metric_handler_failed: 'Mätvärdescallbacken misslyckades',
});

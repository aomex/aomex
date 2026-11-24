import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ugyldig hendelsesnavn',
  invalid_room_name: 'Ugyldig romnavn',
  unknown_event: 'Ukjent hendelse: {{event}}',
  handler_error: 'Hendelseshåndtering mislyktes',
  duplicate_event: 'Hendelsen er allerede registrert: {{event}}',
  already_attached: 'WebsocketApp er allerede attach, ikke monter på nytt',
  transport_init_failed: 'Klarte ikke å initialisere WebSocket-transporten',
  handshake_failed: 'WebSocket-håndtrykk mislyktes',
  accept_failed: 'Klarte ikke å godta tilkoblingen',
  fanout_deliver_failed: '{{failed}} tilkoblingsskrivinger mislyktes under fanout',
  inbound_task_failed: 'Klarte ikke å behandle den innkommende hendelsen',
  error_frame_failed: 'Klarte ikke å sende feilrammen',
  remove_client_failed: 'Klarte ikke å fjerne tilkoblingen',
  close_connection_failed: 'Klarte ikke å lukke tilkoblingen',
  metric_handler_failed: 'Metrikk-callback mislyktes',
});

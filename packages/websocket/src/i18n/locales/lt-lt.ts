import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Netinkamas įvykio pavadinimas',
  invalid_room_name: 'Netinkamas kambario pavadinimas',
  unknown_event: 'Nežinomas įvykis: {{event}}',
  handler_error: 'Įvykio apdorojimas nepavyko',
  duplicate_event: 'Įvykis jau užregistruotas: {{event}}',
  already_attached: 'WebsocketApp jau attach, neprijunkite pakartotinai',
  transport_init_failed: 'Nepavyko inicijuoti WebSocket perdavimo',
  handshake_failed: 'WebSocket rankos paspaudimas nepavyko',
  accept_failed: 'Nepavyko priimti ryšio',
  fanout_deliver_failed: 'Sklaidos metu nepavyko įrašyti į {{failed}} ryšių',
  inbound_task_failed: 'Nepavyko apdoroti įeinančio įvykio',
  error_frame_failed: 'Nepavyko išsiųsti klaidos kadro',
  remove_client_failed: 'Nepavyko pašalinti ryšio',
  close_connection_failed: 'Nepavyko uždaryti ryšio',
  metric_handler_failed: 'Metrikų atgalinis iškvietimas nepavyko',
});

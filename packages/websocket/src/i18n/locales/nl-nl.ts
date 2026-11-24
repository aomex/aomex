import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ongeldige gebeurtenisnaam',
  invalid_room_name: 'Ongeldige ruimtenaam',
  unknown_event: 'Onbekende gebeurtenis: {{event}}',
  handler_error: 'Verwerken van de gebeurtenis is mislukt',
  duplicate_event: 'Gebeurtenis al geregistreerd: {{event}}',
  already_attached: 'WebsocketApp is al attach, koppel niet opnieuw',
  transport_init_failed: 'Initialiseren van het WebSocket-transport is mislukt',
  handshake_failed: 'WebSocket-handshake is mislukt',
  accept_failed: 'Verbinding accepteren is mislukt',
  fanout_deliver_failed: '{{failed}} verbindingswrites zijn mislukt tijdens de fanout',
  inbound_task_failed: 'Verwerken van de binnenkomende gebeurtenis is mislukt',
  error_frame_failed: 'Verzenden van het foutframe is mislukt',
  remove_client_failed: 'Verwijderen van de verbinding is mislukt',
  close_connection_failed: 'Sluiten van de verbinding is mislukt',
  metric_handler_failed: 'Metric-callback is mislukt',
});

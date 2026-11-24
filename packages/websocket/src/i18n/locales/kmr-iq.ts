import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** kmr-IQ */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Navê bûyerê nederbasdar e',
  invalid_room_name: 'Navê jûrê nederbasdar e',
  unknown_event: 'Bûyera nenas: {{event}}',
  handler_error: 'Pêvajoya bûyerê têk çû',
  duplicate_event: 'Bûyer jixwe tomarkirî ye: {{event}}',
  already_attached: 'WebsocketApp jixwe attach e, careke din girê nede',
  transport_init_failed: 'Destpêkirina veguhestina WebSocket bi ser neket',
  handshake_failed: 'Destgirtina WebSocket bi ser neket',
  accept_failed: 'Girêdan nehat pejirandin',
  fanout_deliver_failed:
    'Di belavkirinê de nivîsandina {{failed}} girêdanan bi ser neket',
  inbound_task_failed: 'Pêvajoya bûyera hatî bi ser neket',
  error_frame_failed: 'Çarçoveya çewtiyê nehat şandin',
  remove_client_failed: 'Girêdan nehat rakirin',
  close_connection_failed: 'Girêdan nehat girtin',
  metric_handler_failed: 'Vegera pîvanan bi ser neket',
});

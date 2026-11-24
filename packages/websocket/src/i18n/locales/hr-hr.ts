import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nevažeći naziv događaja',
  invalid_room_name: 'Nevažeći naziv sobe',
  unknown_event: 'Nepoznat događaj: {{event}}',
  handler_error: 'Obrada događaja nije uspjela',
  duplicate_event: 'Događaj je već registriran: {{event}}',
  already_attached: 'WebsocketApp je već attach, nemojte ga ponovno montirati',
  transport_init_failed: 'Inicijalizacija WebSocket prijenosa nije uspjela',
  handshake_failed: 'WebSocket rukovanje nije uspjelo',
  accept_failed: 'Prihvaćanje veze nije uspjelo',
  fanout_deliver_failed: 'Tijekom fanouta nije uspjelo pisanje na {{failed}} veza',
  inbound_task_failed: 'Obrada ulaznog događaja nije uspjela',
  error_frame_failed: 'Slanje okvira pogreške nije uspjelo',
  remove_client_failed: 'Uklanjanje veze nije uspjelo',
  close_connection_failed: 'Zatvaranje veze nije uspjelo',
  metric_handler_failed: 'Povratni poziv metrika nije uspio',
});

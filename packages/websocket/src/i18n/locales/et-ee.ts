import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Sobimatu sündmuse nimi',
  invalid_room_name: 'Sobimatu ruumi nimi',
  unknown_event: 'Tundmatu sündmus: {{event}}',
  handler_error: 'Sündmuse töötlemine ebaõnnestus',
  duplicate_event: 'Sündmus on juba registreeritud: {{event}}',
  already_attached: 'WebsocketApp on juba attach, ärge ühendage uuesti',
  transport_init_failed: 'WebSocketi transpordi lähtestamine ebaõnnestus',
  handshake_failed: 'WebSocketi käepigistus ebaõnnestus',
  accept_failed: 'Ühenduse vastuvõtmine ebaõnnestus',
  fanout_deliver_failed: 'Levitamise ajal ebaõnnestus kirjutamine {{failed}} ühendusse',
  inbound_task_failed: 'Sissetuleva sündmuse töötlemine ebaõnnestus',
  error_frame_failed: 'Veakaadri saatmine ebaõnnestus',
  remove_client_failed: 'Ühenduse eemaldamine ebaõnnestus',
  close_connection_failed: 'Ühenduse sulgemine ebaõnnestus',
  metric_handler_failed: 'Mõõdikute tagasikutse ebaõnnestus',
});

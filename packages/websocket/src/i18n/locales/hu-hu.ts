import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Érvénytelen eseménynév',
  invalid_room_name: 'Érvénytelen szobanév',
  unknown_event: 'Ismeretlen esemény: {{event}}',
  handler_error: 'Az esemény feldolgozása sikertelen',
  duplicate_event: 'Az esemény már regisztrálva van: {{event}}',
  already_attached: 'A WebsocketApp már attach, ne csatlakoztassa újra',
  transport_init_failed: 'A WebSocket-átvitel inicializálása sikertelen',
  handshake_failed: 'A WebSocket-kézfogás sikertelen',
  accept_failed: 'A kapcsolat elfogadása sikertelen',
  fanout_deliver_failed: 'A fanout során {{failed}} kapcsolat írása sikertelen',
  inbound_task_failed: 'A bejövő esemény feldolgozása sikertelen',
  error_frame_failed: 'A hibakeret küldése sikertelen',
  remove_client_failed: 'A kapcsolat eltávolítása sikertelen',
  close_connection_failed: 'A kapcsolat lezárása sikertelen',
  metric_handler_failed: 'A metrika-visszahívás sikertelen',
});

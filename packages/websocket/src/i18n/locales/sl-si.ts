import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Neveljavno ime dogodka',
  invalid_room_name: 'Neveljavno ime sobe',
  unknown_event: 'Neznan dogodek: {{event}}',
  handler_error: 'Obdelava dogodka ni uspela',
  duplicate_event: 'Dogodek je že registriran: {{event}}',
  already_attached: 'WebsocketApp je že attach, ne nameščajte znova',
  transport_init_failed: 'Inicializacija prenosa WebSocket ni uspela',
  handshake_failed: 'Rokovanje WebSocket ni uspelo',
  accept_failed: 'Sprejem povezave ni uspel',
  fanout_deliver_failed: 'Med razpošiljanjem je spodletel zapis v {{failed}} povezav',
  inbound_task_failed: 'Obdelava dohodnega dogodka ni uspela',
  error_frame_failed: 'Pošiljanje okvira napake ni uspelo',
  remove_client_failed: 'Odstranitev povezave ni uspela',
  close_connection_failed: 'Zapiranje povezave ni uspelo',
  metric_handler_failed: 'Povratni klic meritev ni uspel',
});

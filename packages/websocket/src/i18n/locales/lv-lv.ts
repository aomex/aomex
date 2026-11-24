import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lv-LV */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nederīgs notikuma nosaukums',
  invalid_room_name: 'Nederīgs telpas nosaukums',
  unknown_event: 'Nezināms notikums: {{event}}',
  handler_error: 'Notikuma apstrāde neizdevās',
  duplicate_event: 'Notikums jau reģistrēts: {{event}}',
  already_attached: 'WebsocketApp jau ir attach, nepievienojiet atkārtoti',
  transport_init_failed: 'Neizdevās inicializēt WebSocket transportu',
  handshake_failed: 'WebSocket rokasspiediens neizdevās',
  accept_failed: 'Neizdevās pieņemt savienojumu',
  fanout_deliver_failed: 'Izplatīšanas laikā neizdevās rakstīt {{failed}} savienojumos',
  inbound_task_failed: 'Neizdevās apstrādāt ienākošo notikumu',
  error_frame_failed: 'Neizdevās nosūtīt kļūdas kadru',
  remove_client_failed: 'Neizdevās noņemt savienojumu',
  close_connection_failed: 'Neizdevās aizvērt savienojumu',
  metric_handler_failed: 'Metriku atzvanīšana neizdevās',
});

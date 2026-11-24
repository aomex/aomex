import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Ógilt atburðarheiti',
  invalid_room_name: 'Ógilt herbergisheiti',
  unknown_event: 'Óþekktur atburður: {{event}}',
  handler_error: 'Vinnsla atburðar mistókst',
  duplicate_event: 'Atburður þegar skráður: {{event}}',
  already_attached: 'WebsocketApp er þegar attach, ekki tengja aftur',
  transport_init_failed: 'Tókst ekki að frumstilla WebSocket-flutning',
  handshake_failed: 'WebSocket-handaband mistókst',
  accept_failed: 'Tókst ekki að samþykkja tengingu',
  fanout_deliver_failed: 'Skrifun í {{failed}} tengingar mistókst við dreifingu',
  inbound_task_failed: 'Tókst ekki að vinna úr komandi atburði',
  error_frame_failed: 'Tókst ekki að senda villuramma',
  remove_client_failed: 'Tókst ekki að fjarlægja tengingu',
  close_connection_failed: 'Tókst ekki að loka tengingu',
  metric_handler_failed: 'Mælingabakslag mistókst',
});

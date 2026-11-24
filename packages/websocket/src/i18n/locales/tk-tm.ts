import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Nädogry waka ady',
  invalid_room_name: 'Nädogry otag ady',
  unknown_event: 'Näbelli waka: {{event}}',
  handler_error: 'Wakany işlemek şowsuz boldy',
  duplicate_event: 'Waka eýýäm hasaba alyndy: {{event}}',
  already_attached: 'WebsocketApp eýýäm attach, gaýtadan dakmaň',
  transport_init_failed: 'WebSocket geçirijisini başlap bolmady',
  handshake_failed: 'WebSocket el sıkışmasy şowsuz boldy',
  accept_failed: 'Birikmäni kabul edip bolmady',
  fanout_deliver_failed: 'Ýaýratmakda {{failed}} birikmä ýazyp bolmady',
  inbound_task_failed: 'Gelýän wakany işläp bolmady',
  error_frame_failed: 'Ýalňyş kadrny iberip bolmady',
  remove_client_failed: 'Birikmäni aýryp bolmady',
  close_connection_failed: 'Birikmäni ýapyp bolmady',
  metric_handler_failed: 'Metrika yzyna çagyryşy şowsuz boldy',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub är stängd och kan inte sända',
  resync_failed: 'Det gick inte att återställa Redis-prenumerationer',
  sync_room_failed: 'Det gick inte att justera rumsprenumerationen: {{room}}',
  bus_fanout_failed: 'Bussfanout misslyckades',
  destroy_ready_failed: 'Det gick inte att vänta på Hub-initiering vid avstängning',
});

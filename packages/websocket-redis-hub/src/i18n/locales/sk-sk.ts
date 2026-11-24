import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub je zatvorený, vysielanie nie je možné',
  resync_failed: 'Obnovenie odberov Redis zlyhalo',
  sync_room_failed: 'Zladenie odberu miestnosti zlyhalo: {{room}}',
  bus_fanout_failed: 'Fanout zbernice zlyhal',
  destroy_ready_failed: 'Čakanie na inicializáciu Hubu pri vypnutí zlyhalo',
});

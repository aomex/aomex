import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  hub_closed: 'A RedisHub le van zárva, a szórás nem lehetséges',
  resync_failed: 'A Redis-feliratkozások visszaállítása sikertelen',
  sync_room_failed: 'A szobafeliratkozás igazítása sikertelen: {{room}}',
  bus_fanout_failed: 'A busz fanoutja sikertelen',
  destroy_ready_failed: 'A Hub inicializálására várás leállításkor sikertelen',
});

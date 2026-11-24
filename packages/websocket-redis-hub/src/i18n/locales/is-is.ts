import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub er lokað, ekki hægt að útsenda',
  resync_failed: 'Tókst ekki að endurheimta Redis-áskriftir',
  sync_room_failed: 'Tókst ekki að samræma herbergisáskrift: {{room}}',
  bus_fanout_failed: 'Rásardreifing mistókst',
  destroy_ready_failed: 'Tókst ekki að bíða eftir Hub-frumstillingu við lokun',
});

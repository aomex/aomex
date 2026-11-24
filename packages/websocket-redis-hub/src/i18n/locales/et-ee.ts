import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** et-EE */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub on suletud, edastamine pole võimalik',
  resync_failed: 'Redis-tellimuste taastamine ebaõnnestus',
  sync_room_failed: 'Ruumi tellimuse joondamine ebaõnnestus: {{room}}',
  bus_fanout_failed: 'Siini fanout ebaõnnestus',
  destroy_ready_failed: 'Sulgemisel Hubi lähtestamise ootamine ebaõnnestus',
});

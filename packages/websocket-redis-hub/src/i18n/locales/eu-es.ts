import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** eu-ES */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub itxita dago, ezin da igorri',
  resync_failed: 'Ezin izan dira Redis harpidetzak leheneratu',
  sync_room_failed: 'Ezin izan da gelako harpidetza lerrokatu: {{room}}',
  bus_fanout_failed: 'Busaren fanoutak huts egin du',
  destroy_ready_failed: 'Itxierako Hub-aren hasieratzearen itxaropenak huts egin du',
});

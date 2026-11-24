import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  hub_closed: 'Το RedisHub έχει κλείσει, η μετάδοση είναι αδύνατη',
  resync_failed: 'Η επαναφορά των συνδρομών Redis απέτυχε',
  sync_room_failed: 'Η ευθυγράμμιση της συνδρομής δωματίου απέτυχε: {{room}}',
  bus_fanout_failed: 'Η διανομή του διαύλου απέτυχε',
  destroy_ready_failed: 'Η αναμονή αρχικοποίησης του Hub κατά τον τερματισμό απέτυχε',
});

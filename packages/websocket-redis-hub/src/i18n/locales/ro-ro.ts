import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub este închis, nu se poate difuza',
  resync_failed: 'Restaurarea abonamentelor Redis a eșuat',
  sync_room_failed: 'Alinierea abonamentului camerei a eșuat: {{room}}',
  bus_fanout_failed: 'Fanout-ul magistralei a eșuat',
  destroy_ready_failed: 'Așteptarea inițializării Hub-ului la oprire a eșuat',
});

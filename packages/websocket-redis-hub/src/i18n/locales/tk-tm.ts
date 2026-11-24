import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** tk-TM */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub ýapyk, ýaýlym edip bolmaýar',
  resync_failed: 'Redis abunalaryny dikeldip bolmady',
  sync_room_failed: 'Otag abunasyny deňleşdirip bolmady: {{room}}',
  bus_fanout_failed: 'Şina üsti bilen ýaýratmak şowsuz boldy',
  destroy_ready_failed: 'Ýapylanda Hub başlangyjyna garaşyp bolmady',
});

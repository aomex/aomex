import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub е затворен, емитувањето не е можно',
  resync_failed: 'Обновувањето на претплатите на Redis не успеа',
  sync_room_failed: 'Порамнувањето на претплатата на собата не успеа: {{room}}',
  bus_fanout_failed: 'Распраќањето по магистралата не успеа',
  destroy_ready_failed: 'Чекањето на иницијализација на Hub при исклучување не успеа',
});

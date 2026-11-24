import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub on suljettu, lähetys ei onnistu',
  resync_failed: 'Redis-tilausten palautus epäonnistui',
  sync_room_failed: 'Huonetilauksen tasaus epäonnistui: {{room}}',
  bus_fanout_failed: 'Väylän fanout epäonnistui',
  destroy_ready_failed: 'Hubin alustuksen odotus epäonnistui sammutuksessa',
});

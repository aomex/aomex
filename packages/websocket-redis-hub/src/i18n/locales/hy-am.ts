import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hy-AM */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub-ը փակ է, հեռարձակումը անհնար է',
  resync_failed: 'Redis բաժանորդագրությունների վերականգնումը ձախողվեց',
  sync_room_failed: 'Սենյակի բաժանորդագրության հավասարեցումը ձախողվեց՝ {{room}}',
  bus_fanout_failed: 'Ավտոբուսի տարածումը ձախողվեց',
  destroy_ready_failed: 'Անջատման ժամանակ Hub-ի սկզբնավորման սպասումը ձախողվեց',
});

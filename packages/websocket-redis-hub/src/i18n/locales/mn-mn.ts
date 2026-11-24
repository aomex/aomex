import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mn-MN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub хаагдсан, нэвтрүүлэх боломжгүй',
  resync_failed: 'Redis захиалгыг сэргээж чадсангүй',
  sync_room_failed: 'Өрөөний захиалгыг тэгшилж чадсангүй: {{room}}',
  bus_fanout_failed: 'Шинээр тараалт амжилтгүй',
  destroy_ready_failed: 'Хаах үед Hub-ийн эхлүүлэлтийг хүлээж чадсангүй',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub ปิดแล้ว ไม่สามารถกระจายสัญญาณได้',
  resync_failed: 'กู้คืนการสมัครรับ Redis ไม่สำเร็จ',
  sync_room_failed: 'จัดแนวการสมัครรับห้องไม่สำเร็จ: {{room}}',
  bus_fanout_failed: 'การกระจายบนบัสไม่สำเร็จ',
  destroy_ready_failed: 'รอการเริ่มต้น Hub ขณะปิดไม่สำเร็จ',
});

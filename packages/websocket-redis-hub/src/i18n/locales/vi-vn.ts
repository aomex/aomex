import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  hub_closed: 'RedisHub đã đóng, không thể phát sóng',
  resync_failed: 'Khôi phục đăng ký Redis thất bại',
  sync_room_failed: 'Căn chỉnh đăng ký phòng thất bại: {{room}}',
  bus_fanout_failed: 'Phân phối trên bus thất bại',
  destroy_ready_failed: 'Chờ Hub khởi tạo khi tắt thất bại',
});

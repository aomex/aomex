import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  invalid_event_name: 'Tên sự kiện không hợp lệ',
  invalid_room_name: 'Tên phòng không hợp lệ',
  unknown_event: 'Sự kiện không xác định: {{event}}',
  handler_error: 'Xử lý sự kiện thất bại',
  duplicate_event: 'Sự kiện đã được đăng ký: {{event}}',
  already_attached: 'WebsocketApp đã attach, đừng gắn lại',
  transport_init_failed: 'Khởi tạo truyền tải WebSocket thất bại',
  handshake_failed: 'Bắt tay WebSocket thất bại',
  accept_failed: 'Chấp nhận kết nối thất bại',
  fanout_deliver_failed: '{{failed}} lần ghi kết nối thất bại trong khi phân phối',
  inbound_task_failed: 'Xử lý sự kiện đến thất bại',
  error_frame_failed: 'Gửi khung lỗi thất bại',
  remove_client_failed: 'Gỡ kết nối thất bại',
  close_connection_failed: 'Đóng kết nối thất bại',
  metric_handler_failed: 'Callback số liệu thất bại',
});

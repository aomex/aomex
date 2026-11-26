import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  empty_brokers: 'brokers không được để trống',
  empty_broker: 'brokers chứa địa chỉ trống',
  empty_client_id: 'clientId không được để trống',
  empty_group_id: 'groupId không được để trống',
  empty_topic: 'Tên chủ đề không được để trống',
  invalid_topic_name: 'Tên chủ đề không hợp lệ: {{topic}}',
  topic_name_too_long: 'Tên chủ đề quá dài: {{length}} > {{max}}',
  duplicate_topic: 'Chủ đề được đăng ký nhiều lần: {{topic}}',
  mixed_group_id: 'Một lần gọi consume chỉ được có một groupId',
  empty_consumers: 'Không tìm thấy người tiêu dùng Kafka',
  already_consuming: 'Đã có người tiêu dùng đang chạy',
  closed: 'Kết nối Kafka đã đóng',
  message_too_large: 'Kích thước tin nhắn vượt quá giới hạn: {{bytes}} > {{max}}',
  invalid_json: 'Tin nhắn không phải JSON hợp lệ',
  empty_message: 'Nội dung tin nhắn trống',
  encode_failed: 'Không thể mã hóa tin nhắn thành JSON',
  unknown_topic: 'Nhận được chủ đề chưa đăng ký: {{topic}}',
  invalid_offset: 'Độ lệch tin nhắn không hợp lệ: {{offset}}',
  idempotent_requires_all_acks: 'Khi bật producer idempotent, acks phải là -1',
  unsupported_sasl: 'Cơ chế SASL không được hỗ trợ: {{mechanism}}',
  unsupported_tls: 'Không thể chuyển tùy chọn TLS cho máy khách: {{name}}',
  heartbeat_exceeds_session: 'Khoảng nhịp tim phải nhỏ hơn thời gian chờ phiên',
});

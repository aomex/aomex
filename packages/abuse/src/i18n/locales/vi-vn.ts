import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  unknown_user_abuse_reason: 'Lý do lạm dụng người dùng không xác định: {{reason}}',
  unknown_ip_abuse_reason: 'Lý do lạm dụng IP không xác định: {{reason}}',
  duplicate_user_abuse_reason: 'Lý do lạm dụng người dùng trùng lặp: {{reason}}',
  duplicate_ip_abuse_reason: 'Lý do lạm dụng IP trùng lặp: {{reason}}',
  missing_on_ban_user: 'Phải cung cấp onBanUser khi đã cấu hình chiến lược user-abuse',
  invalid_limit: 'limit phải là số nguyên dương, nhận được: {{limit}}',
  invalid_window: 'window phải là khoảng thời gian dương, nhận được: {{window}}',
  invalid_block_for: 'blockFor phải là khoảng thời gian dương, nhận được: {{blockFor}}',
  invalid_ban_for: 'banFor phải là khoảng thời gian dương, nhận được: {{banFor}}',
  empty_honeypot_paths: 'paths của chiến lược honeypot không được để trống',
  empty_http_error_status_codes:
    'statusCodes của chiến lược http-error không được để trống',
  empty_socket_events: 'events của chiến lược socket-events không được để trống',
  blocked: 'Truy cập bị từ chối',
});

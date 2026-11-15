import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  eject: 'Xuất danh sách nhiệm vụ theo lịch trình',
  start: 'Bắt đầu một nhiệm vụ theo lịch trình',
  stop: 'Dừng các tác vụ đã lên lịch',
  stats: 'Kiểm tra trạng thái thực hiện các tác vụ đã lên lịch',
  not_started: 'Tác vụ theo lịch trình chưa được bắt đầu, cổng: {{port}}',
  invalid_cron_time: 'Biểu thức cron không hợp lệ: {{time}}',
  invalid_port: 'Cổng máy chủ không hợp lệ: {{port}} (phạm vi hợp lệ: 1-65535)',
});

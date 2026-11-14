import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** vi-VN */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Đường dẫn tệp nhật ký không hợp lệ',
  webhook_request_timed_out: 'Yêu cầu Webhook hết thời gian chờ',
  webhook_request_failed: 'Yêu cầu Webhook thất bại ({{status}} {{statusText}})',
});

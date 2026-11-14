import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fa-IR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'مسیر فایل گزارش نامعتبر است',
  webhook_request_timed_out: 'مهلت درخواست Webhook به پایان رسید',
  webhook_request_failed: 'درخواست Webhook ناموفق بود ({{status}} {{statusText}})',
});

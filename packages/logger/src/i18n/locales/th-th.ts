import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** th-TH */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'พาธไฟล์ล็อกไม่ถูกต้อง',
  webhook_request_timed_out: 'คำขอ Webhook หมดเวลา',
  webhook_request_failed: 'คำขอ Webhook ล้มเหลว ({{status}} {{statusText}})',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ar-EG */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'مسار ملف السجل غير صالح',
  webhook_request_timed_out: 'انتهت مهلة طلب Webhook',
  webhook_request_failed: 'فشل طلب Webhook ({{status}} {{statusText}})',
});

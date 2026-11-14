import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** az-AZ */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Jurnal faylının yolu etibarsızdır',
  webhook_request_timed_out: 'Webhook sorğusu vaxtı bitdi',
  webhook_request_failed: 'Webhook sorğusu uğursuz oldu ({{status}} {{statusText}})',
});

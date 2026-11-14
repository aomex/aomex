import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** he-IL */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'נתיב קובץ יומן לא חוקי',
  webhook_request_timed_out: 'תם הזמן לבקשת Webhook',
  webhook_request_failed: 'בקשת Webhook נכשלה ({{status}} {{statusText}})',
});

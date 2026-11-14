import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** el-GR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Μη έγκυρη διαδρομή αρχείου καταγραφής',
  webhook_request_timed_out: 'Λήξη χρόνου αιτήματος Webhook',
  webhook_request_failed: 'Αποτυχία αιτήματος Webhook ({{status}} {{statusText}})',
});

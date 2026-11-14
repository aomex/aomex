import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** mk-MK */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Неважечка патека на лог датотека',
  webhook_request_timed_out: 'Истече времето за Webhook барање',
  webhook_request_failed: 'Webhook барањето не успеа ({{status}} {{statusText}})',
});

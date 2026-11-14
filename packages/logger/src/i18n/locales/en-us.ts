import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

export const en = I18n.satisfies(zh).define({
  invalid_log_file_path: 'Invalid log file path',
  webhook_request_timed_out: 'Webhook request timed out',
  webhook_request_failed: 'Webhook request failed ({{status}} {{statusText}})',
});

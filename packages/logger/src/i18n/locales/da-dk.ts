import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** da-DK */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ugyldig logfilsti',
  webhook_request_timed_out: 'Webhook-anmodning fik timeout',
  webhook_request_failed: 'Webhook-anmodning mislykkedes ({{status}} {{statusText}})',
});

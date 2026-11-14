import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sv-SE */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ogiltig logsökväg',
  webhook_request_timed_out: 'Webhook-begäran tidsgräns överskriden',
  webhook_request_failed: 'Webhook-begäran misslyckades ({{status}} {{statusText}})',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hr-HR */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Nevažeća putanja log datoteke',
  webhook_request_timed_out: 'Isteklo vrijeme Webhook zahtjeva',
  webhook_request_failed: 'Webhook zahtjev nije uspio ({{status}} {{statusText}})',
});

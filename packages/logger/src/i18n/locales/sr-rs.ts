import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sr-RS */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Nevažeća putanja log datoteke',
  webhook_request_timed_out: 'Isteklo vreme Webhook zahteva',
  webhook_request_failed: 'Webhook zahtev nije uspeo ({{status}} {{statusText}})',
});

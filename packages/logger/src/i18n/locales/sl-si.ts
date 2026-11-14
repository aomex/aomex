import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sl-SI */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Neveljavna pot dnevniške datoteke',
  webhook_request_timed_out: 'Zahteva Webhook je potekla',
  webhook_request_failed: 'Zahteva Webhook ni uspela ({{status}} {{statusText}})',
});

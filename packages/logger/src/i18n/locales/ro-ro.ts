import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** ro-RO */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Cale fișier jurnal nevalidă',
  webhook_request_timed_out: 'Timeout cerere Webhook',
  webhook_request_failed: 'Cererea Webhook a eșuat ({{status}} {{statusText}})',
});

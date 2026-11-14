import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** de-DE */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ungültiger Logdateipfad',
  webhook_request_timed_out: 'Webhook-Anfrage Zeitüberschreitung',
  webhook_request_failed: 'Webhook-Anfrage fehlgeschlagen ({{status}} {{statusText}})',
});

import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** it-IT */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Percorso file di log non valido',
  webhook_request_timed_out: 'Timeout della richiesta Webhook',
  webhook_request_failed: 'Richiesta Webhook non riuscita ({{status}} {{statusText}})',
});

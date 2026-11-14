import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** cs-CZ */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Neplatná cesta k souboru protokolu',
  webhook_request_timed_out: 'Vypršel časový limit požadavku Webhook',
  webhook_request_failed: 'Požadavek Webhook selhal ({{status}} {{statusText}})',
});

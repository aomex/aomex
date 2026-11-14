import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** sk-SK */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Neplatná cesta k súboru denníka',
  webhook_request_timed_out: 'Vypršal časový limit požiadavky Webhook',
  webhook_request_failed: 'Požiadavka Webhook zlyhala ({{status}} {{statusText}})',
});

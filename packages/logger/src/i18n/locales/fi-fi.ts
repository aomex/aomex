import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** fi-FI */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Virheellinen lokitiedoston polku',
  webhook_request_timed_out: 'Webhook-pyyntö aikakatkaistiin',
  webhook_request_failed: 'Webhook-pyyntö epäonnistui ({{status}} {{statusText}})',
});

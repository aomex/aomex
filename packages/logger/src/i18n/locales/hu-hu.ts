import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** hu-HU */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Érvénytelen naplófájl-útvonal',
  webhook_request_timed_out: 'Webhook-kérés időtúllépés',
  webhook_request_failed: 'Webhook-kérés sikertelen ({{status}} {{statusText}})',
});

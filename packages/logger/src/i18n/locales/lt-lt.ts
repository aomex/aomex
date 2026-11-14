import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** lt-LT */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Netinkamas žurnalo failo kelias',
  webhook_request_timed_out: 'Webhook užklausos skirtasis laikas baigėsi',
  webhook_request_failed: 'Webhook užklausa nepavyko ({{status}} {{statusText}})',
});

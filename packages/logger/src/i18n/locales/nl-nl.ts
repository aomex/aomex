import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nl-NL */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ongeldig logbestandpad',
  webhook_request_timed_out: 'Webhook-verzoek time-out',
  webhook_request_failed: 'Webhook-verzoek mislukt ({{status}} {{statusText}})',
});

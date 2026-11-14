import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** nb-NO */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ugyldig loggfilbane',
  webhook_request_timed_out: 'Webhook-forespørsel tidsavbrudd',
  webhook_request_failed: 'Webhook-forespørsel mislyktes ({{status}} {{statusText}})',
});

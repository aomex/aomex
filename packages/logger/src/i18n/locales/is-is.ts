import { I18n } from '@aomex/common';
import { zh } from './zh-cn';

/** is-IS */
export default I18n.satisfies(zh).define({
  invalid_log_file_path: 'Ógild slóð annálsskráar',
  webhook_request_timed_out: 'Webhook-beiðni rann út á tíma',
  webhook_request_failed: 'Webhook-beiðni mistókst ({{status}} {{statusText}})',
});
